import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Common/Breadcrumb";
import {
  Card,
  Form,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Table,
  Button,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
  Modal,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
} from "reactstrap";
// import CategoryForm from "./CategoryForm";
import { gql, useMutation, useQuery } from "@apollo/client";
import { ToastContainer, toast } from "react-toastify";
import { result } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { kycStatus } from "../../state/atom";
import styles from "./kyc.module.css";
import { MdEdit } from "react-icons/md";
import { FaFileImage } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa";
import { Link } from "react-router-dom";
import StatusIndicator from "src/components/statusIndicator/StatusIndicator";
import { fetchSignedUrl, useFetchSignedUrl } from "src/utils/fetchSignedUrl";


const ADD_VENTOR_COMPANY = gql`
mutation AddVendorCompany($input: AddVendorCompanyInput!, $images: [Upload], $fileMap: JSONObject) {
  addVendorCompany(input: $input, images: $images, fileMap: $fileMap) {
    _id
    message
  }
}`


const ADD_VENTOR_OUTLET = gql`
mutation AddVendorOutlet($input: AddVendorOutletInput!, $images: [Upload], $fileMap: JSONObject) {
  addVendorOutlet(input: $input, images: $images, fileMap: $fileMap) {
    _id
    message
  }
}`

const UPDATE_VENTOR_COMPANY = gql`
mutation UpdateVendorCompany($input: UpdateVendorCompanyInput!, $images: [Upload], $fileMap: JSONObject) {
  updateVendorCompany(input: $input, images: $images, fileMap: $fileMap) {
    message
  }
}
`

const UPDATE_VENDOR_OUTLET = gql`
mutation UpdateVendorOutlet($input: UpdateVendorOutletInput!, $images: [Upload], $fileMap: JSONObject) {
  updateVendorOutlet(input: $input, images: $images, fileMap: $fileMap) {
    message
  }
}
`

const VENDOR_DETAILS = gql`
query GetVendorAllKycRecordByVendor {
  getVendorAllKycRecordByVendor {
    record {
     _id
        outletId
        outletName
        outletStatus
        companyId
        companyName
        companyStatus
        isKycCompleted
        outletCountry
        outletDistrict
        outletVillage
        outletAddress
        outletLicense {
          fileType
          fileURL
          originalName
          mimeType
        }
        outletInteriorImage {
          fileType
          fileURL
          originalName
          mimeType
        }
        outletExteriorImage {
          fileType
          fileURL
          originalName
          mimeType
        }
        outletContactPersonName
        outletContactPersonNumber
        outletContactPersonDesignation
        outletRemarks
        companyType
        companyCrNumber
        companyCrLicense {
          fileType
          fileURL
          originalName
          mimeType
        }
        companyCooCertificate {
          fileURL
          fileType
          originalName
          mimeType
        }
        companyRemarks
    }
  }
}`


interface addCompany {
  // companyName:string;
  // companyType:string;
  // crNumber:string;
}

