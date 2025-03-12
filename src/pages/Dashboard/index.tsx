import React, { useEffect, useState } from "react";

import { Alert, Col, Container, Row } from "reactstrap";

import OrdersAmountOverview from "./OrdersAmountOverview";
import OrdersOverview from "./OrdersOverview";
import RefundOrdersOverview from "./RefundOrdersOverview";
import ReturnOrdersOverview from "./ReturnOrdersOverview";
import { gql, useQuery } from "@apollo/client";
import { RiErrorWarningFill } from "react-icons/ri";
import { useNavigate } from "react-router";
import Iconify from "src/components/iconify";
import UnderReview from "src/components/UnderReview";

const Dashboard = () => {
  const navigate = useNavigate();

  const KYC_STATUS = gql`
    query GetKycStatus {
      getKycStatus {
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
  const [kycStatus, setKycStatus] = useState(null);

  const { loading, error, data } = useQuery(KYC_STATUS, {
    fetchPolicy: "network-only",
  });

  return (
    <div className="page-content">
      {data?.getKycStatus?.record.outletStatus !== "COMPLETED" ||
      data?.getKycStatus?.record.companyStatus !== "COMPLETED" ||
      (data?.getKycStatus?.record.isKycCompleted !== true && !loading) ? (
        <Row>
          {data?.getKycStatus?.record?.outletStatus == "PENDING" ||
          data?.getKycStatus?.record?.outletStatus == "UNDER_VERIFICATION" ||
          data?.getKycStatus?.record?.outletStatus == "COMPLETED" ||
          data?.getKycStatus?.record?.outletStatus == "REJECTED" ? (
            // <Col xs={12}>
            //   <Alert
            //     onClick={() => navigate("/kyc")}
            //     color={
            //       data?.getKycStatus?.record?.outletStatus == "PENDING"
            //         ? "warning"
            //         : data?.getKycStatus?.record?.outletStatus == "UNDER_VERIFICATION"
            //         ? "info"
            //         : data?.getKycStatus?.record?.outletStatus == "COMPLETED"
            //         ? "success"
            //         : "error"
            //     }
            //     style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "20px 20px" }}
            //   >
            //     <Iconify icon="ep:warning-filled" />
            //     <span>
            //       {data?.getKycStatus?.record?.outletStatus == "PENDING"
            //         ? "Your outlet status is PENDING"
            //         : data?.getKycStatus?.record?.outletStatus == "UNDER_VERIFICATION"
            //         ? "Your outlet status is UNDER VERIFICATION "
            //         : data?.getKycStatus?.record?.outletStatus == "COMPLETED"
            //         ? "Your outlet status is COMPLETED"
            //         : data?.getKycStatus?.record?.outletStatus == "REJECTED"
            //         ? "Your outlet status is REJECTED"
            //         : ""}
            //     </span>
            //   </Alert>
            // </Col>
            <UnderReview/>
          ) : (
            ""
          )}
          {/* {data?.getKycStatus?.record?.companyStatus == "PENDING" ||
          data?.getKycStatus?.record?.companyStatus == "UNDER_VERIFICATION" ||
          data?.getKycStatus?.record?.companyStatus == "COMPLETED" ||
          data?.getKycStatus?.record?.companyStatus == "REJECTED" ? (
            <Col xs={12}>
              <Alert
                onClick={() => navigate("/kyc")}
                color={
                  data?.getKycStatus?.record?.companyStatus == "PENDING"
                    ? "warning"
                    : data?.getKycStatus?.record?.companyStatus == "UNDER_VERIFICATION"
                    ? "info "
                    : data?.getKycStatus?.record?.companyStatus == "COMPLETED"
                    ? "success"
                    : "error"
                }
                style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "20px 20px" }}
              >
                <Iconify icon="ep:warning-filled" />
                <span>
                  {data?.getKycStatus?.record?.companyStatus == "PENDING"
                    ? "Your company status is PENDING"
                    : data?.getKycStatus?.record?.companyStatus == "UNDER_VERIFICATION"
                    ? "Your company status is UNDER VERIFICATION "
                    : data?.getKycStatus?.record?.companyStatus == "COMPLETED"
                    ? "Your company status is COMPLETED"
                    : data?.getKycStatus?.record?.companyStatus == "REJECTED"
                    ? "Your company status is REJECTED"
                    : ""}
                </span>
              </Alert>
            </Col>
          ) : (
            ""
          )} */}
        </Row>
      ) : (
        <>
          <Container fluid>
            <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
              <div>
                <h4 style={{ margin: "20px 0" }}>Orders</h4>
                <OrdersOverview />
              </div>
              <div style={{ borderTop: "1px solid #ccc", width: "100%" }} />

              <div>
                <h4 style={{ margin: "20px 0" }}>Order Amounts</h4>
                <OrdersAmountOverview />
              </div>

              <div style={{ borderTop: "1px solid #ccc", width: "100%" }} />

              <div>
                <h4 style={{ margin: "10px 0 20px  0" }}>Return</h4>
                <ReturnOrdersOverview />
              </div>

              <div style={{ borderTop: "1px solid #ccc", width: "100%" }} />

              <div>
                <h4 style={{ margin: "10px 0 20px  0" }}>Refund</h4>
                <RefundOrdersOverview />
              </div>
            </div>
          </Container>
        </>
      )}
    </div>
  );
};

export default Dashboard;
