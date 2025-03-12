import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from 'src/components/header';
import styles from '../../components/header.module.css';
// import Footer from 'src/components/footer';
import { BsArrowRight } from "react-icons/bs";
function Vendorlanding() {
  const navigate = useNavigate()
  const handleButtonClick = () => {
    navigate("/login")
  };

  return (
    <div className={styles.vendor_container}>
      <Header button={true} />
      <div className={styles.maincontainer}>
        <div className={styles.headercontainerwelcome}>
          <div className={styles.headsection}>
            <h1 style={{ color: 'white', fontSize: '39px', fontWeight: '700', lineHeight: '48px' }}>
              Begin your seller journey <br/>on Arab Deal
            </h1>
            <h6 style={{ color: '#989898', fontSize: '16px', lineHeight: 'normal' }}>
              Lorem ipsum dolor sit amet consectetur. Lobortis amet elit varius mauris velorci.
            </h6>
            <Link to="/login">

            <Button
              style={{ backgroundColor: '#E30613', width: '170px', height: '41px', border: 'none', color: 'white' }}
              onClick={handleButtonClick}
            >
              Start Selling
            </Button>
            </Link>
          </div>
          
        </div>
      </div>
      <div  className={styles.middlesection}>
            <div style={{ fontSize:  '32px', fontWeight: '700',marginBottom:"10px" }}>Benefit for Becoming a Seller</div>
            <p style={{ fontSize: '15px',}}>
            Unlock new opportunities and grow your business with ArabDeal. Enjoy a seamless selling experience with advanced marketing tools, secure transactions, and dedicated seller support. Start selling today and reach more customers effortlessly!
            </p>
            {/* <Link to="/login">
            <Button
              style={{
                width: '672px',
                height: '109px',
                backgroundColor: '#191919',
                color: 'white',
                fontSize: '24px',
                fontWeight: 600,
                border: '1px solid #686868',
              }}
              onClick={handleButtonClick}
            >
              Become a Seller On Arabdeal
              <BsArrowRight style={{paddingLeft:"15px",fontSize:"20px"}}/>
            </Button> 
            </Link> */}
          </div>
      <div
        className={styles.sellerbox}
      >
        <div className={styles.box}>
          <p style={{ fontSize: '36px', fontWeight: '700' }}>Sell with Ease & Confidence</p>
          <p style={{ fontSize: '19px' }}>Effortlessly manage your sales with an intuitive dashboard, secure payment processing, and streamlined order management.</p>
            <Button
            className={styles.startsellingbtn}
              onClick={handleButtonClick}
            >
              Start Selling
            </Button>
        </div>
        <div className={styles.box}>
          <div>

          <p style={{ fontSize: '36px', fontWeight: '700' }}>Unlock Your Business Potential</p>
          <p style={{ fontSize: '19px' }}>Grow your business with flexible payouts, exclusive seller benefits, and promotional support to scale your success at your own pace.</p>
          </div>
            <Button
              className={styles.startsellingbtn}
              onClick={handleButtonClick}
            >
              Start Selling
            </Button>
        </div>
      </div>
        <img className={styles.vector_svg} src="/images/bg_vector.svg"/>
        <div className={styles.delivery_boy}>
          <img className={styles.delivery_boy_svg} src="/images/delivery_boy.svg" alt='delivery boy image'/>
        </div>
      {/* <Footer /> */}
    </div>
  );
}

export default Vendorlanding;
