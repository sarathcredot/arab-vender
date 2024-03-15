import React from "react";

//import Breadcrumbs
import { Container } from "reactstrap";


// import common data
import OrdersAmountOverview from "./OrdersAmountOverview";
import OrdersOverview from "./OrdersOverview";
import RefundOrdersOverview from "./RefundOrdersOverview";
import ReturnOrdersOverview from "./ReturnOrdersOverview";


const id = null;

const Dashboard = () => {
  return (
    <React.Fragment>
      <div className="page-content">

        <Container fluid={true} >
          {/* <Breadcrumb items={items} currentPage="Vendor Orders" /> */}
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>

            <div>
              <OrdersOverview vendorId={id} />
            </div>

            <div style={{ borderTop: '1px solid #ccc', width: '100%' }} />
            <div>
              <h4 style={{ margin: "20px 0" }}>Vendor Order Amounts</h4>
              <OrdersAmountOverview vendorId={id} />
            </div>


            <div style={{ borderTop: '1px solid #ccc', width: '100%' }} />

            <div>
              <h4 style={{ margin: "10px 0 20px  0" }}>Return</h4>
              <ReturnOrdersOverview vendorId={id} />
            </div>

            <div style={{ borderTop: '1px solid #ccc', width: '100%' }} />

            <div>
              <h4 style={{ margin: "10px 0 20px  0" }}>Refund</h4>
              <RefundOrdersOverview vendorId={id} />
            </div>


          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard; 