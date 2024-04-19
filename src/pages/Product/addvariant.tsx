import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useDropzone, FileWithPath } from "react-dropzone";
import { gql, useQuery, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import {
  Row,
  Col,
  Card,
  CardBody,
  Container,
  CardHeader,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Table,
  ButtonToggle,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import FileUpload from "react-drag-n-drop-image";
import Catattributes from "./catattribute";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Icon } from "@ailibs/feather-react-ts";
import styles from "../Kyc/kyc.module.css";
import Breadcrumb from "../../components/Common/Breadcrumb";

interface ProductInfoInput {
  [key: string]: string;
}
interface ProductForm {
  productName: string;
  description: string;
  shortDescription: string;
  price: string;
  mrp: string;
  sellingPrice: string;
  tags: string;
  image: FileWithPath[];
  stock: string;
  isBlocked: boolean;
  // showFirst: boolean;
  rating: string;
  skuId: string;
  material: string;
  size: string;
  color: string;
  productCode: number;
  productInfo: string[];
  brandName: string;
  categoryNamePath: string;
  brandId: string;
  media: any;
  images: any;
}
interface ProductData {
  _id: string;
  color: string;
  size: string;
  description: string;
  material: string;
  shortDescription: string;
  images: {
    fileURL: string;
  }[];
  mrp: number;
  productCode: string;
  productName: string;
  brandId: string;
  rating: number;
  sellingPrice: number;
  price: number;
  tags: string;
  stock: string;
  skuId: number;
  categoryNamePath: string;
  isBlocked: boolean;
}
const CREATE_VARIENT = gql`
  mutation CreateVariant($input: VariantInput!, $images: [Upload], $productDetailImages: [Upload]) {
    createVariant(input: $input, images: $images, productDetailImages: $productDetailImages) {
      message
    }
  }
`;

const GET_PRODUCTDETAIL = gql`
  query GetProductByVendor($input: ProductId!) {
    getProductByVendor(input: $input) {
      message
      product {
        _id
        attributes {
          attributeValueId
          attributeValue
          attributeName
          attributeDescription
          attributeId
        }
        brandId
        brandName
        categoryId
        categoryIdPath
        categoryNamePath
        description
        material
        isBlocked
        mrp
        price
        productCode
        productInfo
        productName
        brandId
        rating
        sellingPrice
        shortDescription
        skuId
        status
        stock
        tags
        vendorId
        images {
          originalName
          fileURL
          fileType
        }
      }
    }
  }
`;

const GET_CATEGORY = gql`
  query GetAllCategoriesOfVendor($input: vendorIdInput!) {
    getAllCategoriesOfVendor(input: $input) {
      records {
        _id
        categoryName
        fullCategoryName
        isBlocked
        isLeaf
      }
    }
  }
`;
const GET_BRAND = gql`
  query GetAllBrandRecordsWithVendorByVendor($input: getAllBrandRecordsWithVendorByVendorInput!) {
    getAllBrandRecordsWithVendorByVendor(input: $input) {
      maxRecords
      message
      records {
        _id
        brandName
        isBlocked
        logo {
          fileType
          fileURL
          originalName
        }
        isPopular
        priority
      }
    }
  }
`;

const AddVariant = ({}) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const categoryId = params.get("catId");
  const Productid = params.get("id");
  const productCode = params.get("code");
  console.log(Productid);

  const { loading, error, data } = useQuery(GET_PRODUCTDETAIL, {
    variables: { input: { _id: Productid } },
  });

  console.log(data);
  const [remarks, setRemarks] = useState<any>([""]);
  const navigate = useNavigate();

  useEffect(() => {
    setValue("productName", data?.getProductByVendor?.product?.productName);
    setValue("description", data?.getProductByVendor?.product?.description);
    setValue("sellingPrice", data?.getProductByVendor?.product?.sellingPrice);
    setValue("price", data?.getProductByVendor?.product?.price);
    setValue("rating", data?.getProductByVendor?.product?.rating);
    setValue("mrp", data?.getProductByVendor?.product?.mrp);
    setValue("shortDescription", data?.getProductByVendor?.product?.shortDescription);
    setValue("skuId", data?.getProductByVendor?.product?.skuId);
    // setValue("stock", data?.getProductByVendor?.product?.stock);
    setValue("tags", data?.getProductByVendor?.product?.tags);
    setValue("categoryNamePath", data?.getProductByVendor?.product?.categoryNamePath);
    setRemarks(data?.getProductByVendor?.product?.productInfo || [""]);
    setValue("media", "");
    setValue("images", "");
  }, [data]);
  const {
    control,
    handleSubmit,
    setValue,
    watch, // Add this line
    formState: { errors },
  } = useForm<ProductForm>({
    // Add validation rules
    criteriaMode: "all",
    shouldFocusError: true,
    mode: "onBlur",
  });

  interface IAttribute {
    _id: string;
  }

  const [createvarient] = useMutation(CREATE_VARIENT);
  const [brandData, setBrandData] = useState<any>([]);
  const [attributeid, setattributeid] = useState<IAttribute[] | []>([]);
  const [selectedbrand, setselectedbrand] = useState<any>({});

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [dropdownDisabled, setDropdownDisabled] = useState(false);
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const [categoryData, setCategoryData] = useState<any>([]);
  // useEffect(() => {
  //   // Retrieve category ID from query parameters
  //   const categoryIdParam = new URLSearchParams(location.search).get(
  //     "category"
  //   );
  //   setDropdownDisabled(true); // Disable the dropdown after setting the default category

  //   // Find the category with the matching ID from the list of categories
  //   const defaultCategory = categories.find(
  //     (category: Category) => category._id === categoryIdParam
  //   );

  //   // If a matching category is found, set it as the default selected category
  //   if (defaultCategory) {
  //     setSelectedCategory(defaultCategory);
  //   }
  // }, [categories, location.search]);

  // new
  const handleAttributesSelectChange = (selectedValues: IAttribute[]) => {
    console.log("Selected Values:", selectedValues);
    setattributeid(selectedValues);
    // You can do further processing with the selected values here
  };

  const handleAddRemark = () => {
    setRemarks([...remarks, ""]);
  };

  const handleRemoveRemark = (index: any) => {
    const updatedRemarks = [...remarks];
    updatedRemarks.splice(index, 1); // Remove the remark at the specified index
    setRemarks(updatedRemarks);
  };

  const id = localStorage?.getItem("vendorid");

  const {
    loading: categoryLoading,
    error: categoryError,
    data: categoryDataResponse,
    refetch: categoryRefetch,
  } = useQuery(GET_CATEGORY, {
    variables: {
      input: {
        vendorId: id,
      },
    },
  });
  const {
    loading: brandLoading,
    error: brandError,
    data: brandDataResponse,
    refetch: brandRefetch,
  } = useQuery(GET_BRAND, {
    variables: {
      input: {
        vendorId: id,
        page: null,
        size: 10,
      },
    },
  });
  useEffect(() => {
    setCategoryData(categoryDataResponse?.getAllCategoriesOfVendor?.records || []);
    setBrandData(brandDataResponse?.getAllBrandRecordsWithVendorByVendor?.records);
  }, [categoryDataResponse, brandDataResponse]);

  const onSubmit: SubmitHandler<ProductForm> = async (data1: any) => {
    const urlSearchParams = new URLSearchParams(location.search);
    const productCodeParam = urlSearchParams.get("productCode");
    console.log(data1);

    const formdatas = {
      description: data1?.description,
      mrp: parseInt(data1?.mrp),
      price: parseInt(data1?.price),
      productCode: parseInt(productCode || ""),
      productInfo: remarks,
      productName: data1?.productName,
      rating: parseInt(data1?.rating),
      sellingPrice: parseInt(data1?.sellingPrice),
      shortDescription: data1?.shortDescription,
      skuId: data1?.skuId,
      // stock: parseInt(data1?.stock),
      tags: data?.tags,
      attributes: attributeid,
    };

    const file = data1?.images?.map((image: any) => image.file);

    const medias = data1?.media?.map((media: any) => media.file);

    try {
      const variables: any = {
        input: { ...formdatas, stock: 0 },
        images: null,
        productDetailImages: null,
      };

      if (file?.length > 0) {
        variables.images = file;
      }

      if (medias?.length > 0) {
        variables.productDetailImages = medias;
      }

      const response = await createvarient({
        variables,
      });

      if (response) {
        toast.success(response?.data?.createvarient?.message);
        navigate(`/product/variant?_code=${productCode}`);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const items = [
    { text: "Dashboard", link: `/` },
    { text: "Products", link: `/product` },
    { text: "Variants", link: `/product/variant?_code=${productCode}` },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb items={items} currentPage="Add Variant" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormGroup>
                      <Label for="name">Name</Label>
                      <Controller
                        control={control}
                        name="productName"
                        rules={{ required: "Name is required" }}
                        render={({ field }) => (
                          <>
                            <Input type="text" id="name" {...field} className={styles.inputfield} />
                            {errors.productName && (
                              <p className="text-danger">{errors.productName.message}</p>
                            )}
                          </>
                        )}
                      />
                    </FormGroup>
                    {/* <FormGroup>
                      <label>Category</label>
                      <Controller
                        control={control}
                        name="categoryNamePath"
                        render={({ field }) => (
                          <>
                            <Input
                              type="text"
                              id="categoryNamePath"
                              {...field}
                              className={styles.inputfield}
                              disabled
                            />
                            {errors.price && <p className="text-danger">{errors.price.message}</p>}
                          </>
                        )}
                      />
                    </FormGroup> */}
                    <Catattributes
                      selectedCategoryData={categoryId}
                      onSelectChange={handleAttributesSelectChange}
                    />

                    <FormGroup>
                      <Label for="price">Product Short Description</Label>
                      <Controller
                        control={control}
                        name="shortDescription"
                        rules={{ required: "Price is required" }}
                        render={({ field }) => (
                          <>
                            <Input
                              type="text"
                              id="shortDescription"
                              {...field}
                              className={styles.inputfield}
                            />
                            {errors.price && <p className="text-danger">{errors.price.message}</p>}
                          </>
                        )}
                      />
                    </FormGroup>

                    {/* <FormGroup>
                      <Label for="name">Brand</Label>
                      <Controller
                        control={control}
                        name="brandName"
                        render={({ field }) => (
                          <>
                            <Input
                              type="text"
                              id="brandName"
                              {...field}
                              className={styles.inputfield}
                              disabled
                            />
                            {errors.price && <p className="text-danger">{errors.price.message}</p>}
                          </>
                        )}
                      />
                    </FormGroup> */}
                    <FormGroup>
                      <Label for="description">Description</Label>
                      <Controller
                        control={control}
                        name="description"
                        rules={{ required: "Description is required" }}
                        render={({ field }) => (
                          <>
                            <Input
                              type="textarea"
                              id="description"
                              className={styles.inputfield}
                              {...field}
                            />
                            {errors.description && (
                              <p className="text-danger">{errors.description.message}</p>
                            )}
                          </>
                        )}
                      />
                    </FormGroup>

                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="price">MRP</Label>
                          <Controller
                            control={control}
                            name="mrp"
                            rules={{ required: "MRP is required" }}
                            render={({ field }) => (
                              <>
                                <Input
                                  type="number"
                                  id="price"
                                  {...field}
                                  className={styles.inputfield}
                                />
                                {errors.mrp && <p className="text-danger">{errors.mrp.message}</p>}
                              </>
                            )}
                          />
                        </FormGroup>
                      </Col>

                      <Col md={6}>
                        <FormGroup>
                          <Label for="price">Price</Label>
                          <Controller
                            control={control}
                            name="price"
                            rules={{ required: "Price is required" }}
                            render={({ field }) => (
                              <>
                                <Input
                                  type="number"
                                  id="price"
                                  {...field}
                                  className={styles.inputfield}
                                />
                                {errors.price && (
                                  <p className="text-danger">{errors.price.message}</p>
                                )}
                              </>
                            )}
                          />
                        </FormGroup>
                      </Col>

                      <Col md={6}>
                        <FormGroup>
                          <Label for="price">Selling Price</Label>
                          <Controller
                            control={control}
                            name="sellingPrice"
                            rules={{ required: "sellingPrice is required" }}
                            render={({ field }) => (
                              <>
                                <Input
                                  type="number"
                                  id="price"
                                  className={styles.inputfield}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  value={field.value}
                                />
                                {errors.sellingPrice && (
                                  <p className="text-danger">{errors.sellingPrice.message}</p>
                                )}
                              </>
                            )}
                          />
                        </FormGroup>
                      </Col>

                      {/* <Col md={6}>
                        <FormGroup>
                          <Label for="price">Offer Price</Label>
                          <Controller
                            control={control}
                            name="offerPrice"
                            rules={{ required: "Price is required" }}
                            render={({ field }) => (
                              <>
                                <Input
                                  type="number"
                                  id="offerPrice"
                                  {...field}
                                  className={styles.inputfield}
                                />
                                {errors.price && (
                                  <p className="text-danger">
                                    {errors.price.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </FormGroup>
                      </Col> */}
                    </Row>
                    <Row>
                      {/* <Col md={6}>
                        <FormGroup>
                          <Label for="stock">Stock</Label>
                          <Controller
                            control={control}
                            name="stock"
                            rules={{ required: "Stock is required" }}
                            render={({ field }) => (
                              <>
                                <Input
                                  type="text"
                                  id="stock"
                                  {...field}
                                  className={styles.inputfield}
                                />
                                {errors.stock && (
                                  <p className="text-danger">{errors.stock.message}</p>
                                )}
                              </>
                            )}
                          />
                        </FormGroup>
                      </Col> */}
                      <Col md={6}>
                        <FormGroup>
                          <Label for="tags">Tags</Label>
                          <Controller
                            control={control}
                            name="tags"
                            render={({ field }) => (
                              <>
                                <Input
                                  type="text"
                                  id="tags"
                                  {...field}
                                  className={styles.inputfield}
                                />
                                {errors.tags && (
                                  <p className="text-danger">{errors.tags.message}</p>
                                )}
                              </>
                            )}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="rating">Rating</Label>
                          <Controller
                            control={control}
                            name="rating"
                            render={({ field }) => (
                              <>
                                <Input
                                  type="text"
                                  id="rating"
                                  min={0}
                                  max={5}
                                  {...field}
                                  className={styles.inputfield}
                                />
                                {errors.rating && (
                                  <p className="text-danger">{errors.rating.message}</p>
                                )}
                              </>
                            )}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="skuid">SKU ID</Label>
                          <Controller
                            control={control}
                            name="skuId"
                            render={({ field }) => (
                              <>
                                <Input
                                  type="text"
                                  id="skuid"
                                  {...field}
                                  className={styles.inputfield}
                                />
                                {errors.skuId && (
                                  <p className="text-danger">{errors.skuId.message}</p>
                                )}
                              </>
                            )}
                          />
                        </FormGroup>
                      </Col>

                      <FormGroup>
                        <Label for="productInfo">Product Info</Label>

                        {remarks?.map((remark: any, index: any) => (
                          <FormGroup key={index} style={{ marginBottom: "10px" }}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                              <Input
                                type="text"
                                id={`remark-${index}`}
                                name={`remark-${index}`}
                                value={remark}
                                onChange={(e) => {
                                  const updatedRemarks = [...remarks];
                                  updatedRemarks[index] = e.target.value;
                                  setRemarks(updatedRemarks);
                                }}
                                required
                                style={{
                                  marginRight: "10px",
                                  borderRadius: "0px",
                                  backgroundColor: "white",
                                }}
                              />
                              {index === remarks.length - 1 && (
                                <Button
                                  color="primary"
                                  onClick={handleAddRemark}
                                  style={{ borderRadius: "0px" }}
                                >
                                  + {/* Plus icon */}
                                </Button>
                              )}{" "}
                              {index !== 0 && (
                                <Button
                                  style={{
                                    marginLeft: "5px",
                                    marginRight: "5px",
                                    borderRadius: "0px",
                                  }}
                                  color="danger"
                                  onClick={() => handleRemoveRemark(index)}
                                >
                                  - {/* Minus icon */}
                                </Button>
                              )}
                            </div>
                          </FormGroup>
                        ))}
                      </FormGroup>
                    </Row>

                    {/* <FormGroup>
                      <Label for="image">Image:</Label>
                      <Controller
                        control={control}
                        name="image"
                        render={({ field }) => (
                          <>
                            <div {...getRootProps()} className="dropzone">
                              <input {...getInputProps()} />
                              {isDragActive ? (
                                <p>Drop the files here ...</p>
                              ) : (
                                <p>
                                  Drag 'n' drop some files here, or click to
                                  select files
                                </p>
                              )}
                            </div>
                            <ul>
                              {acceptedFiles.map((file, index) => (
                                <li key={index}>
                                  {file.name} - {file.size} bytes
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      />
                    </FormGroup> */}

                    <Card style={{ borderRadius: "0px" }}>
                      <CardHeader>
                        <label>Media</label>
                      </CardHeader>
                      <CardBody>
                        <Controller
                          control={control}
                          name="images"
                          render={({ field }) => (
                            <>
                              <MediaUpload
                                setValue={setValue}
                                watch={watch}
                                control={control}
                                type="images"
                              />
                            </>
                          )}
                        />
                      </CardBody>
                    </Card>
                    <Card style={{ borderRadius: "0px" }}>
                      <CardHeader>
                        <label>Product detail Image</label>
                      </CardHeader>
                      <CardBody>
                        <Controller
                          control={control}
                          name="media"
                          render={({ field }) => (
                            <>
                              <MediaUpload
                                setValue={setValue}
                                watch={watch}
                                control={control}
                                type="media"
                              />
                            </>
                          )}
                        />
                      </CardBody>
                    </Card>

                    <Button
                      type="submit"
                      style={{
                        backgroundColor: "black",
                        color: "white",
                        width: "120px",
                        height: "40px",
                        borderRadius: "0px",
                        border: "none",
                      }}
                    >
                      Add Variant
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};

export default AddVariant;

function CustomBody() {
  return <div>Select / Drag and drop Photos</div>;
}

const MediaUpload: React.FC<any> = ({ setValue, watch, control, editedProduct, type }) => {
  const [files, setFiles] = useState([]);
  // console.log(editedProduct);
  // console.log(media);

  const onChange = (file: any) => {
    console.log(file, "Media");
    setValue(type, file);
    setFiles(file);
  };
  // console.log(files);

  useEffect(() => {
    setFiles([]);
  }, []);

  const onRemoveImage = (id: any) => {
    setFiles((prev) => prev.filter((i: any) => i.id !== id));
  };
  const onError = (error: any) => {
    console.error(error);
  };
  const removePrev = (n: any) => {
    const updatedFiles = files?.splice(n, 1);
    setFiles(updatedFiles);
    setValue(type, updatedFiles);
  };
  return (
    <div>
      <FileUpload
        className="drop-section"
        onError={onError}
        body={<CustomBody />}
        overlap={false}
        fileValue={files}
        onChange={onChange}
      />
      <div className="upload-image-box">
        {files?.map((item: any, index: any) => {
          return (
            <div
              aria-hidden
              style={{
                width: 80,
                height: 80,
                marginRight: 10,
                position: "relative",
                flexWrap: "wrap",
              }}
              key={item.id}
            >
              <img
                style={{ width: 80, height: 80 }}
                src={item.url || item.preview || item?.fileURL}
                alt="images"
              />
              <div
                style={{
                  position: "absolute",
                  top: 3,
                  right: 5,
                  cursor: "pointer",
                }}
                onClick={() => removePrev(index)}
              >
                <Icon name="x" size={15} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
