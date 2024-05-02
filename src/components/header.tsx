import React from 'react'
import styles from "./header.module.css"
import logo from "../assets/images/arabDealLogo.svg"
function header() {
  return (
    <div>
      <div className={styles.header_container} >
        <div className={styles.header}>
          <img src={logo} width={"130px"} />

        </div></div>
    </div>
  )
}

export default header