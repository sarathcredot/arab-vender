import PropTypes from "prop-types";
import React, { useEffect, useRef, useCallback, useState } from "react";

//Import Icons
import FeatherIcon from "feather-icons-react";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

//Import images
import giftBox from "../../assets/images/giftbox.png";

//i18n
import { withTranslation } from "react-i18next";

// MetisMenu
import MetisMenu from "metismenujs";
import { Link, useLocation } from "react-router-dom";

import withRouter from "../../../src/components/Common/withRouter";
import { TbBrand4Chan, TbBrandAdobe } from "react-icons/tb";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { MdOutlineAccountTree } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { gql, useQuery } from "@apollo/client";



const KYC_STATUS = gql`
query GetKycStatus {
  getKycStatus {
    record {
      _id
      isBlocked
      isKycCompleted
      outletStatus
      companyStatus
    }
    message
  }
}
`;


const SidebarContent = (props: any) => {
  const ref = useRef<any>();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const { loading, error, data:KYCData } = useQuery(KYC_STATUS, {
    fetchPolicy: "network-only",
  });

  const activateParentDropdown = useCallback((item: any) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent?.childNodes[1];

    if (parent2El && parent2El?.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items: any) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item?.classList?.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  const path = useLocation();

  const activeMenu = useCallback(() => {
    const pathName = path.pathname;

    const ul: any = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");

    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      const itemPath = items[i].getAttribute("href");

      if (itemPath && (pathName === itemPath || pathName.startsWith(itemPath))) {
        activateParentDropdown(items[i]);
        break;
      }
    }
  }, [path.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  }, []);

  useEffect(() => {
    new MetisMenu("#side-menu");
    activeMenu();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    activeMenu();
  }, [activeMenu]);

  function scrollElement(item: HTMLAnchorElement) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const handleItemClick = (itemPath: string, e: any) => {
    if (openMenus.includes(itemPath)) {
      setOpenMenus((prevMenus) => prevMenus.filter((menu) => menu !== itemPath));
    } else {
      const parentPath = getParentPath(itemPath);
      setOpenMenus((prevMenus) => [
        ...prevMenus.filter((menu) => !menu.startsWith(parentPath)),
        itemPath,
      ]);
    }
    e.preventDefault();
  };

  const getParentPath = (itemPath: string) => {
    const segments = itemPath.split('/').filter(Boolean);
    segments.pop();
    return `/${segments.join('/')}`;
  };

  return (
    <React.Fragment>
      <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            {/* <li className="menu-title" style={{ color: "#FFF" }}>
              {props.t("Menu")}{" "}
            </li> */}
            <li className="mt-3 li-sideBar" style={{ borderRadius: "0px" }}>
              <Link to="/dashboard" className="">
                {/* <FeatherIcon icon="home" /> <span>{props.t("Dashboard")}</span>
                 */}

                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.6087 13.6957V5.86958L7.82609 1.95654L13.0435 5.86958V13.6957H9.13044V9.13045H6.52174V13.6957H2.6087Z" />
                </svg> */}
                <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.25 11.5C1.25 11.931 1.4212 12.3443 1.72595 12.649C2.0307 12.9538 2.44402 13.125 2.875 13.125H5.875C6.0884 13.125 6.29971 13.083 6.49686 13.0013C6.69401 12.9196 6.87315 12.7999 7.02405 12.649C7.32879 12.3443 7.5 11.931 7.5 11.5V9.75C7.5 9.31902 7.32879 8.9057 7.02405 8.60095C6.7193 8.29621 6.30598 8.125 5.875 8.125H2.875C2.44402 8.125 2.0307 8.29621 1.72595 8.60095C1.4212 8.9057 1.25 9.31902 1.25 9.75L1.25 11.5ZM8.75 11.5C8.75 11.931 8.9212 12.3443 9.22595 12.649C9.5307 12.9538 9.94402 13.125 10.375 13.125H12.125C12.556 13.125 12.9693 12.9538 13.274 12.649C13.5788 12.3443 13.75 11.931 13.75 11.5V9.75C13.75 9.31902 13.5788 8.9057 13.274 8.60095C12.9693 8.29621 12.556 8.125 12.125 8.125H10.375C9.94402 8.125 9.5307 8.29621 9.22595 8.60095C8.9212 8.9057 8.75 9.31902 8.75 9.75V11.5ZM1.25 5.25C1.25 5.68098 1.4212 6.0943 1.72595 6.39905C2.0307 6.70379 2.44402 6.875 2.875 6.875H4.625C5.05598 6.875 5.4693 6.70379 5.77405 6.39905C6.07879 6.0943 6.25 5.68098 6.25 5.25V3.5C6.25 3.2866 6.20797 3.07529 6.1263 2.87814C6.04464 2.68098 5.92494 2.50185 5.77405 2.35095C5.62315 2.20006 5.44401 2.08036 5.24686 1.9987C5.04971 1.91703 4.8384 1.875 4.625 1.875H2.875C2.6616 1.875 2.45029 1.91703 2.25314 1.9987C2.05599 2.08036 1.87685 2.20006 1.72595 2.35095C1.57506 2.50185 1.45536 2.68098 1.3737 2.87814C1.29203 3.07529 1.25 3.2866 1.25 3.5L1.25 5.25ZM7.5 5.25C7.5 5.68098 7.6712 6.0943 7.97595 6.39905C8.2807 6.70379 8.69402 6.875 9.125 6.875H12.125C12.556 6.875 12.9693 6.70379 13.274 6.39905C13.5788 6.0943 13.75 5.68098 13.75 5.25V3.5C13.75 3.2866 13.708 3.07529 13.6263 2.87814C13.5446 2.68098 13.4249 2.50185 13.274 2.35095C13.1232 2.20006 12.944 2.08036 12.7469 1.9987C12.5497 1.91703 12.3384 1.875 12.125 1.875H9.125C8.9116 1.875 8.70029 1.91703 8.50314 1.9987C8.30598 2.08036 8.12685 2.20006 7.97595 2.35095C7.82506 2.50185 7.70536 2.68098 7.62369 2.87814C7.54203 3.07529 7.5 3.2866 7.5 3.5V5.25Z"
                        // fill="#E30613"
                      />
                    </svg>
                <span>{props.t("Dashboard")}</span>
              </Link>
            </li>
            <li className="mt-3 li-sideBar" style={{ borderRadius: "0px" }}>
              <Link to="/kyc" className=" ">
                {/* <FeatherIcon icon="shopping-cart" /><span>{props.t("Products")}</span> */}
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                >
                  <path d="M4.375 13.75V10H3.375C2.95833 10 2.60417 9.85417 2.3125 9.5625C2.02083 9.27083 1.875 8.91667 1.875 8.5C1.875 8.19792 1.95833 7.91927 2.125 7.66406C2.29167 7.40885 2.51042 7.21875 2.78125 7.09375L6.875 5.28125V4.875C6.5 4.73958 6.19792 4.51302 5.96875 4.19531C5.73958 3.8776 5.625 3.52083 5.625 3.125C5.625 2.60417 5.80729 2.16146 6.17188 1.79688C6.53646 1.43229 6.97917 1.25 7.5 1.25C8.02083 1.25 8.46354 1.43229 8.82812 1.79688C9.19271 2.16146 9.375 2.60417 9.375 3.125H8.125C8.125 2.94792 8.0651 2.79948 7.94531 2.67969C7.82552 2.5599 7.67708 2.5 7.5 2.5C7.32292 2.5 7.17448 2.5599 7.05469 2.67969C6.9349 2.79948 6.875 2.94792 6.875 3.125C6.875 3.30208 6.9349 3.45052 7.05469 3.57031C7.17448 3.6901 7.32292 3.75 7.5 3.75C7.67708 3.75 7.82552 3.8099 7.94531 3.92969C8.0651 4.04948 8.125 4.19792 8.125 4.375V5.28125L12.2188 7.09375C12.4896 7.21875 12.7083 7.40885 12.875 7.66406C13.0417 7.91927 13.125 8.19792 13.125 8.5C13.125 8.91667 12.9792 9.27083 12.6875 9.5625C12.3958 9.85417 12.0417 10 11.625 10H10.625V13.75H4.375ZM3.375 8.75H4.375V8.125H10.625V8.75H11.625C11.6979 8.75 11.7578 8.72396 11.8047 8.67188C11.8516 8.61979 11.875 8.55208 11.875 8.46875C11.875 8.41667 11.862 8.3724 11.8359 8.33594C11.8099 8.29948 11.7708 8.27083 11.7188 8.25L7.5 6.375L3.28125 8.25C3.22917 8.27083 3.1901 8.29948 3.16406 8.33594C3.13802 8.3724 3.125 8.41667 3.125 8.46875C3.125 8.55208 3.14844 8.61979 3.19531 8.67188C3.24219 8.72396 3.30208 8.75 3.375 8.75Z" />
                </svg> */}
                <MdOutlineAccountTree />
                <span>{props.t("KYC")}</span>
              </Link>
            </li>
            {KYCData && KYCData?.getKycStatus?.record?.isKycCompleted&&(<>
            
            <li className="mt-3 li-sideBar" style={{ borderRadius: "0px" }}>
              <Link to="/brand" className=" ">
              <svg
                          width="60"
                          height="60"
                          viewBox="0 0 60 60"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 16.194C5 12.752 5 11.031 5.5542 9.67053C6.31612 7.80018 7.80018 6.31612 9.67053 5.5542C11.031 5 12.752 5 16.194 5C19.6361 5 21.3571 5 22.7176 5.5542C24.5879 6.31612 26.072 7.80018 26.834 9.67053C27.388 11.031 27.388 12.752 27.388 16.194C27.388 19.6361 27.388 21.3571 26.834 22.7176C26.072 24.5879 24.5879 26.072 22.7176 26.834C21.3571 27.388 19.6361 27.388 16.194 27.388C12.752 27.388 11.031 27.388 9.67053 26.834C7.80018 26.072 6.31612 24.5879 5.5542 22.7176C5 21.3571 5 19.6361 5 16.194Z"
                            // fill="white"
                          />
                          <path
                            d="M5 43.8061C5 40.3641 5 38.6431 5.5542 37.2826C6.31612 35.4123 7.80018 33.9281 9.67053 33.1663C11.031 32.6121 12.752 32.6121 16.194 32.6121C19.6361 32.6121 21.3571 32.6121 22.7176 33.1663C24.5879 33.9281 26.072 35.4123 26.834 37.2826C27.388 38.6431 27.388 40.3641 27.388 43.8061C27.388 47.2481 27.388 48.9691 26.834 50.3296C26.072 52.2001 24.5879 53.6841 22.7176 54.4458C21.3571 55.0001 19.6361 55.0001 16.194 55.0001C12.752 55.0001 11.031 55.0001 9.67053 54.4458C7.80018 53.6841 6.31612 52.2001 5.5542 50.3296C5 48.9691 5 47.2481 5 43.8061Z"
                            // fill="white"
                          />
                          <path
                            d="M32.6123 43.8061C32.6123 40.3641 32.6123 38.6431 33.1666 37.2826C33.9286 35.4123 35.4126 33.9281 37.2828 33.1663C38.6433 32.6121 40.3643 32.6121 43.8063 32.6121C47.2486 32.6121 48.9696 32.6121 50.3298 33.1663C52.2003 33.9281 53.6843 35.4123 54.4463 37.2826C55.0006 38.6431 55.0006 40.3641 55.0006 43.8061C55.0006 47.2481 55.0006 48.9691 54.4463 50.3296C53.6843 52.2001 52.2003 53.6841 50.3298 54.4458C48.9696 55.0001 47.2486 55.0001 43.8063 55.0001C40.3643 55.0001 38.6433 55.0001 37.2828 54.4458C35.4126 53.6841 33.9286 52.2001 33.1666 50.3296C32.6123 48.9691 32.6123 47.2481 32.6123 43.8061Z"
                            // fill="white"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M41.9313 23.6941C41.9313 24.7296 42.7705 25.5692 43.8063 25.5692C44.8418 25.5692 45.6813 24.7296 45.6813 23.6941V18.0691H51.3063C52.3418 18.0691 53.1813 17.2296 53.1813 16.1941C53.1813 15.1586 52.3418 14.3191 51.3063 14.3191H45.6813V8.69409C45.6813 7.65857 44.8418 6.81909 43.8063 6.81909C42.7705 6.81909 41.9313 7.65857 41.9313 8.69409V14.3191H36.3063C35.2705 14.3191 34.4313 15.1586 34.4313 16.1941C34.4313 17.2296 35.2705 18.0691 36.3063 18.0691H41.9313V23.6941Z"
                            // fill="white"
                          />
                        </svg>
                {/* <TbBrand4Chan /> */}
                <span>{props.t("Brand")}</span>
              </Link>
            </li>
            <li className="mt-3  li-sideBar" style={{ borderRadius: "0px" }}>
              <Link to="/category" className="">
                {/* <FeatherIcon icon="grid" /> <span>{props.t("Category")}</span> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                >
                  <path d="M4.0625 6.875L7.5 1.25L10.9375 6.875H4.0625ZM10.9375 13.75C10.1562 13.75 9.49219 13.4766 8.94531 12.9297C8.39844 12.3828 8.125 11.7188 8.125 10.9375C8.125 10.1562 8.39844 9.49219 8.94531 8.94531C9.49219 8.39844 10.1562 8.125 10.9375 8.125C11.7188 8.125 12.3828 8.39844 12.9297 8.94531C13.4766 9.49219 13.75 10.1562 13.75 10.9375C13.75 11.7188 13.4766 12.3828 12.9297 12.9297C12.3828 13.4766 11.7188 13.75 10.9375 13.75ZM1.875 13.4375V8.4375H6.875V13.4375H1.875Z" />
                </svg>
                <span>{props.t("Category")}</span>
              </Link>
            </li>
            {/* <li className="mt-3 li-sideBar">
              <Link to="/colors" className="">
                <FeatherIcon icon="pie-chart" />{" "}
                <span>{props.t("Colors")}</span>
              
              </Link>
            </li> */}
            {/* <li className="mt-3 li-sideBar">
              <Link to="/size" className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                >
                  <path d="M2.33335 10.5C2.01252 10.5 1.73787 10.3858 1.5094 10.1573C1.28092 9.92882 1.16669 9.65417 1.16669 9.33333V4.66667C1.16669 4.34583 1.28092 4.07118 1.5094 3.84271C1.73787 3.61424 2.01252 3.5 2.33335 3.5H4.08335V7H5.25002V3.5H6.41669V7H7.58335V3.5H8.75002V7H9.91669V3.5H11.6667C11.9875 3.5 12.2622 3.61424 12.4906 3.84271C12.7191 4.07118 12.8334 4.34583 12.8334 4.66667V9.33333C12.8334 9.65417 12.7191 9.92882 12.4906 10.1573C12.2622 10.3858 11.9875 10.5 11.6667 10.5H2.33335Z" />
                </svg>
                <span>{props.t("Size")}</span>
              </Link>
            </li> */}
            <li className="mt-3 li-sideBar" style={{ borderRadius: "0px" }}>
              <Link to="/product" className=" ">

                <FaShoppingCart />

                <span>{props.t("Products")}</span>
              </Link>
            </li>

            {/* ORDERS */}

            <li className="mt-3 li-sideBar" >
              <a href="/order-resolution" onClick={(e) => handleItemClick("/order-resolution", e)}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", }}>
                    {/* <RiShoppingBag3Fill /> */}
                    <svg
                          width="60"
                          height="60"
                          viewBox="0 0 60 60"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M50.5255 19.5499L31.2755 30.6999C30.5005 31.1499 29.5255 31.1499 28.7255 30.6999L9.47554 19.5499C8.10054 18.7499 7.75054 16.8749 8.80054 15.6999C9.52554 14.8749 10.3505 14.1999 11.2255 13.7249L24.7755 6.22485C27.6755 4.59985 32.3755 4.59985 35.2755 6.22485L48.8255 13.7249C49.7005 14.1999 50.5255 14.8999 51.2505 15.6999C52.2505 16.8749 51.9005 18.7499 50.5255 19.5499Z"
                            // fill="white"
                          />
                          <path
                            d="M28.5742 35.3495V52.3995C28.5742 54.2995 26.6492 55.5495 24.9492 54.7245C19.7992 52.1995 11.1242 47.4745 11.1242 47.4745C8.07422 45.7495 5.57422 41.3995 5.57422 37.8245V24.9245C5.57422 22.9495 7.64922 21.6995 9.34922 22.6745L27.3242 33.0995C28.0742 33.5745 28.5742 34.4245 28.5742 35.3495Z"
                            // fill="white"
                          />
                          <path
                            d="M31.4248 35.3495V52.3995C31.4248 54.2995 33.3498 55.5495 35.0498 54.7245C40.1998 52.1995 48.8748 47.4745 48.8748 47.4745C51.9248 45.7495 54.4248 41.3995 54.4248 37.8245V24.9245C54.4248 22.9495 52.3498 21.6995 50.6498 22.6745L32.6748 33.0995C31.9248 33.5745 31.4248 34.4245 31.4248 35.3495Z"
                            // fill="white"
                          />
                        </svg>

                    <span>{props.t("Order Resolution")}</span>
                  </div>
                  <div
                    className="arrow-down"
                    style={{ position: "absolute", top: "30px", right: "25px" }}
                  ></div>
                </div>
              </a>
              {openMenus.includes("/order-resolution") && (
                <ul className={`sub-menu ${openMenus.includes("/order-resolution") ? "mm-show" : ""}`}>
                  <li>
                    <Link to="/orders">
                      <FeatherIcon icon="chevron-right" />{" "}
                      <span>{props.t("All Orders")}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/shipping-orders">
                      <FeatherIcon icon="chevron-right" />{" "}
                      <span>{props.t("Shipping Orders")}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/return-orders">
                      <FeatherIcon icon="chevron-right" />{" "}
                      <span>{props.t("Return orders")}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/refund-orders">
                      <FeatherIcon icon="chevron-right" />{" "}
                      <span>{props.t("Refund orders")}</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            </>)}



          </ul>

        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withTranslation()(withRouter(SidebarContent));
    