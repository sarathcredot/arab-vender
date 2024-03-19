import React from "react";

import { Container } from "reactstrap";


import OrdersAmountOverview from "./OrdersAmountOverview";
import OrdersOverview from "./OrdersOverview";
import RefundOrdersOverview from "./RefundOrdersOverview";
import ReturnOrdersOverview from "./ReturnOrdersOverview";


const Dashboard = () => {
  return (
    <div className="page-content">
      <Container fluid>
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>

          <div>
            <h4 style={{ margin: "20px 0" }}>Orders</h4>
            <OrdersOverview />
          </div>
          <div style={{ borderTop: '1px solid #ccc', width: '100%' }} />

          <div>
            <h4 style={{ margin: "20px 0" }}>Order Amounts</h4>
            <OrdersAmountOverview />
          </div>

          <div style={{ borderTop: '1px solid #ccc', width: '100%' }} />

          <div>
            <h4 style={{ margin: "10px 0 20px  0" }}>Return</h4>
            <ReturnOrdersOverview />
          </div>

          <div style={{ borderTop: '1px solid #ccc', width: '100%' }} />

          <div>
            <h4 style={{ margin: "10px 0 20px  0" }}>Refund</h4>
            <RefundOrdersOverview />
          </div>

        </div>

      </Container>
    </div>
  );
};

export default Dashboard; 