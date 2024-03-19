import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody, Container, CardHeader } from "reactstrap";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";

import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.in";
import { Link } from "react-router-dom";
import { boolean } from "yup";
import AddProduct from "./addproduct";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Breadcrumb from "../../components/Common/Breadcrumb";
import CustomButton from "src/components/Common/CustomButton";
import StatusIndicator from "src/components/statusIndicator/StatusIndicator";
import { formatCurrency } from "src/utils/formatCurrency";
interface ProductData {
  _id: string;
  vendorId: string;
  brandId: string;
  brandName: string;
  productName: string;
  shortDescription: string;
  skuId: number;
  description: string;
  productInfo: string;
  productShortInfo: string;
  images: {
    fileType: string;
    fileURL: string;
    mimeType: string;
    originalName: string;
  }[];
  rating: number;
  sellingPrice: number;
  price: number;
  mrp: number;
  tags: string;
  productCode: string;
  categoryId: string;
  categoryNamePath: string;
  categoryIdPath: string;
  isBlocked: boolean;
  stock: string;
  status: string;
  offerPrice?: number; // optional field
  attributes?: {
    attributeId: string;
    attributeName: string;
    attributeValueId: string;
    attributeValue: string;
    attributeDescription: string;
  }[];
  productDetailImages: {
    fileType: string;
    fileURL: string;
    mimeType: string;
    originalName: string;
  }[];
  warehouseSkuId?: string;
}

interface IVariant {
  _id: string;
  color: string;
  size: string;
  stock: number;
  colorCode: string;
}


