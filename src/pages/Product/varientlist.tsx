import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody, CardHeader, Button, Input } from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

// const KYC_STATUS = gql`
//   query GetKycStatus($input: VendorRecordKycStatusInput!) {
//     getKycStatus(input: $input) {
//       record {
//         _id
//         isBlocked
//         isKycCompleted
//         outletStatus
//         companyStatus
//       }
//       message
//     }
//   }
// `;

const KYC_STATUS = gql`
  query Record {
    getKycStatus {
      record {
        _id
        companyStatus
        isBlocked
        isKycCompleted
        outletStatus
      }
      message
    }
  }
`;

const PRODUCT_LIST = gql`
  query GetVariantsTableByVendor($input: ProductVariantsByVendorFilter!) {
    getVariantsTableByVendor(input: $input) {
      maxRecords
      message
      records {
        _id
        attributes {
          attributeId
          attributeName
          attributeValueId
          attributeValue
          attributeDescription
        }
        images {
          fileType
          fileURL
          mimeType
          originalName
        }
        isBlocked
        productName
        status
        stock
        productCode
        skuId
        categoryNamePath
        categoryId
        brandName
      }
    }
  }
`;

interface Product {
  _id: string;
  productName: string;
  productCode: string;
  shortDescription: string;
  categoryNamePath: string;
  skuId: string;
  categoryId: string;
  brandName: string;
  attributes: {
    attributeId: string;
    attributeName: string;
    attributeValueId: string;
    attributeValue: string;
    attributeDescription: string;
  }[];
  images: {
    fileURL: string;
  }[];
  isBlocked: boolean;
  stock: string;
  status: string;
}

