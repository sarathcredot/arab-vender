import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Card, CardBody } from "reactstrap";
import Iconify from "src/components/iconify/Iconify";
import { formatCurrency } from 'src/utils/formatCurrency';

interface OrderSummary {
  pendingAmount: number;
  paidToday: number;
}

const RefundTransactions = () => {
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    pendingAmount: 0,
    paidToday: 0
  });

  const GET_ORDERS_SUMMARY = gql`
    query GetVendorDashboardRefundOrdersSummary {
      getVendorDashboardRefundOrdersSummary {
        pendingAmount
        paidToday
      }
    }
  `;

  const { data: orderSummaryData, refetch: orderSummaryRefetch } = useQuery(GET_ORDERS_SUMMARY);

  useEffect(() => {
    if (orderSummaryData && orderSummaryData?.getVendorDashboardRefundOrdersSummary) {
      setOrderSummary(orderSummaryData?.getVendorDashboardRefundOrdersSummary)
    }
  }, [orderSummaryData, orderSummaryRefetch]);

  return (
    <React.Fragment>
      <Card style={{ height: "100%" }}>
        <div className="card-header align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">Refund Today</h4>
          <div className="flex-shrink-0"></div>
        </div>

        <CardBody className="px-12" style={{ maxHeight: "352px" }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="font-size-22 text-warning d-flex align-items-center">
              <Iconify icon="carbon:time-filled" />
              <h5 className="font-size-14 mb-0 ms-2"> Total Pending Amount</h5>
            </div>
            <div className="text-end">
              <h5 className="font-size-14 text-muted mb-0">{formatCurrency(orderSummary.pendingAmount)}</h5>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div className="font-size-22 text-success d-flex align-items-center">
              <Iconify icon="mdi:tick-circle" />
              <h5 className="font-size-14 mb-0 ms-2"> Total Paid Today</h5>
            </div>
            <div className="text-end">
              <h5 className="font-size-14 text-muted mb-0">{formatCurrency(orderSummary.paidToday)}</h5>
            </div>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default RefundTransactions;