const ProductDetails = () => {
  // const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // const _id = searchParams.get("_id");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const productId = params.get("_id");
  const [product, setProduct] = useState<ProductData>();
  const [productVariants, setProductVariants] = useState<IVariant[]>([]);
  const [selectedVSize, setSelectedVSize] = useState<string>("");
  const [selectedVColor, setSelectedVColor] = useState<string>("");
  const [vColors, setVColors] = useState<{ name: string; colorCode: string }[]>([]);
  const [vSizes, setVSizes] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [editedProduct, setEditedProduct] = useState<ProductData | undefined>(undefined);

  const GET_PRODUCTDETAIL = gql`
    query GetProductByVendor($input: ProductId!) {
  getProductByVendor(input: $input) {
    product {
      _id
      vendorId
      brandId
      brandName
      productName
      shortDescription
      skuId
      description
      productInfo
      productShortInfo
      images {
        fileType
        fileURL
        mimeType
        originalName
      }
      rating
      sellingPrice
      price
      mrp
      tags
      productCode
      categoryId
      categoryNamePath
      categoryIdPath
      isBlocked
      stock
      status
      offerPrice
      attributes {
        attributeId
        attributeName
        attributeValueId
        attributeValue
        attributeDescription
      }
      productDetailImages {
        fileType
        fileURL
        mimeType
        originalName
      }
      warehouseSkuId
    }
    message
  }
}
  `;
  const GET_VARIANTS = gql`
    query Variants($input: VariantsInput!) {
      getVariants(input: $input) {
        variants {
          _id
          color
          size
          stock
          colorCode
        }
      }
    }
  `;
  const PREVIEW = gql`
    mutation Mutation($input: ProductPreviewInput!) {
      submitProductForPreviewByVendor(input: $input) {
        _id
        message
      }
    }
  `;
  const { loading, error, data } = useQuery(GET_PRODUCTDETAIL, {
    variables: { input: { _id: productId } },
  });

  const [preview] = useMutation(PREVIEW);
  useEffect(() => {
    if (data && data.getProductByVendor && data.getProductByVendor.product) {
      let product: ProductData = data.getProductByVendor.product;
      setProduct(product);
      // setSelectedVSize(product.size);
      // setSelectedVColor(product.color);
      setSelectedImage(product.images[0]?.fileURL || "");
    }
  }, [data]);

  const handleaddVariant = () => {
    // if (kycData?.getKycStatus?.record?.isKycCompleted) {
    navigate(`/add-variant/?id=${productId}`);

    // } else {
    // toast.error("Complete Your KYC and Add Products");
    // }
  };

  const handlePreview = async (e: any) => {
    console.log("click");
    e.preventDefault();
    try {
      const response = await preview({
        variables: {
          input: {
            _id: data?.getProductByVendor?.product?._id,
          },
        },
      }).then((data: any) => {
        console.log("data", data);
        toast.success(data?.data?.submitProductForPreviewByVendor?.message);
      });
      // console.log(response);
    } catch (error) {
      toast.error((error as Error).message);
      console.log(error);
    }
  };

  const getProductVariant = (size: string): string => {
    for (let product of productVariants) {
      if (product.color == selectedVColor && product.size == size) {
        return product._id;
      }
    }
    return "";
  };

  const handleSizeChange = (size: string) => {
    setSelectedVSize(size);
    const id = getProductVariant(size);
    if (!id) {
      return;
    }

    if (navigate) {
      navigate(`/product/details/?_id=${id}`);
      // router.refresh()
    }
  };
  const isSizeOutOfStock = (size: string): boolean => {
    for (let product of productVariants) {
      if (product.color == selectedVColor && product.size == size && product.stock > 0) {
        return false;
      }
    }
    return true;
  };

  const renderVariants = () => {
    if (!vColors || !vColors.length) {
      return null;
    }

    return (
      <div>
        <label htmlFor="">
          <span className="text-sm font-medium">
            Color:
            <span className="ml-1 font-semibold">{selectedVColor}</span>
          </span>
        </label>
        <div className="mt-2">
          {vColors.length &&
            vColors.map((color) => (
              <div
                style={{
                  border: color.name === selectedVColor ? "1px solid #2B2B2A" : "",
                  borderRadius: "30px",
                  display: "inline-block",
                  padding: "4px",
                }}
                key={`vc-${color.name}`}
              >
                <button
                  // onClick={() => handlecolorChange(color.name)}
                  style={{
                    borderRadius: "30px",
                    width: "60px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "30px",
                    backgroundColor: color.colorCode,
                  }}
                ></button>
              </div>
            ))}
        </div>
      </div>
    );
  };
  const renderSizeList = () => {
    if (!vSizes || vSizes.length === 0) {
      return null;
    }
    return (
      <div>
        <div className="flex font-medium text-sm justify-between">
          <label htmlFor="">
            <span className="">
              Size:
              <span className="ml-1 font-semibold">{selectedVSize}</span>
            </span>
          </label>
          <div>
            {vSizes.length &&
              vSizes.map((size) => {
                const isActive = size === selectedVSize;
                const sizeOutStock = isSizeOutOfStock(size);
                const isExists = getProductVariant(size);
                if (!isExists) {
                  return <></>;
                }

                return (
                  <button
                    onClick={() => handleSizeChange(size)}
                    style={{
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1px solid #2B2B2A",
                      marginRight: "10px",
                      marginTop: "10px",
                      backgroundColor: sizeOutStock
                        ? isActive
                          ? "#2B2B2A "
                          : "#E3E5E4"
                        : isActive
                          ? "#2B2B2A "
                          : "white",
                      minWidth: "70px",
                      height: "50px",
                      color: isActive ? "white" : "#2B2B2A",
                    }}
                    key={`vs-${size}`}
                  >
                    {size}
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    );
  };

  const [edit, setEdit] = useState(false);

  const handleEditProduct = () => {
    setEditedProduct(product);
    setEdit(true);
  };


  const items = [
    { text: "Dashboard", link: `/` },
    { text: "Products", link: `/product` },
    { text: "Variants", link: `/product/variant?_code=${product?.productCode}` },
  ];


  return (
    <React.Fragment>
      {edit ? (
        <AddProduct Edit={true} editedProduct={editedProduct} />
      ) : (
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb items={items} currentPage="View Product" />

            <div className="d-flex justify-content-between mb-3">
              <div style={{ width: "auto" }}>
                <p style={{ margin: 0, fontWeight: 500, display: "flex" }}>
                  <p style={{ margin: 0, fontWeight: 500, width: "100px" }}>Category : </p>
                  {product?.categoryNamePath}
                </p>
                <p style={{ margin: 0, fontWeight: 500, display: "flex" }}>
                  <p style={{ margin: 0, fontWeight: 500, width: "100px" }}> Sku ID : </p>
                  {product?.skuId}
                </p>
                <p style={{ margin: 0, fontWeight: 500, display: "flex" }}>
                  <p style={{ margin: 0, fontWeight: 500, width: "100px" }}>Status : </p>
                  {product?.status}
                </p>
                {
                  product?.status === "REJECTED" &&
                  <p style={{ margin: 0, fontWeight: 500, display: "flex" }}>
                    <p style={{ margin: 0, fontWeight: 500, width: "100px" }}>Reject Reason : </p>
                    {"nill"}
                  </p>
                }
              </div>
              <CustomButton
                onClick={handleEditProduct}
                name="Edit Product"
                icon="ic:baseline-edit"
              />
            </div>
            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    <form action="#">
                      <Row>
                        <Col xl={6}>
                          <div className="mb-3">
                            <label htmlFor="cleave-time-format" className="form-label">
                              Images :
                            </label>

                            <div style={{ display: "flex", marginTop: "10px" }}>
                              {product?.images.map((item, index) => (
                                <div
                                  key={index}
                                  className="relative"
                                  style={{ marginRight: "10px" }}
                                >
                                  <img
                                    src={item?.fileURL}
                                    className="w-full rounded-2xl object-cover products-image"
                                    // onClick={() => handleImageClick(item?.fileURL)}
                                    alt={`product detail ${index + 1}`}
                                    style={{
                                      width: "100px",
                                      height: "100px",
                                      objectFit: "contain",
                                      borderRadius: "8px",
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </Col>
                      </Row>

                      <div className="border mt-3 border-dashed"></div>

                      <Row style={{ marginTop: "10px" }}>
                        <Col xl={6}>
                          <div className="mb-3">
                            <label htmlFor="cleave-time-format" className="form-label">
                              Detail Images :
                            </label>

                            <div style={{ display: "flex", marginTop: "10px" }}>
                              {product?.productDetailImages.map((item, index) => (
                                <div
                                  key={index}
                                  className="relative"
                                  style={{ marginRight: "10px" }}
                                >
                                  <img
                                    src={item?.fileURL}
                                    className="w-full rounded-2xl object-cover products-image"
                                    // onClick={() => handleImageClick(item?.fileURL)}
                                    alt={`product detail ${index + 1}`}
                                    style={{
                                      width: "100px",
                                      height: "100px",
                                      objectFit: "contain",
                                      borderRadius: "8px",
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </Col>
                      </Row>

                      <div className="border mt-3 border-dashed"></div>

                      <div className="mt-3">
                        <Row>
                          <Col xl={6}>
                            <div className="" style={{ display: "flex", gap: "4px" }}>
                              <label htmlFor="cleave-date" className="form-label">
                                Name:
                              </label>
                              <p className="form-control-static">{product?.productName}</p>
                            </div>
                          </Col>

                          <Col xl={3}>
                            <div
                              className=""
                              style={{ display: "flex", gap: "4px", alignItems: "center" }}
                            >
                              <label htmlFor="cleave-date" className="form-label">
                                Status :&nbsp;
                              </label>
                              <p className="form-control-static">
                                <StatusIndicator
                                  status={product?.isBlocked ? "BLOCKED" : "ACTIVE"}
                                  variant="chip"
                                />
                              </p>
                            </div>
                          </Col>
                          <Col xl={3}>
                            <div className="" style={{ display: "flex", gap: "4px" }}>
                              <label htmlFor="cleave-date" className="form-label">
                                Stock :
                              </label>
                              <p className="form-control-static">{product?.stock}</p>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <div className="border mt-3 border-dashed"></div>

                      <div className="mt-4">
                        <Row>
                          <Col xl={6}>
                            <div className="mb-3">
                              <label htmlFor="cleave-time-format" className="form-label">
                                Description:
                              </label>
                              <p className="form-control-static">{product?.description}</p>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <div className="border mt-3 border-dashed"></div>
                      <div className="mt-4">
                        <Row>
                          <Col xl={6}>
                            <div className="mb-3">
                              <label htmlFor="cleave-time-format" className="form-label">
                                {" "}
                                Short Description:
                              </label>
                              <p className="form-control-static">{product?.shortDescription}</p>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className="border mt-3 border-dashed"></div>

                      <div className="mt-4">
                        <Row>
                          <Col xl={6}>
                            {product?.attributes?.map((attribute, index) => (
                              <div key={index}>
                                <div className="mb-3" key={index}>
                                  <label htmlFor="cleave-time-format" className="form-label">
                                    {attribute.attributeDescription}
                                  </label>
                                  <p className="form-control-static">{attribute.attributeValue}</p>
                                </div>
                              </div>
                            ))}
                          </Col>
                        </Row>
                      </div>
                      <div className="border mt-3 border-dashed"></div>

                      <div className="mt-4">
                        <Row>
                          <Col xl={4}>
                            <div className="mb-3" style={{ display: "flex", gap: "4px" }}>
                              <label htmlFor="cleave-numeral" className="form-label">
                                {" "}
                                MRP :
                              </label>
                              <p className="form-control-static">{formatCurrency(product?.mrp)}</p>
                            </div>
                          </Col>

                          <Col xl={4}>
                            <div className="mb-3" style={{ display: "flex", gap: "4px" }}>
                              <label htmlFor="cleave-phone" className="form-label">
                                Price :
                              </label>
                              <p className="form-control-static">
                                {formatCurrency(product?.price)}
                              </p>
                            </div>
                          </Col>

                          <Col xl={4}>
                            <div className="mb-3" style={{ display: "flex", gap: "4px" }}>
                              <label htmlFor="cleave-numeral" className="form-label">
                                Selling Price :
                              </label>
                              <p className="form-control-static">
                                {formatCurrency(product?.sellingPrice)}
                              </p>
                            </div>
                          </Col>

                          <Col xl={6}>
                            <div className="mb-3" style={{ display: "flex", gap: "4px" }}>
                              <label htmlFor="cleave-numeral" className="form-label">
                                tags:
                              </label>
                              <p className="form-control-static">{product?.tags}</p>
                            </div>
                          </Col>


                        </Row>
                      </div>
                    </form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </React.Fragment>
  );
};

export default ProductDetails;
