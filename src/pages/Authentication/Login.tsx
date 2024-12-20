import React, { useEffect, useState } from "react";

import {
  Row,
  Col,
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
  Alert,
} from "reactstrap";
import { FaSortDown } from "react-icons/fa";
import PropTypes from "prop-types";
import Select from "react-select"
//redux
import { useSelector, useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

//Social Media Imports
import { GoogleLogin } from "react-google-login";
// import TwitterLogin from "react-twitter-auth"
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

// actions
import { loginUser, socialLogin } from "../../store/actions";

// import images
import logo from "../../assets/images/brands/Logo - login.png";

//Import config
import config from "../../config";
import CarouselPage from "../AuthenticationInner/CarouselPage";
import { createSelector } from "reselect";
import { gql, useMutation } from "@apollo/client";
import { ToastContainer, toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import styles from "../../components/header.module.css";
import Header from "src/components/header";
interface LoginProps {
  history: object;
}
const LOGIN = gql`mutation LoginVendorWithOtp($input: VendorLoginInput!) {
  loginVendorWithOtp(input: $input) {
    _id
    message
  }
}`
const SIGNUP = gql`
  mutation CreateVendor($input: VendorSignUpInput!, $image: Upload) {
    createVendor(input: $input, image: $image) {
      _id
      message
      token
    }
  }
`;
const VERIFY_OTP = gql`mutation VerifyVendorLoginOtp($input: VerifyVendorLoginOtpInput!) {
  verifyVendorLoginOtp(input: $input) {
    _id
    token
    message
    type
    mobileNumber
    countryCode
  }
}`
const RESEND_OTP = gql`mutation ReSendloginVendorWithOtp($input: VendorLoginInput!) {
  reSendloginVendorWithOtp(input: $input) {
    _id
    message
  }
}`
const Login = (props: any) => {
  const dispatch = useDispatch();

  const errorData = createSelector(
    (state: any) => state.login,
    (state) => ({
      error: state.error,
    })
  );


  // Inside your component
  // const { error } = useSelector(errorData);
  const navigate = useNavigate();
  // document.title = "Login | Arabdeal";
  const {
    register,
    handleSubmit,
    watch,
    setValue, reset,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      mobileNumber: "",
      image: "",
    },
  });
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [showOtpInput, setShowOtpInput] = useState("register");
  const [vendorotp, setventorotp] = useState("")
  const [signupvendor] = useMutation(SIGNUP);
  const [getotp] = useMutation(LOGIN)
  const [verify] = useMutation(VERIFY_OTP)
  const [resendotp] = useMutation(RESEND_OTP)
  const [selectedImage, setSelectedImage] = useState<{ file: any | null, name: string } | null>(null);
  const [vendorid, setVendorid] = useState("")


  const countryOptions = [
    // { label: "uae", value: "971", flag: "/images/uae.svg" },
    // { label: "india", value: "91", flag: "/images/ind.svg" },
    { label: "oman", value: "968", flag: "/images/omn.png" },
    // { label: "saudi", value: "966", flag: "/images/sar.png" },
  ];
  const defaultOption = countryOptions[0];
  interface CustomStyles {
    control: (provided: Record<string, any>, state: any) => Record<string, any>;
    menu: (provided: Record<string, any>) => Record<string, any>;
    option: (provided: Record<string, any>, state: any) => Record<string, any>;
    indicatorSeparator: () => Record<string, any>;
    // dropdownIndicator: () => Record<string, any>;
  }
  const [selectedOption, setSelectedOption] = useState(defaultOption?.value);

  const handleSelectChange = (selected: any) => {
    setSelectedOption(selected?.value);
  };
  // console.log(selectedOption);

  const customStyles: CustomStyles = {
    control: (provided, state) => ({
      ...provided,
      // borderRight: 'none',
      boxShadow: 'none',
      borderRadius: '0',
      height: '100%',
      outline: 'none',
      // boxShadow: state.isFocused ? 'none' : provided.boxShadow,
      '&:selected': {
        border: 'none',
      },
    }),
    menu: (provided) => ({
      ...provided,
      width: '90px',
    }),
    option: (provided, state) => ({
      ...provided,
      whiteSpace: 'nowrap',
      background: state.isSelected ? '#EFEFEF' : 'transparent',
      color: 'black',
      // background: 'transparent',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    // dropdownIndicator: () => ({
    //   display: 'flex',
    // }),
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage({ file: event.target?.files?.[0], name: file.name });
    }
    // setSelectedImage(event.target.files[0].name )
  };

  const handleResend = async () => {
    // console.log("click");

    try {
      const response = await getotp({ variables: { input: { mobileNumber: localStorage?.getItem("mobile"), countryCode: "+" + localStorage?.getItem("countrycode") } } })
      console.log("response", response);
      if (response) {
        setVendorid(response?.data?.loginVendorWithOtp?._id)
        toast.success(response?.data?.loginVendorWithOtp?.message)
        setShowOtpInput("otp");
        localStorage.setItem("mobile", mobileNumber)
        localStorage.setItem("countrycode", selectedOption)
      }
    }
    // try {
    //   const response = await resendotp({ variables: { input: { mobileNumber: localStorage?.getItem("mobile"), countryCode: localStorage?.getItem("countrycode") } } })
    //   // console.log(response);
    //   toast.success(response?.data?.reSendloginVendorWithOtp?.message)

    // }
    catch (error) {
      toast.error((error as Error).message);
      // console.log(error)
    }
  }

  const handleOtpChange = (index: any, value: any) => {
    const newValue = value.replace(/\D/, '');
    const newOtp = [...otp];
    // newOtp[index] = value;
    newOtp[index] = newValue.length > 0 ? newValue.charAt(0) : '';
    // Move to the previous input if backspace is pressed on an empty input
    if (index > 0 && value === "") {
      const prevInput = document.getElementById(`otpInput${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }

    // Move to the next input
    if (index < 5 && newValue.length > 0 && !isNaN(newValue)) {
      // if (index < 5 && value !== "") {
      const nextInput = document.getElementById(`otpInput${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
    setOtp(newOtp);
    const formattedOtp = newOtp.join('');
    setventorotp(formattedOtp);

  };
  // console.log(otp);

  const handleVerifyOtp = async () => {
    try {
      const response = await verify({
        variables: {
          input: {
            code: vendorotp,
            _id: vendorid

          }
        }
      })
      if (response.data && response.data.verifyVendorLoginOtp && response.data.verifyVendorLoginOtp.type === "LOGIN") {

        localStorage.setItem("token", response?.data?.verifyVendorLoginOtp?.token)
        localStorage.setItem("vendorid", response?.data?.verifyVendorLoginOtp?._id)
        navigate("/dashboard")
      }
      else if (response.data && response.data.verifyVendorLoginOtp && response.data.verifyVendorLoginOtp.type === "SIGNUP") {
        navigate(`/signup?token=${response.data.verifyVendorLoginOtp.token}`)
      }
    }
    catch (error) {
      toast.error("Invalid OTP! Please verify and re-enter the code");
      // console.log(error)
      setOtp(['', '', '', '', '']);

    }
    // setShowOtpInput("verify");

  };

  const handleGetOtp = async () => {
    try {
      if (!mobileNumber.trim()) {
        setError("Mobile number is required");
        return;
      }
      else if (mobileNumber.length < 8 || mobileNumber.length > 8) {
        setError("Enter a valid mobile number");
        return;
      }

      // If validation is successful, clear any previous errors
      setError("");

      const response = await getotp({ variables: { input: { mobileNumber: mobileNumber, countryCode: "+" + selectedOption } } })
      console.log("response", response);
      if (response) {
        setVendorid(response?.data?.loginVendorWithOtp?._id)
        toast.success(response?.data?.loginVendorWithOtp?.message)
        setShowOtpInput("otp");
        localStorage.setItem("mobile", mobileNumber)
        localStorage.setItem("countrycode", selectedOption)
      }
    }
    catch (error) {
      toast.error((error as Error).message);
      // console.log(error)
    }
  };






  const token = localStorage?.getItem('token')

  useEffect(() => {
    if (!token) {
      localStorage.removeItem("desktopView");
      navigate("/login");
    } else {
      navigate("/");
    }
  }, [token]);

  return (


    <div>
      <Header />
      <ToastContainer />
      <div className={styles.headercontainer} style={{ paddingLeft: "0px", paddingRight: "0px" }}>
        <div className={styles.outerWrapper} style={{}}>
          <div className={styles.leftcontainer}>
            {showOtpInput == "register" ? (
              <>
                <div style={{ fontSize: "26px", fontWeight: 600 }}>
                  {" "}
                  Login/ Register to your account
                </div>
                <p className={styles.subtitle}>
                  New to Arab Deal? Register now to access exclusive vendor benefits and start selling your products!
                </p>
                <div
                  style={{
                    // display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >

                  <div style={{ display: "flex", gap: "10px" }}>

                    <Select
                      options={countryOptions}

                      isSearchable={false}
                      styles={customStyles}
                      defaultValue={defaultOption}
                      onChange={handleSelectChange}
                      components={{
                        IndicatorSeparator: () => null,
                        DropdownIndicator: CustomOption,
                      }}
                      getOptionLabel={(option: any) => (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            width: "63px",

                            padding: "7px"
                          }}
                        >
                          <img
                            src={option.flag}
                            alt={option.label}
                            className={styles.flagimg}
                          // style={{ width: "28px", marginRight: "5px" }}
                          />

                        </div>
                      )}
                    />


                    <Input
                      type="number"
                      placeholder="Enter Mobile Number"
                      className={styles.inputfield}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                    />

                  </div>
                  {error && <div style={{ color: "red" }}>{error}</div>}
                  <button
                    onClick={handleGetOtp}
                    style={{
                      width: "176px",
                      height: "52px",
                      backgroundColor: "black",
                      color: "white",
                      marginTop: "58px",
                      border: "none",
                      outline: "none"
                    }}
                  >
                    {" "}
                    GET OTP
                  </button>
                  {/* <Link to="/signup"><div style={{textDecoration:"none",color:"black"}}>Dont have an account ?<span style={{color:"red",fontWeight:"500",cursor:"pointer"}}> Register here</span></div></Link> */}
                </div>
              </>
            ) : showOtpInput == "otp" ? (
              <div>
                {/* Your Verify OTP design goes here */}
                <div style={{ fontSize: "26px", fontWeight: 600 }}>
                  {" "}
                  Verify Phone Number
                </div>
                <p className={styles.subtitle}>
                  Almost there! Enter the code sent to your phone to complete the verification process and gain full access to your account
                </p>
                <div style={{ display: "flex", gap: "20px" }}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otpInput${index}`}
                      type={digit ? "text" : "password"}
                      placeholder={digit ? "" : "●"}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className={`${styles.passwordbox} ${digit ? "" : styles["placeholder-color"]}`} // Apply the class conditionally

                    // onChange={(e) => handleOtpChange(index, e.target.value)}
                    // className={styles.passwordbox}


                    />
                  ))}
                </div>
                <button
                  onClick={handleVerifyOtp}
                  style={{
                    width: "176px",
                    height: "52px",
                    backgroundColor: "black",
                    color: "white",
                    marginTop: "44px", border: "none"
                  }}
                >
                  VERIFY OTP
                </button>
                <div style={{ display: "flex" }}>
                  <p>Don't receive OTP?</p>
                  <span onClick={handleResend} style={{ color: "red", fontWeight: "500", cursor: "pointer", paddingLeft: "6px" }}>Resend</span>{" "}
                </div>
              </div>
            )
              //             : showOtpInput == "verify" ? (
              //               <>
              //                 <div style={{ fontSize: "26px", fontWeight: 600 }}>
              //                   {" "}
              //                   Register to your account
              //                 </div>
              //                 <p className={styles.subtitle}>
              //                   Lorem ipsum dolor sit amet consectetur. Sapien ut libero sed
              //                   lacinia egestas placerat.
              //                 </p>
              //                 <Form onSubmit={handleSubmit(onSubmit)}>
              //                   <div className="mb-3">
              //                     <Controller
              //                       control={control}
              //                       name="fullName"
              //                       render={({ field: { onChange, value } }) => (
              //                         <Input
              //                           type="text"
              //                           value={value}
              //                           onChange={onChange}
              //                           placeholder="Full Name"
              //                           className={styles.inputfield}
              //                         />
              //                       )}
              //                     />
              //                   </div>

              //                   <div className="mb-3">
              //                     <Controller
              //                       control={control}
              //                       name="email"
              //                       render={({ field: { onChange, value } }) => (
              //                         <Input
              //                           name="email"
              //                           value={value}
              //                           onChange={onChange}
              //                           placeholder="Email"
              //                           className={styles.inputfield}
              //                         />
              //                       )}
              //                     />
              //                   </div>

              //                   <div className="mb-3">
              //                     <Controller
              //                       control={control}
              //                       name="mobileNumber"
              //                       render={({ field: { onChange, value } }) => (
              //                         <Input
              //                           name="mobileNumber"
              //                           value={value}
              //                           onChange={onChange}
              //                           placeholder="Mobile Number"
              //                           className={styles.inputfield}
              //                         />
              //                       )}
              //                     />
              //                   </div>

              //                   <div>
              //                     <div className={styles.filediv} >
              //                       <div>
              //                       {selectedImage ? <p style={{marginBottom:0}}>{selectedImage.name}</p> : <p style={{marginBottom:0}}>Select file</p>}
              //                         {/* {selectedImage?[0].name) */}
              //                       </div>
              //                       <label
              //                         htmlFor="upload-image"
              //                         className={styles.uploadfile}
              //                         // style={{ backgroundColor: "red" }}
              //                       >
              //                         <svg xmlns="http://www.w3.org/2000/svg" width="10" height="18" viewBox="0 0 10 18" fill="none">
              // <path d="M4.58333 17.3337C3.30556 17.3337 2.22222 16.8892 1.33333 16.0003C0.444444 15.1114 0 14.0281 0 12.7503V4.00033C0 3.08366 0.326389 2.29894 0.979167 1.64616C1.63194 0.993381 2.41667 0.666992 3.33333 0.666992C4.25 0.666992 5.03472 0.993381 5.6875 1.64616C6.34028 2.29894 6.66667 3.08366 6.66667 4.00033V11.917C6.66667 12.5003 6.46528 12.9934 6.0625 13.3962C5.65972 13.7989 5.16667 14.0003 4.58333 14.0003C4 14.0003 3.50694 13.7989 3.10417 13.3962C2.70139 12.9934 2.5 12.5003 2.5 11.917V4.00033H3.75V11.917C3.75 12.1531 3.82986 12.351 3.98958 12.5107C4.14931 12.6705 4.34722 12.7503 4.58333 12.7503C4.81944 12.7503 5.01736 12.6705 5.17708 12.5107C5.33681 12.351 5.41667 12.1531 5.41667 11.917V4.00033C5.41667 3.41699 5.21528 2.92394 4.8125 2.52116C4.40972 2.11838 3.91667 1.91699 3.33333 1.91699C2.75 1.91699 2.25694 2.11838 1.85417 2.52116C1.45139 2.92394 1.25 3.41699 1.25 4.00033V12.7503C1.25 13.667 1.57639 14.4517 2.22917 15.1045C2.88194 15.7573 3.66667 16.0837 4.58333 16.0837C5.5 16.0837 6.28472 15.7573 6.9375 15.1045C7.59028 14.4517 7.91667 13.667 7.91667 12.7503V4.00033H9.16667V12.7503C9.16667 14.0281 8.72222 15.1114 7.83333 16.0003C6.94444 16.8892 5.86111 17.3337 4.58333 17.3337Z" fill="white"/>
              // </svg>
              //                         Upload
              //                       </label>
              //                     </div>
              //                     <Controller
              //                       control={control}
              //                       name="image"
              //                       render={({ field: { onChange, value } }) => (

              //                     <Input
              //                       type="file"
              //                       id="upload-image"

              //                       multiple={false}
              //                       accept="image/*"
              //                       style={{ display: "none" }}
              //                       onChange={handleImageChange}
              //                       className={styles.inputfield}
              //                       value={value}
              //                     />)}/>

              //                     {/* {selectedImage && (
              //         <img src={URL.createObjectURL(selectedImage)} alt="Selected Image" />
              //       )} */}
              //                   </div>
              //                   <button
              //                     type="submit"
              //                     style={{
              //                       width: "176px",
              //                       height: "52px",
              //                       backgroundColor: "black",
              //                       color: "white",
              //                       marginTop: "20px",
              //                     }}
              //                   >
              //                     {" "}
              //                     SIGN UP
              //                   </button>
              //                 </Form>
              //               </>
              //             ) 
              : (
                ""
              )}
          </div>
          <div className={styles.signupimg}>
            <img
              src="/images/otppage.png"
              alt="OTP Image"
            // style={{ marginTop: "-100px" }}
            />
          </div>
        </div>
      </div>
      <ToastContainer />


    </div>


  );
};
const CustomOption = ({ innerProps, isDisabled }: any) =>
  !isDisabled ? (
    <div {...innerProps} style={{ display: "flex", alignItems: "center", paddingRight: "15px", marginBottom: "9px" }}><FaSortDown style={{ fontSize: "21px" }} /></div>
  ) : null;
export default withRouter(Login);
Login.propTypes = {
  history: PropTypes.object,
};
