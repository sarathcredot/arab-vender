import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from 'src/components/header';
import styles from '../../components/header.module.css';
// import Footer from 'src/components/footer';
import { BsArrowRight } from "react-icons/bs";
function Vendorlanding() {
  const handleButtonClick = () => {
    console.log('Button clicked');
    // You can add more logic here if needed
  };

  return (
    <div>
      <Header />
      <div className={styles.maincontainer}>
        <div className={styles.headercontainerwelcome}>
          <div className={styles.headsection}>
            <span style={{ color: 'white', fontSize: '39px', fontWeight: '700', lineHeight: '48px' }}>
              Begin your seller journey <br /> on Arab Deal
            </span>
            <h6 style={{ color: '#989898', fontSize: '16px', lineHeight: '60px' }}>
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
          <div  className={styles.middlesection}>
            <div style={{ fontSize: '29px', fontWeight: '700' }}>Lorem ipsum dolor sit amet</div>
            <p style={{ fontSize: '13px', lineHeight: '50px' }}>
              Lorem ipsum dolor sit amet consectetur. Sapien ut libero sed lacinia egestas placerat
            </p>
            <Link to="/login">
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
            </Link>
          </div>
        </div>
      </div>
      <div
        className={styles.sellerbox}
        // style={{ backgroundColor: 'black', display: 'flex', justifyContent: 'space-around', paddingTop: '40px', paddingBottom: '100px' }}
      >
        <div style={{ width: '600px', height: '400px', backgroundColor: 'white', padding: '100px 34px' }}>
          <p style={{ fontSize: '36px', fontWeight: '700' }}>Become a seller on Arabdeal</p>
          <p style={{ fontSize: '19px' }}>Lorem ipsum dolor sit amet consectetur. Lobortis amet elit varius mauris velorci</p>
          <Link to="/login">
            <Button
            className={styles.startsellingbtn}
              // style={{
              //   backgroundColor: 'black',
              //   width: '190px',
              //   height: '50px',
              //   color: 'white',
              //   marginTop: '20px',
              // }}
              onClick={handleButtonClick}
            >
              Start Selling
            </Button>
          </Link>
        </div>
        <div style={{ width: '600px', height: '400px', backgroundColor: 'white', padding: '100px 34px' }}>
          <p style={{ fontSize: '36px', fontWeight: '700' }}>Become a seller on Arabdeal</p>
          <p style={{ fontSize: '19px' }}>Lorem ipsum dolor sit amet consectetur. Lobortis amet elit varius mauris velorci</p>
          <Link to="/login">
            <Button
              className={styles.startsellingbtn}
              onClick={handleButtonClick}
            >
              Start Selling
            </Button>
          </Link>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default Vendorlanding;
