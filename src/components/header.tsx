import React from 'react'
import styles from "./header.module.css"
import logo from "../../public/image-3.svg"
function header() {
  return (
    <div>
      <div className={styles.header_container} >
        <div className={styles.header}>
          <img src="/images/arabdeallogo.svg" />

        </div></div>
    </div>
  )
}

export default header