const CategoryList: React.FC<addCompany> = () => {
  const styless = {
    green: {
      color: 'green',
    },
    red: {
      color: 'red',
    },
    orange: {
      color: "orange"
    },
    blue: {
      color: "blue"
    }
  };
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      companyName: "",
      companyType: "",
      crNumber: "",
      // crLicense:""
    },
  });

  const {
    handleSubmit: handleSubmit1,
    watch: watch1,
    setValue: setValue1,
    reset: reset1,
    formState: { errors: error1 },
    control: control1,
  } = useForm({
    defaultValues: {
      outletName: "",
      country: "",
      district: "",
      village: "",
      address: "",
      contactPersonName: "",
      contactPersonNumber: "",
      contactPersonDesignation: "",
    },
  });
  // useEffect(()=>{

  const currentKycStatus: any = useRecoilValue(kycStatus);
  // },[kycStatus])

  const [CreateVendor] = useMutation(ADD_VENTOR_COMPANY);
  const [UpdateVendor] = useMutation(UPDATE_VENTOR_COMPANY);
  const [UpdateVendorOutlet] = useMutation(UPDATE_VENDOR_OUTLET);
  const [addOutlet] = useMutation(ADD_VENTOR_OUTLET);
  const [files, setFiles] = useState<any[]>(["", ""]);
  const [ofiles, setOfiles] = useState<any[]>(["", "", ""]);
  const [isEdit, setIsedit] = useState(false);
  const [company, setCompany] = useState(false);
  const [companydetail, setcompanyDetail] = useState<any>(null);
  const [outletstatus, setOutletstatus] = useState<any>(null)
  const [outletform, setOutletform] = useState(false)
  const id = localStorage.getItem("vendorid");
  const { loading, error, data, refetch } = useQuery(VENDOR_DETAILS, { fetchPolicy: "network-only" });

  useEffect(() => {
    setcompanyDetail(
      data?.getVendorAllKycRecordByVendor?.record?.companyStatus
    );
    setOutletstatus(data?.getVendorAllKycRecordByVendor?.record?.outletStatus)
    setValue1("outletName", data?.getVendorAllKycRecordByVendor?.record?.outletName || '')
    setValue1("country", data?.getVendorAllKycRecordByVendor?.record?.outletCountry || '')
    setValue1("district", data?.getVendorAllKycRecordByVendor?.record?.outletDistrict || '')
    setValue1("village", data?.getVendorAllKycRecordByVendor?.record?.outletVillage || '')
    setValue1("address", data?.getVendorAllKycRecordByVendor?.record?.outletAddress || '')
    setValue1("contactPersonName", data?.getVendorAllKycRecordByVendor?.record?.outletContactPersonName || '')
    setValue1("contactPersonNumber", data?.getVendorAllKycRecordByVendor?.record?.outletAddress || '')
    setValue1("contactPersonDesignation", data?.getVendorAllKycRecordByVendor?.record?.outletContactPersonDesignation || '')
    setValue("companyName", data?.getVendorAllKycRecordByVendor?.record?.companyName)
    setValue("companyType", data?.getVendorAllKycRecordByVendor?.record?.companyType)
    setValue("crNumber", data?.getVendorAllKycRecordByVendor?.record?.companyCrNumber)

  }, [data, refetch]);
  // console.log(outletstatus);
  const handleFileChangeCompany = (index: number, file: File | null) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles[index] = file;
      return newFiles;
    });
  };
  const onSubmit = async (values: any) => {
    console.log("click");
    console.log(values);
    console.log(files);
    console.log(files.length);

    const id = localStorage.getItem("vendorid");

    console.log("files", files);
    let index = 0
    let fileMap: any = {

    }

    for (const [key, value] of Object.entries(files)) {
      const i = parseInt(key);
      if (files[i]) {
        switch (i) {
          case 0: fileMap["crLicense"] = index
            index++
            break

          case 1: fileMap["cooCertificate"] = index
            index++
            break
        }
      }
    }


    if (companydetail == "PENDING") {
      try {
        console.log(id);
        const isFilesEmpty = files.every((file) => !file);


        const response = await CreateVendor({
          variables: {
            input: { ...values },
            images: isFilesEmpty ? [] : files.filter((e) => typeof e !== 'string'),
            fileMap,
          },
        });
        console.log(response);
        if (response) {
          const msg = response?.data?.addVendorCompany?.message;
          toast.success("Company Data Added Successfully ");
          reset();
          refetch()

          setcompanyDetail(
            data?.getVendorAllKycRecordByVendor?.record?.companyStatus
          );
          setCompany(false);
        }
      } catch (e: any) {
        toast.error(e.message);
        console.error("Error:", e.message);
      }
    }
    if (companydetail == "REJECTED") {
      try {
        const isFilesEmpty = files.every((file) => !file);
        console.log("files", files);


        const response = await UpdateVendor({
          variables: {
            input: { ...values },
            images: isFilesEmpty ? [] : files.filter((e) => typeof e !== 'string'),
            fileMap,
          },
        });
        console.log(response);
        if (response) {
          // const data1 = response?.data?.updateVendorCompany?.record;
          const msg = response?.data?.updateVendorCompany?.message;
          console.log("msg", msg);

          // setcompanyDetail(data1);
          toast.success("Company Data Updated Successfully ");
          reset();
          // console.log(response?.data?.updateVendorCompany?.record);
          refetch()
          // const { loading, error, data } = useQuery(VENDOR_DETAILS, {
          //   variables: { input: { _id: id } },
          // });
          setcompanyDetail(
            data?.getVendorAllKycRecordByVendor?.record?.companyStatus
          );
          setCompany(false);
        }
      } catch (e: any) {
        toast.error(e.message);
        console.error("Error:", e.message);
      }
    }


  };
  // console.log(companydetail);
  const handleFileChange = (index: number, file: File | null) => {
    setOfiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles[index] = file;
      return newFiles;
    });
  };


  const onSubmitOutlet = async (values: any) => {
    console.log("click", ofiles);
    const id = localStorage.getItem("vendorid");
    console.log(values);

    console.log("ofiles", ofiles);
    let index = 0
    let fileMap: any = {

    }

    for (const [key, value] of Object.entries(ofiles)) {
      const i = parseInt(key);
      if (ofiles[i]) {
        switch (i) {
          case 0: fileMap["outletLicense"] = index
            index++
            break

          case 1: fileMap["interiorImage"] = index
            index++
            break
          case 2: fileMap["exteriorImage"] = index
            index++
            break
        }
      }
    }

    // const fileMap = {
    //   interiorImage: 0,
    //   outletLicense: 1,
    //   exteriorImage: 2,
    // };

    if (outletstatus == 'PENDING') {
      try {
        const isFilesEmpty = ofiles.every((file) => !file);
        console.log(isFilesEmpty);

        const response = await addOutlet({
          variables: {
            input: { ...values },
            images: isFilesEmpty ? [] : ofiles.filter((e) => typeof e !== 'string'),
            fileMap,
          },
        });
        console.log(response);
        if (response) {
          toast.success(response?.data?.addVendorOutlet?.message);
          // toast.success(response?.data?.updateVendorOutlet?.message);
          reset1();
          setOutletform(false)
          refetch()
        }
      } catch (e: any) {
        toast.error(e.message);
        console.error("Error:", e.message);
      }
    }
    if (outletstatus == 'REJECTED') {
      try {
        const isFilesEmpty = ofiles.every((file) => !file);

        const response = await UpdateVendorOutlet({
          variables: {
            input: { ...values },
            images: isFilesEmpty ? [] : ofiles.filter((e) => typeof e !== 'string'),
            fileMap,
          },
        });
        console.log(response);
        if (response) {
          toast.success(response?.data?.updateVendorOutlet?.message);
          // toast.success(response?.data?.updateVendorOutlet?.message);
          reset1();
          setOutletform(false)
          refetch()
        }
      } catch (e: any) {
        toast.error(e.message);
        console.error("Error:", e.message);
      }
    }


  };


  const items = [
    { text: "Dashboard", link: `/` },
  ];

  const getSignedUrlMutation = useFetchSignedUrl();

  const handleImageClick = async (fileURL: string, mimeType: string) => {
    try {
      const signedUrl = await fetchSignedUrl(getSignedUrlMutation, fileURL, mimeType);
      if (signedUrl) {
        window.open(signedUrl)
      } else {
        console.error('Failed to get signed URL.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <>
      <ToastContainer />
      <div className="page-content">
        <Container fluid={true} >
          <Breadcrumb items={items} currentPage="Kyc Details" />
          <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            <span style={{ marginRight: "20px", fontWeight: "500" }}>KYC Status :</span>
            <StatusIndicator status={data?.getVendorAllKycRecordByVendor?.record?.isKycCompleted == true ? "COMPLETED" : "PENDING"} variant="chip" />
          </div>
          <Row style={{ height: "100% !important" }}>
            <Col xs={6} style={{}}>
              <Card style={{ padding: "20px", borderRadius: "0px", height: "100% !important" }} className="h-100">
                {companydetail == "PENDING" || company ? (
                  <Row>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                      <Col lg={12}>
                        <h4 className="mb-3">Company Details</h4>
                        <div
                          style={{
                            display: "flex",
                            gap: "30px",
                            marginBottom: "20px",
                          }}
                        >
                          <div style={{ width: "50%" }}>
                            <Label style={{ color: "black" }}>Company Name</Label>
                            <Controller
                              control={control}
                              name="companyName"
                              render={({ field: { onChange, value } }) => (
                                <Input
                                  className={styles.inputfield}
                                  type="text"
                                  value={value}
                                  onChange={onChange}
                                  required
                                />
                              )}
                            />
                          </div>
                          <div style={{ width: "50%" }}>
                            <Label style={{ color: "black" }}>Company Type</Label>
                            <Controller
                              control={control}
                              name="companyType"
                              render={({ field: { onChange, value } }) => (
                                <Input
                                  type="text"
                                  className={styles.inputfield}
                                  name="companyType"
                                  value={value}
                                  onChange={onChange}
                                  required
                                />
                              )}
                            />
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "30px",
                            marginBottom: "20px",
                          }}
                        >
                          <div style={{ width: "50%" }}>
                            <Label style={{ color: "black" }}>Cr Number</Label>
                            <Controller
                              control={control}
                              name="crNumber"
                              render={({ field: { onChange, value } }) => (
                                <Input
                                  type="text"
                                  className={styles.inputfield}
                                  onChange={onChange}
                                  value={value}
                                  required
                                />
                              )}
                            />
                          </div>
                          <div style={{ width: "50%" }}>
                            <Label style={{ color: "black" }}>Cr License</Label>
                            <Input
                              name="crLicense"
                              type="file"
                              className={styles.inputfield}
                              onChange={(event: any) => handleFileChangeCompany(0, event?.target.files?.[0])}

                            />
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "30px",
                            marginBottom: "20px",
                          }}
                        >
                          <div style={{ width: "49%" }}>
                            <Label style={{ color: "black" }}>
                              Coo Certificate
                            </Label>
                            <Input
                              name="cooCertificate"
                              type="file"
                              className={styles.inputfield}
                              onChange={(event: any) => handleFileChangeCompany(1, event?.target.files?.[0])}

                            />
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "15px" }}>
                          <button
                            style={{
                              background: "black",
                              color: "white",
                              padding: "10px",
                              border: "none",
                              width: "176px",
                              height: "52px",
                            }}
                            type="submit"
                          >
                            Submit
                          </button>
                          {companydetail !== "PENDING" && <button
                            style={{
                              background: "#E30613",
                              color: "white",
                              padding: "10px",
                              border: "none",
                              width: "176px",
                              height: "52px",
                            }}
                            onClick={() => { setCompany(false) }}
                          >
                            Cancel
                          </button>}
                        </div>
                      </Col>
                    </Form>
                  </Row>
                ) : (
                  <Row>
                    <div className={styles.edit}>
                      {" "}
                      {companydetail == "REJECTED" ? (
                        <div
                          className={styles.circle}
                          onClick={() => setCompany(!company)}
                          style={{ cursor: 'pointer' }}
                        >
                          <MdEdit size={25} />
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <h4 className="mb-3">Company Details</h4>

                    <div className="mb-3 d-flex align-items-center">
                      <div className={styles.labeldiv}> Status </div>
                      <StatusIndicator status={companydetail == "UNDER_VERIFICATION" ? "UNDER_VERIFICATION" : companydetail} variant="chip" />

                    </div>
                    <div className="mb-3 d-flex">
                      <div className={styles.labeldiv}> Company Name </div>
                      {data?.getVendorAllKycRecordByVendor?.record?.companyName ? <span>
                        {data?.getVendorAllKycRecordByVendor?.record?.companyName}
                      </span> : ""}
                    </div>
                    <div className="mb-3 d-flex">
                      <div className={styles.labeldiv}> Company Type </div>
                      {data?.getVendorAllKycRecordByVendor?.record?.companyType ? <span>
                        {data?.getVendorAllKycRecordByVendor?.record?.companyType}
                      </span> : ""}
                    </div>
                    <div className="mb-3 d-flex">
                      <div className={styles.labeldiv}> Cr Number </div>
                      {data?.getVendorAllKycRecordByVendor?.record
                        ?.companyCrNumber ? <span>
                        {
                          data?.getVendorAllKycRecordByVendor?.record
                            ?.companyCrNumber
                        }
                      </span> : ""}
                    </div>
                    <div className="mb-3 d-flex">
                      <div className={styles.labeldiv}> Attachments </div>
                      <div style={{ cursor: "pointer" }}>
                        {data?.getVendorAllKycRecordByVendor?.record?.companyCrLicense?.fileURL ?
                          <p onClick={() => handleImageClick(data?.getVendorAllKycRecordByVendor?.record?.companyCrLicense?.fileURL || "", data?.getVendorAllKycRecordByVendor?.record?.companyCrLicense?.mimeType || "")}>
                            <div className="mb-2">
                              <FaFilePdf style={{ fontSize: "25px", marginRight: "15px", color: "red" }} />Cr License</div>
                          </p> : ""}

                        {data?.getVendorAllKycRecordByVendor?.record?.companyCooCertificate?.fileURL ?
                          <p onClick={() => handleImageClick(data?.getVendorAllKycRecordByVendor?.record?.companyCooCertificate?.fileURL || "", data?.getVendorAllKycRecordByVendor?.record?.companyCooCertificate?.mimeType || "")}>
                            <div className="mb-2">
                              <FaFilePdf style={{ fontSize: "25px", marginRight: "15px", color: "red" }} />Coo Certificate
                            </div>
                          </p> : ""}
                      </div>

                    </div>
                  </Row>
                )}
              </Card>
            </Col>
            <Col xs={6}>
              <Card style={{ padding: "20px", borderRadius: "0px", height: "100% !important" }} className="h-100">
                {outletstatus == 'PENDING' || outletform ? (<Row>
                  <Form onSubmit={handleSubmit1(onSubmitOutlet)}>
                    <Col lg={12}>
                      <h4 className="mb-3">Outlet detail</h4>
                      <div
                        style={{
                          display: "flex",
                          gap: "30px",
                          marginBottom: "20px",
                        }}
                      >
                        <div style={{ width: "50%" }}>
                          <Label style={{ color: "black" }}>Outlet Name</Label>
                          <Controller
                            control={control1}
                            name="outletName"
                            render={({ field: { onChange, value } }) => (
                              <Input
                                type="text"
                                value={value}
                                className={styles.inputfield}
                                onChange={onChange}
                                required
                              />
                            )}
                          />
                        </div>
                        <div style={{ width: "50%" }}>
                          <Label style={{ color: "black" }}>Village</Label>
                          <Controller
                            control={control1}
                            name="village"
                            render={({ field: { onChange, value } }) => (
                              <Input
                                type="text"
                                value={value}
                                className={styles.inputfield}
                                onChange={onChange}
                                required
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "30px",
                          marginBottom: "20px",
                        }}
                      >
                        <div style={{ width: "50%" }}>
                          <Label style={{ color: "black" }}>District</Label>
                          <Controller
                            control={control1}
                            name="district"
                            render={({ field: { onChange, value } }) => (
                              <Input
                                type="text"
                                className={styles.inputfield}
                                onChange={onChange}
                                value={value}
                                required
                              />
                            )}
                          />
                        </div>
                        <div style={{ width: "50%" }}>
                          <Label style={{ color: "black" }}>Country</Label>
                          <Controller
                            control={control1}
                            name="country"
                            render={({ field: { onChange, value } }) => (
                              <Input
                                className={styles.inputfield}
                                type="text"
                                value={value}
                                onChange={onChange}
                                required
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "30px",
                          marginBottom: "20px",
                        }}
                      >
                        <div style={{ width: "50%" }}>
                          <Label style={{ color: "black" }}>
                            Contact Person Name
                          </Label>

                          <Controller
                            control={control1}
                            name="contactPersonName"
                            render={({ field: { onChange, value } }) => (
                              <Input
                                type="text"
                                className={styles.inputfield}
                                value={value}
                                onChange={onChange}
                                required
                              />
                            )}
                          />
                        </div>
                        <div style={{ width: "50%" }}>
                          <Label style={{ color: "black" }}>
                            Contact Person Number
                          </Label>
                          <Controller
                            control={control1}
                            name="contactPersonNumber"
                            render={({ field: { onChange, value } }) => (
                              <Input
                                type="text"
                                className={styles.inputfield}
                                name="contactPersonNumber"
                                value={value}
                                onChange={onChange}
                                required
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "30px",
                          marginBottom: "20px",
                        }}
                      >
                        <div style={{ width: "50%" }}>
                          <Label style={{ color: "black" }}>
                            Contact Person Designation
                          </Label>
                          <Controller
                            control={control1}
                            name="contactPersonDesignation"
                            render={({ field: { onChange, value } }) => (
                              <Input
                                type="text"
                                className={styles.inputfield}
                                name="contactPersonDesignation"
                                value={value}
                                onChange={onChange}
                                required
                              />
                            )}
                          />
                        </div>
                        <div style={{ width: "50%" }}>
                          <Label style={{ color: "black" }}>Address</Label>
                          <Controller
                            control={control1}
                            name="address"
                            render={({ field: { onChange, value } }) => (
                              <Input
                                type="text"
                                className={styles.inputfield}
                                name="address"
                                value={value}
                                onChange={onChange}
                                required
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "30px",
                          marginBottom: "20px",
                        }}
                      >
                        <div style={{ width: "50%" }}>
                          <Label style={{ color: "black" }}>
                            {" "}
                            Outlet Licence
                          </Label>

                          <Input
                            name="outletLicense"
                            className={styles.inputfield}
                            type="file"
                            onChange={(event: any) => handleFileChange(0, event?.target.files?.[0])}
                          // required
                          />
                        </div>
                        <div style={{ width: "50%" }}>
                          <Label style={{ color: "black" }}>Interior Image</Label>
                          <Input
                            name="interiorImage"
                            type="file"
                            className={styles.inputfield}
                            onChange={(event: any) => handleFileChange(1, event?.target.files?.[0])}
                          // required
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "30px",
                          marginBottom: "20px",
                        }}
                      >
                        <div style={{ width: "50%" }}>
                          <Label style={{ color: "black" }}>Exterior Image</Label>
                          <Input
                            name="exteriorImage"
                            className={styles.inputfield}
                            type="file"
                            onChange={(event: any) => handleFileChange(2, event?.target.files?.[0])}
                          // required
                          />
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "15px" }}>
                        <button
                          type="submit"
                          style={{
                            background: "black",
                            color: "white",
                            padding: "10px",
                            border: "none",
                            width: "176px",
                            height: "52px",
                          }}
                        >
                          Submit
                        </button>
                        {outletstatus !== "PENDING" && <button
                          style={{
                            background: "#E30613",
                            color: "white",
                            padding: "10px",
                            border: "none",
                            width: "176px",
                            height: "52px",
                          }}
                          onClick={() => { setOutletform(false) }}
                        >
                          Cancel
                        </button>}
                      </div>
                    </Col>
                  </Form>
                </Row>) :

                  <Row>
                    <div className={styles.edit}>
                      {" "}
                      {outletstatus == "REJECTED" ? (
                        <div
                          className={styles.circle}
                          onClick={() => setOutletform(!outletform)}
                          style={{ cursor: 'pointer' }}
                        >
                          <MdEdit size={25} />
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <h4 className="mb-3">Outlet Details</h4>
                    <div className="mb-3 d-flex align-items-center">
                      <div className={styles.labeldiv}> Status </div>

                      <StatusIndicator status={outletstatus == "UNDER_VERIFICATION" ? "UNDER_VERIFICATION" : outletstatus} variant="chip" />
                      {/* <span
                        className={styles.status}
                        style={
                          outletstatus == 'COMPLETED'
                            ? styless.green
                            : outletstatus == 'REJECTED'
                              ? styless.red
                              : outletstatus == 'UNDER_VERIFICATION' ? styless.blue : styless.orange
                        }
                      >
                        {outletstatus == "UNDER_VERIFICATION" ? "UNDER VERIFICATION" : outletstatus}
                      </span>      */}
                    </div>
                    {data?.getVendorAllKycRecordByVendor?.record?.outletName ? <div className="mb-3 d-flex">
                      <div className={styles.labeldiv}> Outlet Name </div>
                      <span>
                        {data?.getVendorAllKycRecordByVendor?.record?.outletName}
                      </span>
                    </div> : ""}
                    {data?.getVendorAllKycRecordByVendor?.record?.outletVillage ? <div className="mb-3 d-flex">
                      <div className={styles.labeldiv}> Village </div>
                      <span>
                        {data?.getVendorAllKycRecordByVendor?.record?.outletVillage}
                      </span>
                    </div> : ""}
                    {data?.getVendorAllKycRecordByVendor?.record
                      ?.outletDistrict ? <div className="mb-3 d-flex">
                      <div className={styles.labeldiv}> District </div>
                      <span>
                        {
                          data?.getVendorAllKycRecordByVendor?.record
                            ?.outletDistrict
                        }
                      </span>
                    </div> : ""}
                    {data?.getVendorAllKycRecordByVendor?.record
                      ?.outletCountry ? <div className="mb-3 d-flex">
                      <div className={styles.labeldiv}> Country </div>
                      <span>
                        {
                          data?.getVendorAllKycRecordByVendor?.record
                            ?.outletCountry
                        }
                      </span>
                    </div> : ""}
                    {data?.getVendorAllKycRecordByVendor?.record
                      ?.outletContactPersonName ? <div className="mb-3 d-flex">
                      <div className={styles.labeldiv}> Contact Person Name </div>
                      <span>
                        {
                          data?.getVendorAllKycRecordByVendor?.record
                            ?.outletContactPersonName
                        }
                      </span>
                    </div> : ""}
                    {data?.getVendorAllKycRecordByVendor?.record
                      ?.outletContactPersonNumber ? <div className="mb-3 d-flex">
                      <div className={styles.labeldiv}> Contact Person Number </div>
                      <span>
                        {
                          data?.getVendorAllKycRecordByVendor?.record
                            ?.outletContactPersonNumber
                        }
                      </span>
                    </div> : ""}
                    {data?.getVendorAllKycRecordByVendor?.record
                      ?.outletContactPersonDesignation ? <div className="mb-3 d-flex">
                      <div className={styles.labeldiv}> Contact Person Designation </div>
                      <span>
                        {
                          data?.getVendorAllKycRecordByVendor?.record
                            ?.outletContactPersonDesignation
                        }
                      </span>
                    </div> : ""}
                    {data?.getVendorAllKycRecordByVendor?.record
                      ?.outletAddress ? <div className="mb-3 d-flex">
                      <div className={styles.labeldiv}> Address </div>
                      <span>
                        {
                          data?.getVendorAllKycRecordByVendor?.record
                            ?.outletAddress
                        }
                      </span>
                    </div> : ""}
                    <div className="mb-3 d-flex">
                      <div className={styles.labeldiv}> Attachments </div>
                      <div style={{ cursor: "pointer" }}>
                        {data?.getVendorAllKycRecordByVendor?.record?.outletLicense?.fileURL ?
                          <p onClick={() => handleImageClick(data?.getVendorAllKycRecordByVendor?.record?.outletLicense?.fileURL || "", data?.getVendorAllKycRecordByVendor?.record?.outletLicense?.mimeType || "")}
                          >
                            <div className="mb-2"><FaFilePdf style={{ fontSize: "25px", marginRight: "15px", color: "red" }} />Outlet Licence</div>
                          </p> : ""}

                        {data?.getVendorAllKycRecordByVendor?.record?.outletInteriorImage?.fileURL ? <p onClick={() => handleImageClick(data?.getVendorAllKycRecordByVendor?.record?.outletInteriorImage?.fileURL || "", data?.getVendorAllKycRecordByVendor?.record?.outletInteriorImage?.mimeType || "")} > <div className="mb-2"><FaFilePdf style={{ fontSize: "25px", marginRight: "15px", color: "red" }} />Interior Image</div></p> : ""}
                        {data?.getVendorAllKycRecordByVendor?.record?.outletExteriorImage?.fileURL ? <p onClick={() => handleImageClick(data?.getVendorAllKycRecordByVendor?.record?.outletExteriorImage?.fileURL || "", data?.getVendorAllKycRecordByVendor?.record?.outletExteriorImage?.mimeType || "")} > <div className="mb-2"><FaFilePdf style={{ fontSize: "25px", marginRight: "15px", color: "red" }} />Exterior Image</div></p> : ""}
                      </div>

                    </div>
                  </Row>
                }
              </Card>
            </Col>
          </Row>

          {/* outlet */}

        </Container>
      </div>
    </>
  );
};

export default CategoryList;
