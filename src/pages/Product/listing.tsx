import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
} from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { ToastContainer, toast } from "react-toastify";

const KYC_STATUS = gql`
  query GetKycStatus($input: VendorRecordKycStatusInput!) {
    getKycStatus(input: $input) {
      record {
        _id
        isBlocked
        isKycCompleted
        outletStatus
        companyStatus
      }
      message
    }
  }
`;

const PRODUCT_LIST = gql`
query GetProductsByVendor($input: ProductByVendorFilters) {
  getProductsByVendor(input: $input) {
    maxRecords
    records {
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
      material
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
  images: {
    fileURL: string;
  }[];
  isBlocked: boolean;
  status:string;
}

const ProductListing = () => {
  document.title = "Product | Arab Deals ";
  const navigate = useNavigate();
  const pageSize = 10; // Number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [maxRecords, setMaxRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const id = localStorage.getItem("vendorid");
  const {
    loading: kycloading,
    error: kycerror,
    data: kycData,
  } = useQuery(KYC_STATUS, {
    variables: { input: { _id: id } },
  });
  console.log(kycData);

  const {
    loading: productListLoading,
    data: productListData,
    error: productListError,
    refetch,
  } = useQuery(PRODUCT_LIST, {
    variables: {
      input: {
        vendorId: id, page:currentPage,size: pageSize,query: searchTerm
      },
    },
  });
console.log("pro",productListData);
useEffect(()=>{
  refetch();
},[])
useEffect(()=>{
  setProducts(productListData?.getProductsByVendor?.records);
    setMaxRecords(productListData?.getProductsByVendor?.maxRecords);
},[productListData])
const [productListDatas,setProductDatas]=useState([])
console.log(products);

  

  useEffect(() => {
    const fetchData = async () => {
      console.log("ist");
      
      try {
        console.log("s",currentPage);
        
        setLoading(true);
        const result = await refetch({
          input: {
            vendorId: id,
            page: currentPage,
            size: pageSize,
            query: searchTerm,
          },
        });
        console.log(result);
        
        setProducts(result?.data?.getProductsByVendor?.records);
        setMaxRecords(result?.data?.getProductsByVendor?.maxRecords);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, currentPage, refetch]);

  const totalPages = Math.ceil(maxRecords / pageSize);

  const handlekycstatus = () => {
    if (kycData?.getKycStatus?.record?.isKycCompleted) {
      navigate("/add-product");
    } else {
      toast.error("Complete Your KYC and Add Products");
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
          <Breadcrumbs
            title="Dashboard"
            breadcrumbItem="Product"
            link="/dashboard"
          />
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
                  onClick={handlekycstatus}
                >
                  Add Product
                </button>
                {/* </Link> */}
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
             { products && products?.length>0 ? <Card>
                <CardHeader>
                  <h4 className="card-title">Products</h4>

                  <Col xs={5} style={{ marginTop: "20px" }}>
                    <Input
                      type="text"
                      placeholder="Search Product"
                      value={searchTerm}
                      onChange={handleSearch}
                      style={{ width: "50%" }}
                    />
                  </Col>
                </CardHeader>

                <CardBody>
                  <div className="table-rep-plugin">
                    <div
                      className="table-responsive mb-0"
                      data-pattern="priority-columns"
                    >
                      <Table
                        id="tech-companies-1"
                        className="table table-striped table-bordered"
                      >
                        <Thead>
                          <Tr>
                            <Th>ProductCode</Th>
                            <Th data-priority="1">Name</Th>
                            <Th data-priority="3">Category</Th>
                            <Th data-priority="1">Image</Th>
                            {/* <Th data-priority="3">Status</Th> */}
                            <Th data-priority="3">Status</Th>
                            <Th data-priority="3">Action</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {products?.map((product: Product, index: number) => (
                            <Tr key={index}>
                              <Td>{product.productCode}</Td>
                              <Td>{product.productName}</Td>
                             
                              <Td>{product?.categoryNamePath}</Td>
                              <Td>
                                <img
                                  src={product.images[0]?.fileURL}
                                  alt={product?.productName}
                                  width={80}
                                  height={80}
                                />
                              </Td>
                              {/* <Td>{product.status.replace(/_/g, ' ')}</Td> */}
                              <Td>
                                {product.isBlocked ? "Blocked" : "Active"}
                              </Td>
                              <Td>
                                <div style={{display:"flex",gap:"10px" }}>
                                <Button
                                  color="white"
                                  style={{
                                    backgroundColor: "black",
                                    alignItems: "center",
                                    color: "white",
                                  }}
                                  tag={Link}
                                  to={{
                                    pathname: "/list-variant",
                                    search: `?_code=${product?.productCode}&_id=${product?._id}`,
                                  }}
                                >
                                  View varients
                                </Button>
                                {/* <Button
                                  color="white"
                                  style={{
                                    backgroundColor: "black",
                                    alignItems: "center",
                                    color: "white",
                                  }}
                                  tag={Link}
                                  to={{
                                    pathname: "/product/details/",
                                    search: `?_id=${product._id}`,
                                  }}
                                >
                                  View Details
                                </Button> */}
                                </div>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </div>
                  </div>
                  <Row>
                    <Col>
                      <div className="d-flex justify-content-end mt-0 ">
                        <ul className="pagination">
                          <li
                            className={`page-item ${
                              currentPage === 0 ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(currentPage - 1)}
                              disabled={currentPage === 0}
                            >
                              Previous
                            </button>
                          </li>

                          {Array.from({ length: totalPages }, (_, index) => (
                            <li
                              key={index}
                              className={`page-item ${
                                currentPage === index ? "active" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(index)}
                              >
                                {index}
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
                              >
                                Next
                              </button>
                            </li>
                          )}
                        </ul>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>:
              <Card style={{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"200px",fontWeight:600}}>
                No Products
                </Card>}
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProductListing;
