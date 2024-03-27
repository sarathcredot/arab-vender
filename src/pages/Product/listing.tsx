import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody, CardHeader, Button, Input, Nav, NavItem, NavLink, Container } from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { ToastContainer, toast } from "react-toastify";
import "./listing.css";
import CustomButton from "src/components/Common/CustomButton";
import Breadcrumb from "../../components/Common/Breadcrumb";


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
  }
}
`;

interface Product {
  _id: string;
  vendorId: string;
  brandId: string;
  brandName: string;
  productName: string;
  shortDescription: string;
  skuId: string;
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
  tags: string[];
  productCode: string;
  categoryId: string;
  categoryNamePath: string;
  categoryIdPath: string;
  isBlocked: boolean;
  stock: number;
  status: string;
  offerPrice: number;
  attributes: {
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
  warehouseSkuId: string;
}


const ProductListing = () => {
  // document.title = "Product | Arab Deals ";
  const navigate = useNavigate();
  const pageSize = 10; // Number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [maxRecords, setMaxRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setselectedFilter] = useState("");
  const [activeTab, setActiveTab] = useState("");


  const id = localStorage.getItem("vendorid");
  const { loading: kycloading, error: kycerror, data: kycData } = useQuery(KYC_STATUS);

  const {
    loading: productListLoading,
    data: productListData,
    error: productListError,
    refetch,
  } = useQuery(PRODUCT_LIST, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page: currentPage,
        size: pageSize,
        query: searchTerm,
        status: activeTab,
      },
    },
  });

  const handleclick = (value: any) => {
    setselectedFilter(value);
  };

  useEffect(() => {
    refetch();
  }, []);
  useEffect(() => {
    setProducts(productListData?.getProductsByVendor?.records);
    setMaxRecords(productListData?.getProductsByVendor?.maxRecords);
  }, [productListData]);
  const [productListDatas, setProductDatas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {


      try {

        const result = await refetch({
          input: {
            // vendorId: id,
            page: currentPage,
            size: pageSize,
            query: searchTerm,
            status: activeTab,
          },
        });
        setProducts(result?.data?.getProductsByVendor?.records);
        setMaxRecords(result?.data?.getProductsByVendor?.maxRecords);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchData();
  }, [searchTerm, currentPage, refetch, activeTab]);

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


  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
  };
  const items = [
    { text: "Dashboard", link: `/` },
  ];


  return (
    <React.Fragment>
      <ToastContainer />
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb items={items} currentPage="Products" />
          <Nav tabs style={{ marginTop: "20px" }}>
            <NavItem>
              <NavLink
                className={activeTab === "" ? "tab-button active" : "tab-button"}
                onClick={() => handleTabChange("")}
              >
                All
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === "APPROVED" ? "tab-button active" : "tab-button"}
                onClick={() => handleTabChange("APPROVED")}
              >
                Approved
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === "UNDER_VERIFICATION" ? "tab-button active" : "tab-button"}
                onClick={() => handleTabChange("UNDER_VERIFICATION")}
              >
                Under Review
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === "REJECTED" ? "tab-button active" : "tab-button"}
                onClick={() => handleTabChange("REJECTED")}
              >
                Rejected
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === "PENDING" ? "tab-button active" : "tab-button"}
                onClick={() => handleTabChange("PENDING")}
              >
                Pending
              </NavLink>
            </NavItem>
          </Nav>

          <Row style={{ marginTop: "20px" }}>
            <Col>
              <Card style={{ borderRadius: "0px" }}>
                <CardHeader>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Input
                      type="text"
                      placeholder="Search Product"
                      value={searchTerm}
                      onChange={handleSearch}
                      style={{ width: "450px", borderRadius: "0px" }}
                    />
                    <CustomButton
                      name="Add Product"
                      icon="ic:twotone-add"
                      onClick={handlekycstatus}
                    />
                  </div>

                </CardHeader>
                {products && products?.length > 0 ? (

                  <CardBody>
                    <div className="table-rep-plugin">
                      <div className="table-responsive mb-0" data-pattern="priority-columns">
                        <Table id="tech-companies-1" className="table table-striped table-bordered">
                          <Thead>
                            <Tr>
                              <Th>No</Th>
                              <Th data-priority="1">Name</Th>
                              <Th>Product Code</Th>

                              <Th data-priority="3">Category</Th>
                              <Th data-priority="1">Image</Th>
                              <Th data-priority="3">Action</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {products?.map((product: Product, index: number) => (
                              <Tr key={index}>
                                <Td>{currentPage * pageSize + index + 1}</Td>
                                <Td>{product.productName}</Td>
                                <Td>{product.productCode}</Td>

                                <Td>{product?.categoryNamePath}</Td>
                                <Td>
                                  <img
                                    src={product.images[0]?.fileURL}
                                    alt={product?.productName}
                                    width={80}
                                    height={80}
                                  />
                                </Td>
                                <Td>
                                  <div style={{ display: "flex", gap: "10px" }}>
                                    <Button
                                      color="primary"
                                      size="sm"
                                      tag={Link}
                                      to={{
                                        pathname: "/product/variant",
                                        search: `?_code=${product?.productCode}`,
                                      }}
                                    >
                                      View
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
                            <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                              <button
                                style={{ borderRadius: "0px" }}
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
                                className={`page-item ${currentPage === totalPages - 1 ? "disabled" : ""
                                  }`}
                              >
                                <button
                                  style={{ borderRadius: "0px" }}
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
                ) : (
                  <CardBody
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      borderRadius: "0px",
                      alignItems: "center",
                      minHeight: "200px",
                      fontWeight: 600,
                    }}
                  >
                    No Products
                  </CardBody>
                )}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ProductListing;
