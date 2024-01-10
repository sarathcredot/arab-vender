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
const ADD_VENTOR_COMPANY = gql`
  mutation UpdateVendorCompany(
    $input: UpdateVendorCompanyInput!
    $images: [Upload]
    $fileMap: JSONObject
  ) {
    updateVendorCompany(input: $input, images: $images, fileMap: $fileMap) {
      record {
        _id
        vendorId
        companyName
        companyType
        crNumber
        status
        crLicense {
          fileURL
        }
        cooCertificate {
          fileURL
        }
        remarks
      }
      message
    }
  }
`;
const ADD_VENTOR_OUTLET = gql`
  mutation Mutation(
    $input: UpdateVendorOutletInput!
    $images: [Upload]
    $fileMap: JSONObject
  ) {
    updateVendorOutlet(input: $input, images: $images, fileMap: $fileMap) {
      _id
      message
    }
  }
`;
// const VENDOR_DETAILS=gql`query GetVendorAllKycRecordByVendor($input: VendorAllKycRecordByVendorInput!) {
//   getVendorAllKycRecordByVendor(input: $input) {
//     record {
//       _id
//       fullName
//       email
//       mobileNumber
//       isBlocked
//       isKycCompleted
//       outletId
//       outletName
//       outletStatus
//       companyId
//       companyName
//       companyStatus
//     }
//   }
// }`
const VENDOR_DETAILS = gql`
  query Query($input: VendorAllKycRecordByVendorInput!) {
    getVendorAllKycRecordByVendor(input: $input) {
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
        }
        outletInteriorImage {
          fileType
          fileURL
          originalName
        }
        outletExteriorImage {
          fileType
          fileURL
          originalName
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
        }
        companyCooCertificate {
          fileURL
          fileType
          originalName
        }
        companyRemarks
      }
    }
  }
`;
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
    orange:{
      color:"orange"
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
  console.log(currentKycStatus);
  // },[kycStatus])

  const [CreateVendor] = useMutation(ADD_VENTOR_COMPANY);
  const [addOutlet] = useMutation(ADD_VENTOR_OUTLET);
  const [files, setFiles] = useState<any[]>(["", ""]);
  const [ofiles, setOfiles] = useState<any[]>(["", ""]);
  const [isEdit, setIsedit] = useState(false);
  const [company, setCompany] = useState(false);
  const [companydetail, setcompanyDetail] = useState<any>(null);
  const id = localStorage.getItem("vendorid");
  const { loading, error, data } = useQuery(VENDOR_DETAILS, {
    variables: { input: { _id: id } },
  });
  console.log(data);
  console.log(data?.getVendorRecordByVendor);

  useEffect(() => {
    setcompanyDetail(
      data?.getVendorAllKycRecordByVendor?.record?.companyStatus
    );
  }, [data]);
  const onSubmit = async (values: any) => {
    console.log("click");
    console.log(values);
    console.log(files);
    console.log(files.length);

    const id = localStorage.getItem("vendorid");
    const fileMap = {
      crLicence: 0,
      cooCertificate: 1,
    };
    try {
      console.log(id);
      const isFilesEmpty = files.every((file) => file === "");

      const response = await CreateVendor({
        variables: {
          input: { ...values, vendorId: id },
          images: isFilesEmpty ? [] : files,
          fileMap,
        },
      });
      console.log(response);
      if (response) {
        const data1 = response?.data?.updateVendorCompany?.record;
        // setcompanyDetail(data1);
        toast.success("Company Data Updated Successfully ");
        reset();
        console.log(response?.data?.updateVendorCompany?.record);
        const { loading, error, data } = useQuery(VENDOR_DETAILS, {
          variables: { input: { _id: id } },
        });
        setcompanyDetail(
          data?.getVendorAllKycRecordByVendor?.record?.companyStatus
        );
        setCompany(true);
      }
    } catch (e: any) {
      console.log("fdd");

      console.error("Error:", e.message);
    }
  };
  console.log(companydetail);

  const onSubmitOutlet = async (values: any) => {
    console.log("click");
    const id = localStorage.getItem("vendorid");
    const fileMap = {
      interiorImage: 0,
      outletLicense: 1,
      exteriorImage: 2,
    };
    try {
      const isFilesEmpty = files.every((file) => file === "");

      const response = await addOutlet({
        variables: {
          input: { ...values, vendorId: id },
          images: isFilesEmpty ? [] : files,
          fileMap,
        },
      });
      console.log(response);
      if (response) {
        toast.success(response?.data?.updateVendorOutlet?.message);
        reset1();
      }
    } catch (e: any) {
      console.log("fdd");

      console.error("Error:", e.message);
    }
  };
  return (
    <>
      <div className="page-content">
        <Container fluid={true} style={{ marginTop: "40px" }}>
          <Breadcrumb title="Dashboard" breadcrumbItem="Kyc" link="/" />
          <ToastContainer />
          <Card style={{ padding: "20px" }}>
            {companydetail == "PENDING" || company ? (
              <Row>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Col lg={12}>
                    <h4 className="mb-3">Company detail</h4>
                    <div
                      style={{
                        display: "flex",
                        gap: "30px",
                        marginBottom: "20px",
                      }}
                    >
                      <div style={{ width: "50%" }}>
                        <Label style={{ color: "#737373" }}>Company Name</Label>
                        <Controller
                          control={control}
                          name="companyName"
                          render={({ field: { onChange, value } }) => (
                            <Input
                              className={styles.inputfield}
                              type="text"
                              value={value}
                              onChange={onChange}
                            />
                          )}
                        />
                      </div>
                      <div style={{ width: "50%" }}>
                        <Label style={{ color: "#737373" }}>Company Type</Label>
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
                        <Label style={{ color: "#737373" }}>Cr Number</Label>
                        <Controller
                          control={control}
                          name="crNumber"
                          render={({ field: { onChange, value } }) => (
                            <Input
                              type="text"
                              className={styles.inputfield}
                              onChange={onChange}
                              value={value}
                            />
                          )}
                        />
                      </div>
                      <div style={{ width: "50%" }}>
                        <Label style={{ color: "#737373" }}>Cr Licence</Label>
                        <Input
                          name="crLicence"
                          type="file"
                          className={styles.inputfield}
                          onChange={(event) => {
                            setFiles((e) => {
                              const e1 = (e[0] = event?.target.files?.[0]);
                              const e2 = e[1];

                              return [e1, e2];
                            });
                          }}
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
                        <Label style={{ color: "#737373" }}>
                          Coo Certificate
                        </Label>
                        <Input
                          name="cooCertificate"
                          type="file"
                          className={styles.inputfield}
                          onChange={(event) => {
                            setFiles((e) => {
                              const e1 = e[0];
                              const e2 = (e[1] = event?.target.files?.[0]);
                              return [e1, e2];
                            });
                          }}
                        />
                      </div>
                    </div>
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
                  </Col>
                </Form>
              </Row>
            ) : (
              <Row>
                <div className={styles.edit}>
                  {" "}
                  {companydetail !== "UNDER_VERIFICATION" ? (
                    <div
                      className={styles.circle}
                      onClick={() => setCompany(!company)}
                    >
                      <MdEdit />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <h4 className="mb-3">Company detail</h4>
                <div className="mb-3 d-flex align-center">
                <div className={styles.labeldiv}> status </div> 
                <span
  className={styles.status}
  style={
    companydetail === 'COMPLETE'
      ? styless.green
      : companydetail === 'REJECT'
      ? styless.red
    :styless.orange
  }
>
  {companydetail}
</span>                </div>
                <div className="mb-3 d-flex">
                  <div className={styles.labeldiv}> Company Name </div>
                  <span>
                    {data?.getVendorAllKycRecordByVendor?.record?.companyName}
                  </span>
                </div>
                <div className="mb-3 d-flex">
                  <div className={styles.labeldiv}> Company Type </div>
                  <span>
                    {data?.getVendorAllKycRecordByVendor?.record?.companyType}
                  </span>
                </div>
                <div className="mb-3 d-flex">
                  <div className={styles.labeldiv}> Cr Number </div>
                  <span>
                    {
                      data?.getVendorAllKycRecordByVendor?.record
                        ?.companyCrNumber
                    }
                  </span>
                </div>
              </Row>
            )}
          </Card>
          {/* outlet */}
          <Card style={{ padding: "20px" }}>
            <Row>
              <Form onSubmit={handleSubmit1(onSubmitOutlet)}>
                <Col lg={12}>
                  <h4 className="mb-3 mt-4">Outlet detail</h4>
                  <div
                    style={{
                      display: "flex",
                      gap: "30px",
                      marginBottom: "20px",
                    }}
                  >
                    <div style={{ width: "50%" }}>
                      <Label style={{ color: "#737373" }}>Outlet Name</Label>
                      <Controller
                        control={control1}
                        name="outletName"
                        render={({ field: { onChange, value } }) => (
                          <Input
                            type="text"
                            value={value}
                            className={styles.inputfield}
                            onChange={onChange}
                          />
                        )}
                      />
                    </div>
                    <div style={{ width: "50%" }}>
                      <Label style={{ color: "#737373" }}>Village</Label>
                      <Controller
                        control={control1}
                        name="village"
                        render={({ field: { onChange, value } }) => (
                          <Input
                            type="text"
                            value={value}
                            className={styles.inputfield}
                            onChange={onChange}
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
                      <Label style={{ color: "#737373" }}>District</Label>
                      <Controller
                        control={control1}
                        name="district"
                        render={({ field: { onChange, value } }) => (
                          <Input
                            type="text"
                            className={styles.inputfield}
                            onChange={onChange}
                            value={value}
                          />
                        )}
                      />
                    </div>
                    <div style={{ width: "50%" }}>
                      <Label style={{ color: "#737373" }}>Country</Label>
                      <Controller
                        control={control1}
                        name="country"
                        render={({ field: { onChange, value } }) => (
                          <Input
                            className={styles.inputfield}
                            type="text"
                            value={value}
                            onChange={onChange}
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
                      <Label style={{ color: "#737373" }}>
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
                          />
                        )}
                      />
                    </div>
                    <div style={{ width: "50%" }}>
                      <Label style={{ color: "#737373" }}>
                        Contact Person Number
                      </Label>
                      <Controller
                        control={control1}
                        name="contactPersonName"
                        render={({ field: { onChange, value } }) => (
                          <Input
                            type="text"
                            className={styles.inputfield}
                            name="contactPersonNumber"
                            value={value}
                            onChange={onChange}
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
                      <Label style={{ color: "#737373" }}>
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
                          />
                        )}
                      />
                    </div>
                    <div style={{ width: "50%" }}>
                      <Label style={{ color: "#737373" }}>Address</Label>
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
                      <Label style={{ color: "#737373" }}>
                        {" "}
                        Outlet Licence
                      </Label>

                      <Input
                        name="outletLicense"
                        className={styles.inputfield}
                        type="file"
                        onChange={(event) => {
                          setOfiles((e) => {
                            const e1 = (e[0] = event?.target.files?.[0]);
                            const e2 = e[1];
                            const e3 = e[2];
                            return [e1, e2, e3];
                          });
                        }}
                      />
                    </div>
                    <div style={{ width: "50%" }}>
                      <Label style={{ color: "#737373" }}>Interior Image</Label>
                      <Input
                        name="interiorImage"
                        type="file"
                        className={styles.inputfield}
                        onChange={(event) => {
                          setOfiles((e) => {
                            const e1 = e[0];
                            const e2 = (e[1] = event?.target.files?.[0]);
                            const e3 = e[2];
                            return [e1, e2, e3];
                          });
                        }}
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
                      <Label style={{ color: "#737373" }}>Exterior Image</Label>
                      <Input
                        name="exteriorImage"
                        className={styles.inputfield}
                        type="file"
                        onChange={(event) => {
                          setOfiles((e) => {
                            const e1 = e[0];
                            const e2 = e[1];
                            const e3 = e[2] == event?.target.files?.[0];
                            return [e1, e2, e3];
                          });
                        }}
                      />
                    </div>
                  </div>
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
                </Col>
              </Form>
            </Row>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default CategoryList;