const ProductListing = () => {
  document.title = "Product | Arab Deals ";
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const productId: any = params.get("_code");
  const productcode = parseInt(productId);

  const [searchParams, setSearchParms] = useSearchParams();
  const productCode = searchParams.get("_code");

  const pageSize = 10; // Number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [maxRecords, setMaxRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const id = localStorage.getItem("vendorid");
  const { loading: kycloading, error: kycerror, data: kycData } = useQuery(KYC_STATUS);
  console.log(kycData);

  const {
    loading: productListLoading,
    data: productListData,
    error: productListError,
    refetch,
  } = useQuery(PRODUCT_LIST, {
    variables: {
      input: {
        productCode: productcode,
      },
    },
  });
  console.log("pro", productListData);

  useEffect(() => {
    setProducts(productListData?.getVariantsTableByVendor?.records);
    setMaxRecords(productListData?.getVariantsTableByVendor?.maxRecords);
  }, [productListData]);
  const [productListDatas, setProductDatas] = useState([]);
  console.log(products);

  // useEffect(()=>{
  //   if(productListData){
  //     setProductDatas(productListData.getProductsByVendor.record||[])
  //   }
  // })

  // console.log(productListDatas,"ewasrtdfyughijk")
  // console.log("",productListData);

  // const {loading:productloading, data:productdata,refetch } = useQuery(GET_PRODUCTS, {
  //   variables: {
  //     input: {
  //       vendorId:"659d62c675adf8360cc0eb90",
  //       page: 1,
  //       size:10
  // size: pageSize,
  //  page: currentPage,
  // size: pageSize,
  // query: searchTerm,
  // parentCategory: searchTerm,
  // categories:[searchTerm],
  // color: [searchTerm],
  // productSize:[searchTerm]
  //     },
  //   },
  // });

  // console.log(productdata);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;

  // const products = data.getProductsByAdmin.records;
  // const maxRecords = data.getProductsByAdmin.maxRecords;

  // console.log(products)

  // useEffect(() => {
  //   const fetchData = async () => {
  //     console.log("ist");

  //     try {
  //       console.log("s",currentPage);

  //       setLoading(true);
  //       const result = await refetch({
  //         input: {
  //           page: currentPage,
  //           size: pageSize,
  //           // query: searchTerm,
  //         },
  //       });
  //       console.log(result);

  //       setProducts(productListData?.getProductsByVendor?.records);
  //       setMaxRecords(productListData?.getProductsByVendor?.maxRecords);
  //     } catch (error: any) {
  //       setError(error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [searchTerm, currentPage, refetch]);

  const totalPages = Math.ceil(maxRecords / pageSize);

  const handleaddVariant = () => {
    if (kycData?.getKycStatus?.record?.isKycCompleted) {
      navigate(
        `/add-variant/?id=${products[0]._id}&&catId=${products[0]?.categoryId}&&code=${productCode}`
      );
    } else {
      toast.error("Complete Your KYC and Add Variant");
    }
  };

  const handleNextPage = () => {
    if (currentPage + 1 <= totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
    console.log(event.target.value);
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <ToastContainer />
          <Breadcrumbs title="Dashboard" breadcrumbItem="Product" link="/dashboard" />
          <Row>
            <Col lg={12}>
              <div className="d-flex justify-content-end mb-3">
                {/* <Link to="/add-product"> */}
                <button
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    width: "100px",
                    height: "40px",
                    borderRadius: "0px",
                    cursor: "pointer",
                    boxShadow: "none",
                    border: "none",
                  }}
                  onClick={handleaddVariant}
                >
                  Add Variant
                </button>
                {/* </Link> */}
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Products</h4>

                  <Col xs={5} style={{ marginTop: "20px" }}>
                    <Input
                      type="text"
                      placeholder="Search Product"
                      value={searchTerm}
                      onChange={handleSearch}
                      style={{ width: "50%", borderRadius: "0px" }}
                    />
                  </Col>
                </CardHeader>

                <CardBody>
                  <div className="mt-4">
                    <Row>
                      <Col xl={6}>
                        <div className="mb-3">
                          <label htmlFor="cleave-time-format" className="form-label">
                            Brand
                          </label>
                          <div style={{ display: "flex" }}>
                            {products && products.length > 0 && products[0]?.brandName}
                          </div>
                        </div>
                      </Col>
                      <Col xl={6}>
                        <div className="mb-3">
                          <label htmlFor="cleave-time-format" className="form-label">
                            Category
                          </label>
                          <div style={{ display: "flex" }}>
                            {products && products.length > 0 && products[0]?.categoryNamePath}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div className="table-rep-plugin">
                    <div className="table-responsive mb-0" data-pattern="priority-columns">
                      <Table id="tech-companies-1" className="table table-striped table-bordered">
                        <Thead>
                          <Tr>
                            <Th data-priority="1">Name</Th>
                            <Th data-priority="1">Image</Th>
                            <Th data-priority="1">SKU ID</Th>
                            <Th data-priority="1">Attributes</Th>
                            <Th data-priority="1">Stock</Th>

                            {/* <Th data-priority="3">Status</Th> */}
                            <Th data-priority="3">Status</Th>
                            <Th data-priority="3">Action</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {products?.map((product: Product, index: number) => (
                            <Tr key={index}>
                              <Td>{product?.productName}</Td>
                              {/* <Td>{product?.status}</Td> */}
                              <Td>
                                <img
                                  src={product.images[0]?.fileURL}
                                  alt={product?.productName}
                                  width={80}
                                  height={80}
                                />
                              </Td>
                              <Td>{product?.skuId}</Td>
                              <Td>
                                {product.attributes.map((attribute, index) => (
                                  <div key={index}>
                                    <p>
                                      {attribute.attributeName}: {attribute.attributeValue}
                                    </p>
                                  </div>
                                ))}
                              </Td>
                              <Td>{product?.stock}</Td>

                              <Td>{product.isBlocked ? "Blocked" : "Active"}</Td>
                              <Td>
                                <Button
                                  color="white"
                                  style={{
                                    backgroundColor: "black",
                                    alignItems: "center",
                                    color: "white",
                                    borderRadius: "0px",
                                  }}
                                  tag={Link}
                                  to={{
                                    pathname: "/product/details/",
                                    search: `?_id=${product._id}`,
                                  }}
                                >
                                  View
                                </Button>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </div>
                  </div>
                  {/* <Row>
                    <Col>
                      <div className="d-flex justify-content-end mt-0 ">
                        <ul className="pagination">
                          <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(currentPage - 1)}
                              disabled={currentPage === 0}
                              style={{ borderRadius: "0px" }}
                            >
                              Previous
                            </button>
                          </li>

                          {Array.from({ length: totalPages }, (_, index) => (
                            <li
                              key={index}
                              className={`page-item ${currentPage === index ? "active" : ""}`}
                            >
                              <button
                                style={{ borderRadius: "0px" }}
                                className="page-link"
                                onClick={() => setCurrentPage(index)}
                              >
                                {index + 1}
                              </button>
                            </li>
                          ))}

                          {currentPage < totalPages - 1 && (
                            <li
                              className={`page-item ${
                                currentPage === totalPages - 1 ? "disabled" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages - 1}
                                style={{ borderRadius: "0px" }}
                              >
                                Next
                              </button>
                            </li>
                          )}
                        </ul>
                      </div>
                    </Col>
                  </Row> */}
                  <div className="border mt-3 border-dashed"></div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProductListing;
