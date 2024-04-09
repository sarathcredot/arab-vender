import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Input,
  Button,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import Breadcrumb from "src/components/Common/Breadcrumb";

import { bR } from "@fullcalendar/core/internal-common";
import StatusIndicator from "src/components/statusIndicator/StatusIndicator";
import Loader from "src/components/Common/Loader";
import { Tbody, Td, Th, Thead, Tr, Table } from "react-super-responsive-table";
// import BrandForm from "./BrandForm";


interface IBrandRecord {
  _id: string;
  brandName: string;
  isBlocked: boolean;
  logo: {
    fileURL: string;
  };
}

const BrandList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [brandData, setBrandData] = useState<IBrandRecord[]>([]);
  const [activeTab, setActiveTab] = useState<boolean>();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const [maxRecords, setMaxRecords] = useState(0);


  const GET_BRAND = gql`
  query GetAllBrandRecordsWithVendorByVendor($input: getAllBrandRecordsWithVendorByVendorInput!) {
  getAllBrandRecordsWithVendorByVendor(input: $input) {
    maxRecords
    records {
      _id
      brandName
      isBlocked
      logo {
        fileType
        fileURL
        mimeType
        originalName
      }
      isPopular
      priority
    }
    message
  }
}
  `;

  const {
    loading: brandLoading,
    error: brandError,
    data: brandDataResponse,
    refetch: brandRefetch,
  } = useQuery(GET_BRAND, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page: currentPage,
        size: pageSize,
        query: searchTerm
      },
    },
  });


  useEffect(() => {
    if (brandDataResponse && brandDataResponse.getAllBrandRecordsWithVendorByVendor) {
      setBrandData(brandDataResponse.getAllBrandRecordsWithVendorByVendor.records);
      setMaxRecords(brandDataResponse.getAllBrandRecordsWithVendorByVendor.maxRecords);
    }
  }, [brandDataResponse, brandRefetch, searchTerm]);


  if (brandError) {
    console.error("Error fetching vendor data:", brandError);
  }


  const totalPages = Math.ceil(maxRecords / pageSize);


  const items = [
    { text: "Dashboard", link: `/` },
  ];


  return (
    <>
      <div className="page-content">

        <Container fluid={true}>
          <Breadcrumb items={items} currentPage="Brands" />

          <Row>
            <Col lg={12}>
              <Card style={{ borderRadius: "0px" }}>
                <CardBody>
                  <Input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "50%", marginBottom: "20px", borderRadius: "0px" }}
                  />
                  {
                    brandLoading ?
                      <Loader /> :

                      <Table id="tech-companies-1" className="table table-striped table-bordered">
                        <Thead>
                          <Tr>
                            <Th>No</Th>
                            <Th>Brand Name</Th>
                            <Th>Logo</Th>
                            <Th>Status</Th>
                            {/* <Th>Action</Th> */}
                          </Tr>
                        </Thead>
                        <Tbody>
                          {brandData?.map((brand, index) => (
                            <Tr key={brand._id}>
                              <Td>{index + 1}</Td>
                              <Td>{brand.brandName}</Td>

                              <Td>
                                {brand.logo && (
                                  <img
                                    src={brand.logo.fileURL}
                                    alt={`Logo for ${brand.brandName}`}
                                    style={{ width: '50px', height: '50px' }}
                                  />
                                )}
                              </Td>
                              <Td ><StatusIndicator status={brand.isBlocked ? "BLOCKED" : "ACTIVE"} /></Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                  }
                  <Row style={{ marginTop: "20px" }}>
                    <Col>
                      <div className="d-flex justify-content-end mt-0 ">
                        <ul className="pagination">
                          {
                            currentPage !== 0 &&
                            <li
                              className={`page-item ${currentPage === 0 ? "disabled" : ""
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
                          }

                          {Array.from({ length: totalPages }, (_, index) => (
                            <li
                              key={index}
                              className={`page-item ${currentPage === index ? "active" : ""
                                }`}
                            >
                              <button
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


              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default BrandList;