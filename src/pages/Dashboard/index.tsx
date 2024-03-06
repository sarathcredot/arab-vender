import React ,{useEffect} from "react";

//import Breadcrumbs
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

/** import Mini Widget data */
import WalletBalance from "./WalletBalance";
import InvestedOverview from "./InvestedOverview";
import MarketOverview from "./MarketOverview";
import Locations from "./Locations";
import Trading from "./Trading";
import Transactions from "./Transactions";
import RecentActivity from "./RecentActivity";
import NewSlider from "./NewSlider";
// import Widgets from "./Widgets";
import CountUp from "react-countup";
import ReactApexChart from "react-apexcharts";

// import common data
import { WidgetsData } from "../../common/data/dashboard";
import { RiErrorWarningFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { gql, useQuery } from '@apollo/client';
import { kycStatus } from "../../state/atom"
import { useSetRecoilState } from 'recoil';

const options: Object = {
  chart: {
    height: 50,
    type: "line",
    toolbar: { show: false },
    sparkline: {
      enabled: true
  }
  },
  colors: ["#5156be"],
  stroke: {
    curve: "smooth",
    width: 2,
  },
  xaxis: {
    labels: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  tooltip: {
    fixed: {
      enabled: false,
    },
    x: {
      show: false,
    },
    y: {
      title: {
        formatter: function (seriesName: any) {
          return "";
        },
      },
    },
    marker: {
      show: false,
    },
  },
};

//meta title
const KYC_STATUS=gql`query GetKycStatus($input: VendorRecordKycStatusInput!) {
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
}`

const Dashboard = () => {
  document.title = "Dashboard | Arab-deals";
  const navigate = useNavigate();
  const setKycStatus = useSetRecoilState(kycStatus);
console.log(setKycStatus);

  const id=localStorage.getItem("vendorid")
  const { loading, error, data } = useQuery(KYC_STATUS, {
    variables: { input:{_id:id} },
  });
console.log(data?.getKycStatus);
const token=localStorage?.getItem('token')
useEffect(() => {
  if (!token) {
    navigate("/login");
  } else {
    navigate("/dashboard");
  }
}, []);
useEffect(() => {
  if (!loading && !error && data) {
    // Assuming the data structure has a field 'kycStatus'
    const receivedKycStatus = data?.getKycStatus?.record;

    // Set the Recoil state with the received data
    setKycStatus(receivedKycStatus);
    localStorage.setItem("kycComplete",data?.getKycStatus?.record?.isKycCompleted)
   
  }
}, [loading, error, data, setKycStatus]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true} style={{ marginTop: "40px" }}>
           <div className="mb-3" style={{boxShadow: 'rgba(17, 17, 26, 0.05) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px',padding:"20px",width:"fit-content"}} 
           onClick={() =>navigate("/kyc")} >
           <div><RiErrorWarningFill style={{fontSize:"30px",color:"blue",justifyContent:"center",display:"flex",width:"100%"}}/></div>
           {data?.getKycStatus?.record?.outletStatus=='PENDING' ? "Your outlet status is pending": data?.getKycStatus?.record?.outletStatus=='UNDER_VERIFICATION'?"Your outlet status is under verification ":data?.getKycStatus?.record?.outletStatus== 'COMPLETED'?'Your outlet status is Completed':'Your outlet status is rejected'}
          <p className="mb-0"style={{marginBottom:"0px"}}> {data?.getKycStatus?.record?.companyStatus=='PENDING' ? "Your company status is pending": data?.getKycStatus?.record?.companyStatus=='UNDER_VERIFICATION'?"Your company status is under verification ":data?.getKycStatus?.record?.companyStatus== 'COMPLETED'?'Your company status is Completed':'Your company status is rejected'}</p>

           </div>
          {/* Render Breadcrumbs */}
          <Breadcrumbs  breadcrumbItem="Dashboard" />

          <Row>
            {/* <Widgets options={options} /> */}
            {(WidgetsData || []).map((widget, key) => (
              <Col xl={3} md={6} key={key}>
              <Card className="card-h-100" style={{ height: "400px", width:"400px",borderRadius: "0px", borderColor: "1px solid #F9F9F9",  boxShadow: "0px 4px 16px 0px rgb(0 0 0 / 7%)" }}>
                <CardBody style={{ display: "flex", flexDirection: "column" ,marginTop:"90px"}}>
                  <ReactApexChart
                    // options={options}
                    series={[{ data: [...widget["series"]] }]}
                    type="line"
                    className="apex-charts  "
                    dir="ltr"
                    height={100}
                    options={{
                      ...options, // Use your existing options
                      colors: ['#35C27F'], // Set the desired color here
                      // plotOptions: {
                      //   line: {
                      //     colors: ['#FF5733'], // Set the desired color here
                      //   },
                      // },
                    }}
                  />
                  <div style={{ marginTop: "auto" }}>
                    <Col className="align-items-center">
                      <Col xs={6}>
                        <span className="text-muted mb-3 lh-1 d-block text-truncate">
                          {widget.title}
                        </span>
                        <h4 className="">
                          {widget.isDoller === true ? "₹" : ""}
                          <span className="counter-value">
                            <CountUp
                              start={0}
                              end={widget.price}
                              duration={2}
                              // decimals={2}
                              separator=""
                            />
                            {widget.postFix}
                          </span>
                        </h4>
                      </Col>
                      <Col xs={6}>
                        <div className="text-nowrap">
                          <span
                            className={
                              "badge bg-" +
                              widget.statusColor +
                              "-subtle text-" +
                              widget.statusColor
                            }
                          >
                            {widget.rank}
                          </span>
                          <span className="ms-1 text-muted font-size-13"> Since last week
                          </span>
                        </div>
                      </Col>
                    </Col>
                  </div>
                </CardBody>
              </Card>
            </Col>
            
            ))}
          </Row>
          {/* <Row>
            <WalletBalance />
            <Col>
              <Row>
                <InvestedOverview />
                <NewSlider />
              </Row>
            </Col>
          </Row> */}
          {/* <Row>
            <MarketOverview />
            <Locations />
          </Row> */}
          <Row>
            {/* <Trading /> */}
            <Transactions />
            {/* <RecentActivity /> */}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;