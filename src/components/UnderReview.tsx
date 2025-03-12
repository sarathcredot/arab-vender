import React from "react";
import { Button, Container } from "reactstrap";
import image from "../assets/images/icons/underReview.svg";

const UnderReview = () => {
  return (
    <Container fluid style={{height:"450px",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{height:"100%", display: "flex", flexDirection:"column",alignItems: "center", justifyContent: "center" }}>
        <img
          src={image}
          alt="image"
          style={{width:"140px"}}
        />
        <h1 style={{fontSize:"28px",fontWeight:"600",marginTop:"20px"}}>your account is under review</h1>
        <p style={{color:"#383838"}}>Your KYC verification is currently under review by the admin. Please wait for approval to gain full access.</p>
        {/* <Button style={{ backgroundColor: "#000", width: "170px", height: "41px", border: "none", color: "white" }}>
          Start Selling
        </Button> */}
      </div>
    </Container>
  );
};

export default UnderReview;
