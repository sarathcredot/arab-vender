import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useDropzone, FileWithPath } from "react-dropzone";
import { gql, useQuery, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import styles from "../Kyc/kyc.module.css";
import {
  Row,
  Col,
  Card,
  CardBody,
  Container,
  CardHeader,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Table,
  ButtonToggle,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import Catatributes from "./catattribute";
import FileUpload from "react-drag-n-drop-image";
import { Icon } from "@ailibs/feather-react-ts";
import Catattributes from "./catattribute";
import { RiHealthBookFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Common/Breadcrumb";

interface ProductInfoInput {
  [key: string]: string;
}
interface ProductForm {
  productName: string;
  description: string;
  shortDescription: string;
  price: string;
  mrp: string;
  sellingPrice: string;
  tags: string;
  image: FileWithPath[];
  stock: string;
  isBlocked: boolean;
  // showFirst: boolean;
  rating: string;
  skuId: string;
  size: string;
  color: string;
  // offerPrice: number;
  productCode: number;
  productInfo: string[];
  brandName: string;
  categoryNamePath: string;
  _id: string;
  media: any;
  images: any;
  delivery_type: string;
  returnPolicy: string;
}
interface ProductData {
  _id: string;
  color: string;
  size: string;
  description: string;
  shortDescription: string;
  images: {
    fileURL: string;
  }[];
  mrp: number;
  productCode: string;
  productName: string;
  rating: number;
  sellingPrice: number;
  price: number;
  tags: string;
  stock: string;
  skuId: number;
  categoryNamePath: string;
  isBlocked: boolean;
  brandName: string;
  delivery_type: string;
  returnPolicy: string;
}

interface AddProductProps {
  Edit?: boolean;
  editedProduct?: any | undefined; // Add this line
  // ... other properties
}
const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!, $images: [Upload], $productDetailImages: [Upload]) {
    createProduct(input: $input, images: $images, productDetailImages: $productDetailImages) {
      product {
        _id
      }
      message
    }
  }
`;
const UPDATE_PRODUCT = gql`
  mutation UpdateProduct(
    $input: ProductUpdateInput!
    $images: [Upload]
    $productDetailImages: [Upload]
  ) {
    updateProduct(input: $input, images: $images, productDetailImages: $productDetailImages) {
      _id
      message
    }
  }
`;

const GET_CATEGORY = gql`
  query GetAllCategoriesOfVendor {
    getAllCategoriesOfVendor {
      records {
        categoryName
        _id
        isBlocked
        fullCategoryName
        isLeaf
      }
    }
  }
`;
const GET_BRAND = gql`
  query GetAllBrandRecordsWithVendorByVendor($input: getAllBrandRecordsWithVendorByVendorInput!) {
    getAllBrandRecordsWithVendorByVendor(input: $input) {
      maxRecords
      message
      records {
        _id
        brandName
        isBlocked
        logo {
          fileType
          fileURL
          originalName
        }
        isPopular
        priority
      }
    }
  }
`;

const GET_ALL_POLICIES = gql`
  query GetAllPoliciesBySuperAdmin($input: getAllPoliciesBySuperAdminInput) {
  getAllPoliciesBySuperAdmin(input: $input) {
    success
    data {
      _id
      name
      description
      duration
      isEnable
      returnCharge
      
    }
    maxRecords
  }
}
`;

const GET_POLICY_FOR_PRODUCT = gql`
query GetDefaultReturnPolicyInProduct($input: getDefaultReturnPolicyInProductInput!) {
  getDefaultReturnPolicyInProduct(input: $input) {
    _id
    name
    description
    duration
    isEnable
    returnCharge
    isDeleted
  }
}
`;

const AddProduct: React.FC<AddProductProps> = ({ Edit = false, editedProduct }) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductForm>({
    criteriaMode: "all",
    shouldFocusError: true,
    mode: "onBlur",
  });
  interface IAttribute {
    _id: string;
  }
  const navigate = useNavigate();
  const [createproduct] = useMutation(CREATE_PRODUCT);
  const [updateproduct] = useMutation(UPDATE_PRODUCT);
  const [categoryData, setCategoryData] = useState<any>([]);
  const [brandData, setBrandData] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productInfo, setProductInfo] = useState<string[]>();
  const [remarks, setRemarks] = useState<any>([""]);
  const [attributeid, setattributeid] = useState<IAttribute[] | []>([]);
  const [selectedbrand, setselectedbrand] = useState<any>({});

  const handleAttributesSelectChange = (selectedValues: IAttribute[]) => {
    setattributeid(selectedValues);
  };
  const handleAddRemark = () => {
    setRemarks([...remarks, ""]);
  };

  const handleRemoveRemark = (index: any) => {
    const updatedRemarks = [...remarks];
    updatedRemarks.splice(index, 1); // Remove the remark at the specified index
    setRemarks(updatedRemarks);
  };

  const [changePolicy,setChangePolicy] = useState(false)
  const handleChangePolicy = (e:any)=>{
    setChangePolicy(e.target.checked)
    
  }


  const id = localStorage?.getItem("vendorid");
  const {
    loading: categoryLoading,
    error: categoryError,
    data: categoryDataResponse,
    refetch: categoryRefetch,
  } = useQuery(GET_CATEGORY);

  // get all policies
  const {
    loading: policiesLoading,
    error: policiesError,
    data: policiesDataResponse,
    refetch: policiesRefetch,
  } = useQuery(GET_ALL_POLICIES, {
    fetchPolicy: "network-only",
    variables: {
      input: {},
    },
  });
  
  // get policy for product from brand and category
  const {
    loading: policyLoading,
    error: policyError,
    data: policyDataResponse,
    refetch: policyRefetch,
  } = useQuery(GET_POLICY_FOR_PRODUCT, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        brandId: selectedbrand?.id,
        categoryId: selectedCategory,
      },
    },
  });
  const {
    loading: brandLoading,
    error: brandError,
    data: brandDataResponse,
    refetch: brandRefetch,
  } = useQuery(GET_BRAND, {
    variables: {
      input: {
        page: null,
      },
    },
  });
  useEffect(()=>{
    if(selectedbrand.id&&selectedCategory){
      console.log("REFETCH  = ",selectedbrand.id,selectedCategory)
      policyRefetch() 
    }
  },[selectedbrand.id,selectedCategory])

  useEffect(()=>{
    console.log("POLICY = ",policyDataResponse)
    if(policyDataResponse && !changePolicy){
      setValue("returnPolicy",policyDataResponse?.getDefaultReturnPolicyInProduct?._id)
    }
  },[policyDataResponse,policiesRefetch,changePolicy])

  useEffect(() => {
    if (editedProduct) {
      console.log("editedProduct = ",editedProduct)
      if(editedProduct?.returnPolicyData){
        setChangePolicy(true)
      }
      setValue("productName", editedProduct?.productName || "");
      setValue("description", editedProduct?.description || "");
      setValue("sellingPrice", editedProduct?.sellingPrice);
      setValue("price", editedProduct?.price || "");
      setValue("rating", editedProduct?.rating);
      // setValue("offerPrice", editedProduct?.offerPrice);
      setValue("productCode", editedProduct?.productCode);
      setValue("mrp", editedProduct?.mrp);
      setValue("shortDescription", editedProduct?.shortDescription || "");
      setValue("skuId", editedProduct?.skuId || "");
      setValue("tags", editedProduct?.tags.join(","));
      setValue("brandName", editedProduct?.brandName || "");
      setValue("categoryNamePath", editedProduct?.categoryNamePath || "");
      setValue("delivery_type", editedProduct?.delivery_type || "");
      setValue("media", editedProduct?.images);
      setRemarks(editedProduct ? editedProduct?.productInfo : [""]);
      setValue("images", editedProduct?.images);
      setValue("returnPolicy", editedProduct?.returnPolicyData&&editedProduct?.returnPolicyData?._id || "");

      setselectedbrand({
        name: editedProduct.brandName,
        id: editedProduct.brandId,
      });
      setSelectedCategory(editedProduct?.categoryId)

    }
  }, [editedProduct]);
  useEffect(() => {
    setCategoryData(categoryDataResponse?.getAllCategoriesOfVendor?.records || []);
    setBrandData(brandDataResponse?.getAllBrandRecordsWithVendorByVendor?.records);
  }, [categoryDataResponse, brandDataResponse]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  

  const getSelectedCategoryData = () => {
    if (editedProduct) {
      const selectedCategoryData = editedProduct?.categoryId;
      return selectedCategoryData;
    } else {
      const selectedCategoryData = categoryData.find(
        (category: any) => category._id === selectedCategory
      );
      return selectedCategoryData?._id;
    }
  };

  const fieldRules = {
    productName: {
      required: "Name is required",
    },
    description: {
      required: "Description is required",
    },
    shortDescription: {
      required: "Short Description is required",
    },
    mrp: {
      required: "Mrp is required",
    },
    sellingPrice: {
      required: "SellingPrice is required",
    },
    tags: {
      required: "mrp is required",
    },
    media: {
      required: "media required",
    },
    // offerPrice: {},
    productCode: {
      required: "productCode required",
    },
    productInfo: {
      required: "This field is required.",
    },
    price: {
      required: "This field is required.",
    },
    // stock: {
    //   required: "This field is required.",
    // },
    brand: {
      required: "Brand is required",
    },
    delivery_type: {
      required: "Delivery Type is required",
    },
    rating: {
      required: "Rating is required",
      pattern: {
        value: /^[0-5](\.\d{1,2})?$/, // Adjust the pattern as needed
        message: "Invalid rating. Please enter a valid value less than 5.",
      },
    },
    images: {
      required: "Please select at least one image",
    },
  };

  const onSubmit: SubmitHandler<ProductForm> = async (data: any) => {
    data.attribute = attributeid;

    const formdatas = {
      _id: editedProduct?._id,
      brandId: selectedbrand?.id,
      brandName: selectedbrand?.name,
      categoryId: selectedCategory,
      description: data?.description,
      // offerPrice: parseInt(data?.offerPrice),
      mrp: parseInt(data?.mrp),
      price: parseInt(data?.price),
      productInfo: remarks && remarks?.length > 0 ? remarks : [""],
      productName: data?.productName,
      rating: parseFloat(data?.rating),
      sellingPrice: parseInt(data?.sellingPrice),
      shortDescription: data?.shortDescription,
      skuId: data?.skuId,
      tags: data?.tags,
      attributes: attributeid,
      delivery_type: data?.delivery_type,
      returnPolicy: changePolicy?data?.returnPolicy:null,
    };

    

    const file = data?.images?.map((image: any) => image.file);

    const medias = data?.media?.map((media: any) => media.file);

    try {
      if (Edit) {
        const variables: any = {
          input: { ...formdatas },
          images: null,
          productDetailImages: null,
        };

        if (file?.length > 0) {
          variables.images = file;
        }

        if (medias?.length > 0) {
          variables.productDetailImages = medias;
        }

        const response = await updateproduct({
          variables,
        });
        if (response) {
          toast.success(response?.data?.updateProduct?.message);
          navigate("/product");
        }
      } else {
        const variables: any = {
          input: { ...formdatas, stock: 0 },
          images: null,
          productDetailImages: null,
        };

        if (file?.length > 0) {
          variables.images = file;
        }

        if (medias?.length > 0) {
          variables.productDetailImages = medias;
        }
        const response = await createproduct({
          variables,
        });

        toast.success(response?.data?.createProduct?.message);
        if (editedProduct?.productCode) {
          navigate(`/product/variant?_code=${editedProduct?.productCode}`);
        } else {
          navigate(`/product`);
        }
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const items = [
    { text: "Dashboard", link: `/` },
    { text: "Products", link: `/product` },
  ];

  if (Edit) {
    items.push({ text: "Variants", link: `/product/variant?_code=${editedProduct?.productCode}` });
  }
  

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb items={items} currentPage={Edit ? "Edit Product" : "Add Product"} />

          <Row>
            <Col lg={12}>
              <Card style={{ borderRadius: "0px" }}>
                <CardBody>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormGroup>
                      <Label for="name">Name</Label>
                      <Controller
                        control={control}
                        name="productName"
                        // rules={{ required: "Name is required" }}
                        render={({ field: { value, onChange } }) => (
                          <>
                            <Input
                              type="text"
                              value={value}
                              onChange={onChange}
                              // {...field}
                              className={styles.inputfield}
                            />
                          </>
                        )}
                        rules={fieldRules.productName}
                      />
                      {errors?.productName ? (
                        <div className={styles.errmsg}>{errors?.productName?.message}</div>
                      ) : null}
                    </FormGroup>

                    <FormGroup className="mt-3">
                      <Label for="name">Brand</Label>
                      <Controller
                        control={control}
                        name="brandName"
                        render={({ field: { value, onChange } }) => (
                          <>
                            <Input
                              type="select"
                              style={{ borderRadius: "0px", backgroundColor: "white" }}
                              value={editedProduct?.brandName}
                              disabled={Edit}
                              onChange={(event: any) => {
                                
                                const selectedBrand = brandData.find(
                                  (brand: any) => brand.brandName === event.target.value
                                );

                                // Check if a brand is found before updating the state
                                if (selectedBrand) {
                                  setselectedbrand({
                                    name: selectedBrand.brandName,
                                    id: selectedBrand._id,
                                  });
                                }
                                onChange(event);
                              }}
                            >
                              <option value="">Select</option>
                              {brandData?.map((brand: any, index: number) => {
                                return (
                                  <option key={index} value={brand?.brandName}>
                                    {brand?.brandName}
                                  </option>
                                );
                              })}
                            </Input>
                          </>
                        )}
                        rules={fieldRules.brand}
                      />
                      {errors?.brandName && (
                        <div className={styles.errmsg}>{errors?.brandName?.message}</div>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <label>Category</label>
                      <Dropdown
                        style={{ borderRadius: "0px" }}
                        isOpen={dropdownOpen}
                        toggle={toggleDropdown}
                      >
                        <DropdownToggle
                          style={{ borderRadius: "0px", backgroundColor: "black", border: "none" }}
                          caret
                          disabled={Edit}
                        >
                          {editedProduct && editedProduct?.categoryNamePath}
                          {selectedCategory
                            ? categoryData.find(
                              (category: any) => category._id === getSelectedCategoryData()
                            )?.fullCategoryName
                            : "Select Category"}
                          <FontAwesomeIcon icon={faAngleDown} style={{ marginLeft: "5px" }} />
                        </DropdownToggle>
                        <DropdownMenu>
                          {categoryData?.map((category: any) => (
                            <DropdownItem
                              key={category._id}
                              onClick={() => {
                                setSelectedCategory(category._id)
                              }}
                            >
                              {category.fullCategoryName}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </FormGroup>
                    <FormGroup className="mt-3">
                      <Label for="delivery_type">Delivery Type</Label>
                      <Controller
                        control={control}
                        name="delivery_type"
                        render={({ field: { value, onChange } }) => (
                          <>
                            <Input
                              type="select"
                              style={{ borderRadius: "0px", backgroundColor: "white" }}
                              value={value}
                              // disabled={Edit}
                              onChange={onChange}
                            >
                              <option value="">Select Delivery Type</option>
                              <option value="ArabDeals">ArabDeals</option>
                              <option value="Vendor">Vendor</option>
                              <option value="ThirdParty">ThirdParty</option>
                              
                            </Input>
                          </>
                        )}
                        rules={fieldRules.delivery_type}
                      />
                      {errors?.delivery_type && (
                        <div className={styles.errmsg}>{errors?.delivery_type?.message}</div>
                      )}
                    </FormGroup>

                    <Catattributes
                      selectedCategoryData={getSelectedCategoryData()}
                      onSelectChange={handleAttributesSelectChange}
                      editedProduct={editedProduct}
                    />

                    <FormGroup style={{ marginTop: "20px" }}>
                      <Label for="shortDescription">Product Short Description</Label>
                      <Controller
                        control={control}
                        name="shortDescription"
                        // rules={{
                        //   required: "Short Description is required",
                        // }}
                        render={({ field: { value, onChange } }) => (
                          <>
                            <Input
                              type="text"
                              value={value}
                              onChange={onChange}
                              className={styles.inputfield}
                            />
                          </>
                        )}
                        rules={fieldRules.shortDescription}
                      />
                      {errors?.shortDescription ? (
                        <div className={styles.errmsg}>{errors?.shortDescription?.message}</div>
                      ) : null}
                    </FormGroup>

                    <FormGroup>
                      <Label for="description">Description</Label>
                      <Controller
                        control={control}
                        name="description"
                        // rules={{ required: "Description is required" }}
                        render={({ field: { value, onChange } }) => (
                          <>
                            <Input
                              type="textarea"
                              value={value}
                              onChange={onChange}
                              className={styles.inputfield}
                            // {...field}
                            />
                          </>
                        )}
                        rules={fieldRules.description}
                      />
                      {errors?.description ? (
                        <div className={styles.errmsg}>{errors?.description?.message}</div>
                      ) : null}
                    </FormGroup>

                    <FormGroup>
                      <Label for="productInfo">Product Info</Label>

                      {remarks?.map((remark: any, index: any) => (
                        <FormGroup key={index} style={{ marginBottom: "10px" }}>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <Input
                              type="text"
                              id={`remark-${index}`}
                              name={`remark-${index}`}
                              value={remark}
                              onChange={(e) => {
                                const updatedRemarks = [...remarks];
                                updatedRemarks[index] = e.target.value;
                                setRemarks(updatedRemarks);
                              }}
                              required
                              style={{
                                marginRight: "10px",
                                borderRadius: "0px",
                                backgroundColor: "white",
                              }}
                            />
                            {index === remarks.length - 1 && (
                              <Button
                                color="primary"
                                onClick={handleAddRemark}
                                style={{ borderRadius: "0px" }}
                              >
                                + {/* Plus icon */}
                              </Button>
                            )}{" "}
                            {index !== 0 && (
                              <Button
                                style={{
                                  marginLeft: "5px",
                                  marginRight: "5px",
                                  borderRadius: "0px",
                                }}
                                color="danger"
                                onClick={() => handleRemoveRemark(index)}
                              >
                                - {/* Minus icon */}
                              </Button>
                            )}
                          </div>
                        </FormGroup>
                      ))}
                    </FormGroup>

                    <Row style={{ marginTop: "13px" }}>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="mrp">Mrp</Label>
                          <Controller
                            control={control}
                            name="mrp"
                            render={({ field: { value, onChange } }) => (
                              <>
                                <Input
                                  type="number"
                                  value={value}
                                  onChange={onChange}
                                  className={styles.inputfield}
                                />
                              </>
                            )}
                            rules={fieldRules.mrp}
                          />
                          {errors?.mrp ? (
                            <div className={styles.errmsg}>{errors?.mrp?.message}</div>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="price">Price</Label>
                          <Controller
                            control={control}
                            name="price"
                            // rules={{ required: "Price is required" }}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <Input
                                  type="number"
                                  value={value}
                                  onChange={onChange}
                                  className={styles.inputfield}
                                />
                              </>
                            )}
                            rules={fieldRules.price}
                          />
                          {errors?.price ? (
                            <div className={styles.errmsg}>{errors?.price?.message}</div>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="sellingPrice">Selling Price</Label>
                          <Controller
                            control={control}
                            name="sellingPrice"
                            render={({ field: { value, onChange } }) => (
                              <>
                                <Input
                                  type="number"
                                  value={value}
                                  onChange={onChange}
                                  className={styles.inputfield}
                                />
                              </>
                            )}
                            rules={fieldRules.sellingPrice}
                          />
                          {errors?.sellingPrice ? (
                            <div className={styles.errmsg}>{errors?.sellingPrice?.message}</div>
                          ) : null}
                        </FormGroup>
                      </Col>

                      {/* <Col md={6}>
                        <FormGroup>
                          <Label for="offerPrice">Offer Price</Label>
                          <Controller
                            control={control}
                            name="offerPrice"
                            render={({ field: { value, onChange } }) => (
                              <>
                                <Input
                                  type="number"
                                  className={styles.inputfield}
                                  value={value}
                                  onChange={onChange}
                                />
                              </>
                            )}
                            rules={fieldRules.offerPrice}
                          />
                          {errors?.offerPrice ? (
                            <div className={styles.errmsg}>{errors?.offerPrice?.message}</div>
                          ) : null}
                        </FormGroup>
                      </Col> */}
                      {/* <Col md={6}>
                        <FormGroup>
                          <Label for="stock">Stock</Label>
                          <Controller
                            control={control}
                            name="stock"
                            render={({ field: { value, onChange } }) => (
                              <>
                                <Input
                                  disabled
                                  type="text"
                                  value={value}
                                  onChange={onChange}
                                  className={styles.inputfield}
                                />
                              </>
                            )}
                            rules={fieldRules.stock}
                          />
                          {errors?.stock ? (
                            <div className={styles.errmsg}>{errors?.stock?.message}</div>
                          ) : null}
                        </FormGroup>
                      </Col> */}

                      <Col md={6}>
                        <FormGroup>
                          <Label for="tags">Tags</Label>
                          <Controller
                            control={control}
                            name="tags"
                            rules={{ required: "Tags is required" }}
                            render={({ field }) => (
                              <>
                                <Input
                                  type="text"
                                  placeholder="Separate with commas"
                                  id="tags"
                                  {...field}
                                  className={styles.inputfield}
                                />
                                {errors.tags && (
                                  <p className="text-danger">{errors.tags.message}</p>
                                )}
                              </>
                            )}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row style={{ marginTop: "13px" }}>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="rating">Rating</Label>
                          <Controller
                            control={control}
                            name="rating"
                            render={({ field: { value, onChange } }) => (
                              <>
                                <Input
                                  type="text"
                                  value={value}
                                  min={0}
                                  max={5}
                                  onChange={onChange}
                                  className={styles.inputfield}
                                />
                              </>
                            )}
                            rules={fieldRules.rating}
                          />
                          {errors?.rating ? (
                            <div className={styles.errmsg}>{errors?.rating?.message}</div>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="skuid">SKU ID</Label>
                          <Controller
                            control={control}
                            name="skuId"
                            render={({ field }) => (
                              <>
                                <Input
                                  type="text"
                                  id="skuid"
                                  {...field}
                                  className={styles.inputfield}
                                />
                                {errors.skuId && (
                                  <p className="text-danger">{errors.skuId.message}</p>
                                )}
                              </>
                            )}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row style={{ marginTop: "13px" }}>
                      <Col md={6}>

                        <FormGroup>
                        <div style={{display:"flex",alignItems:"center",gap:10, justifyContent:"space-between",marginBottom:"3px"}}>
                          <Label for="returnPolicy" style={{margin:0}}>Return Policy </Label>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>

                          <Label
                            style={{ fontWeight:"lighter",color:"#737373",margin:0,fontSize:"12px"}}
                            >
                            change policy
                          </Label>
                          <FormGroup
                          switch
                          >
                          <Input
                            className={ changePolicy ? "bg-success border-success" : ""}
                            type="switch"
                            style={{ width: "40px", height: "20px" }}
                            checked={changePolicy}
                            onChange={handleChangePolicy}
                            />
                          
                        </FormGroup>
                            </div>
                        </div>
                          <Controller
                            control={control}
                            name="returnPolicy"
                            render={({ field: { value, onChange } }) => (
                              <>
                                <Input
                                  type="select"
                                  value={value}
                                  onChange={onChange}
                                  className={styles.inputfield}
                                  disabled={!changePolicy}
                                >

                                <option value="">Select</option>
                                {policiesDataResponse && policiesDataResponse?.getAllPoliciesBySuperAdmin?.data?.map((item:any,index:any)=>(
                                  <option key={index} value={item?._id}>{item?.name}</option>
                                ))}
                                </Input>
                              </>
                            )}
                            // rules={fieldRules.rating}
                          />
                            {/* <Button color="primary">Edit</Button> */}
                            
                          {errors?.rating ? (
                            <div className={styles.errmsg}>{errors?.rating?.message}</div>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Card style={{ borderRadius: "0px" }}>
                      <CardHeader>
                        <label>Media</label>
                      </CardHeader>
                      <CardBody>
                        <Controller
                          control={control}
                          name="images"
                          render={({ field }) => (
                            <>
                              <MediaUpload
                                setValue={setValue}
                                watch={watch}
                                control={control}
                                editedProduct={editedProduct}
                                type="images"
                              />
                            </>
                          )}
                          rules={fieldRules.images}
                        />
                        {errors?.images && (
                          <div className={styles.errmsg}>{String(errors?.images?.message)}</div>
                        )}
                      </CardBody>
                    </Card>
                    <Card style={{ borderRadius: "0px" }}>
                      <CardHeader>
                        <label>Product detail Image</label>
                      </CardHeader>
                      <CardBody>
                        <Controller
                          control={control}
                          name="media"
                          render={({ field }) => (
                            <>
                              <MediaUpload
                                setValue={setValue}
                                watch={watch}
                                control={control}
                                editedProduct={editedProduct}
                                type="media"
                              />
                            </>
                          )}
                          rules={fieldRules.images}
                        />
                        {errors?.images && (
                          <div className={styles.errmsg}>{String(errors?.images?.message)}</div>
                        )}
                      </CardBody>
                    </Card>

                    <Button
                      type="submit"
                      style={{
                        backgroundColor: "black",
                        color: "white",
                        width: "120px",
                        height: "40px",
                        borderRadius: "0px",
                        border: "none",
                      }}
                    >
                      {Edit ? "Edit Product" : "Create product"}
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddProduct;

function CustomBody() {
  return <div>Select / Drag and drop Photos</div>;
}

const MediaUpload: React.FC<any> = ({ setValue, watch, control, editedProduct, type }) => {
  const [files, setFiles] = useState([]);
  // console.log(editedProduct);
  // console.log(media);

  const onChange = (file: any) => {
    console.log(file, "Media");
    setValue(type, file);
    setFiles(file);
  };
  // console.log(files);

  useEffect(() => {
    setFiles([]);
  }, []);

  const onRemoveImage = (id: any) => {
    setFiles((prev) => prev.filter((i: any) => i.id !== id));
  };
  const onError = (error: any) => {
    console.error(error);
  };
  const removePrev = (n: any) => {
    const updatedFiles = files?.splice(n, 1);
    setFiles(updatedFiles);
    setValue(type, updatedFiles);
  };
  return (
    <div>
      <FileUpload
        className="drop-section"
        onError={onError}
        body={<CustomBody />}
        overlap={false}
        fileValue={files}
        onChange={onChange}
      />
      <div className="upload-image-box">
        {files?.map((item: any, index: any) => {
          return (
            <div
              aria-hidden
              style={{
                width: 80,
                height: 80,
                marginRight: 10,
                position: "relative",
                flexWrap: "wrap",
              }}
              key={item.id}
            >
              <img
                style={{ width: 80, height: 80 }}
                src={item.url || item.preview || item?.fileURL}
                alt="images"
              />
              <div
                style={{
                  position: "absolute",
                  top: 3,
                  right: 5,
                  cursor: "pointer",
                }}
                onClick={() => removePrev(index)}
              >
                <Icon name="x" size={15} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
