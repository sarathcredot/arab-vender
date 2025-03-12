import React from 'react'
import styles from "./header.module.css"
import { Button } from 'reactstrap';
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/arabDealLogo.svg"
function header({button=false}) {
  const navigate = useNavigate()
  return (
    <div>
      <div className={styles.header_container} >
        <div className={styles.header}>
          <img src={logo} width={"130px"} />
          {button&&<Button
              style={{ backgroundColor: '#E30613', width: '170px', height: '41px', border: 'none', color: 'white' }}
              onClick={()=>navigate("/login")}
            >
              Start Selling
            </Button>}

        </div></div>
    </div>
  )
}

export default header