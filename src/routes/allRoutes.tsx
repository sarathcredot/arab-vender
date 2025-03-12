import { Navigate } from "react-router-dom";

//Dashboard
import Dashboard from "../pages/Dashboard";


//Tables
import Productlisting from "src/pages/Product/listing";

//Charts

//blog

//Icons

//AuthenticationInner pages

//Authentication pages
import Login from "src/pages/Authentication/Login";
import UserProfile from "src/pages/Authentication/user-profile";

//Maps
import Signup from "src/pages/Authentication/Signup";
import Brand from "src/pages/Brand/brand";
import AddCmsSection from "src/pages/Cms/AddcmsSection";
import AddCmstwosection from "src/pages/Cms/AddcmsTwo";
import CmsListing from "src/pages/Cms/Cmsonelisting";
import CmstwoListing from "src/pages/Cms/Cmstwolisting";
import CmsRecordDetails from "src/pages/Cms/ViewCmsOnerecord";
import CmsTwoRecordDetails from "src/pages/Cms/ViewCmsTworecord";
import ColorList from "src/pages/Color/ColorList";
import Addproduct from "src/pages/Product/addproduct";
import AddVariant from "src/pages/Product/addvariant";
import ListVarient from "src/pages/Product/varientlist";
import View from "src/pages/Product/view";
import SizeList from "src/pages/Size/SizeList";
import VendorWelcome from "src/pages/Vendor/vendor";
import Category from "src/pages/category/Category";
import Kyc from "../pages/Kyc/kyc";
import React from "react";
import AllOrders from "src/pages/Orders/allOrders/AllOrders";
import ALlOrderDetails from "src/pages/Orders/allOrders/AllOrderDetails";
import ShippingOrders from "src/pages/Orders/shippingOrders/ShippingOrders";
import ShippingOrderDetails from "src/pages/Orders/shippingOrders/ShippingOrderDetails";
import ReturnOrders from "src/pages/Orders/returnOrders/ReturnOrders";
import ReturnOrderDetails from "src/pages/Orders/returnOrders/ReturnOrderDetails";
import RefundOrders from "src/pages/Orders/refundOrders/RefundOrders";
import RefundOrderDetails from "src/pages/Orders/refundOrders/RefundOrderDetails";
import PageNotFound from "src/pages/Page404";
interface RouteProps {
  path: string;
  component: any;
  exact?: boolean;
}

const adminRoutes: Array<RouteProps> = [
  // //User Profile
  { path: "/profile", component: <UserProfile /> },

  { path: "/dashboard", component: <Dashboard /> },


  { path: "/product", component: <Productlisting /> },
  { path: "/product/details", component: <View /> },
  { path: "/add-product", component: <Addproduct /> },
  { path: "/add-variant", component: <AddVariant /> },
  { path: "/product/variant", component: <ListVarient /> },
  { path: "/cmslisting", component: <CmsListing /> },
  { path: "/cmstwolisting", component: <CmstwoListing /> },
  { path: "/cms/details", component: <CmsRecordDetails /> },
  { path: "/cmstwo/details", component: <CmsTwoRecordDetails /> },
  { path: "/add-cms", component: <AddCmsSection /> },
  { path: "/add-cms2", component: <AddCmstwosection /> },



  { path: "/category", component: <Category /> },
  { path: "/colors", component: <ColorList /> },
  { path: "/size", component: <SizeList /> },
  { path: "/kyc", component: <Kyc /> },
  { path: "/brand", component: <Brand /> },



  // ORDERS
  { path: "/orders", component: <AllOrders /> },
  { path: "/orders/details", component: <ALlOrderDetails /> },

  { path: "/shipping-orders", component: <ShippingOrders /> },
  { path: "/shipping-orders/details", component: <ShippingOrderDetails /> },

  { path: "/return-orders", component: <ReturnOrders /> },
  { path: "/return-orders/details", component: <ReturnOrderDetails /> },

  { path: "/refund-orders", component: <RefundOrders /> },
  { path: "/refund-orders/details", component: <RefundOrderDetails /> },

  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },

  { path: "*", component: <PageNotFound /> },

];

const authRoutes: Array<RouteProps> = [
  //Authentication pages
  { path: "/become-a-seller", component: <VendorWelcome /> },
  { path: "/login", component: <Login /> },
  { path: "/signup", component: <Signup /> },

  { path: "*", component: <Navigate to="/login" /> },

];

export { adminRoutes, authRoutes };
