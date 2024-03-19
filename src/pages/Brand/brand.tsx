import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Input,
  Button,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import Breadcrumb from "src/components/Common/Breadcrumb";

import { bR } from "@fullcalendar/core/internal-common";
import StatusIndicator from "src/components/statusIndicator/StatusIndicator";
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
    variables: {
      input: {
        page: currentPage,
        size: pageSize,

      },
    },
  });


  useEffect(() => {
    if (brandDataResponse && brandDataResponse.getAllBrandRecordsWithVendorByVendor) {
      setBrandData(brandDataResponse.getAllBrandRecordsWithVendorByVendor.records);
      setMaxRecords(brandDataResponse.getAllBrandRecordsWithVendorByVendor.maxRecords);
    }
  }, [brandDataResponse, brandRefetch]);


  if (brandError) {
    console.error("Error fetching vendor data:", brandError);
  }





  const totalPages = Math.ceil(maxRecords / pageSize);

  const handleNextPage = () => {
    if (currentPage + 1 < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };



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

                  <Table
                    responsive
                    className="table table-bordered table-centered mb-0"
                  >
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Brand Name</th>
                        <th>Logo</th>
                        <th>Status</th>
                        {/* <th>Action</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {brandData
                        .filter((brand) =>
                          brand.brandName
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                        .map((brand, index) => (
                          <tr key={brand._id}>
                            <td>{index + 1}</td>
                            <td>{brand.brandName}</td>

                            <td>
                              {brand.logo && (
                                <img
                                  src={brand.logo.fileURL}
                                  alt={`Logo for ${brand.brandName}`}
                                  style={{ width: '50px', height: '50px' }}
                                />
                              )}
                            </td>
                            <td ><StatusIndicator status={brand.isBlocked ? "BLOCKED" : "ACTIVE"} /></td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                  <Row style={{ marginTop: "20px" }}>
                    <Col>
                      <div className="d-flex justify-content-end mt-0 ">
                        <ul className="pagination">
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