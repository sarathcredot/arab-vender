import React,{useState,useEffect} from 'react'
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
    Label
  } from "reactstrap";
  import { gql, useQuery, useMutation } from "@apollo/client";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
  import styles from "../Kyc/kyc.module.css"
  const GET_ATTRIBUTE=gql`query GetAttributesDetailsWithCategory($input: AttributesDetailsWithCategoryIdInput!) {
    getAttributesDetailsWithCategory(input: $input) {
      message
      record {
        _id
        categoryName
        attributes {
          _id
          attributeType
          attributeValues {
            _id
            value
            colorCode
            isBlocked
            priority
          }
          description
          isBlocked
          name
        }
      }
    }
  }`
function catattribute({selectedCategoryData}:any) {
  console.log(selectedCategoryData);
  const catId=selectedCategoryData?._id

  const { loading, error, data } = useQuery(GET_ATTRIBUTE, {
    variables: { input:{categoryId:catId} },
  });
console.log(data);
const [dropdownOpen, setDropdownOpen] = useState(false);
const [attributeData,setAttributeData]=useState([]) as any
useEffect(()=>{
  setAttributeData(data?.getAttributesDetailsWithCategory?.record?.attributes)
},[data])
const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  return (
    <div>
       {attributeData && attributeData.map((attri:any,index:any)=>{
        console.log(attri);
        
return(
 (attri?.attributeValues.length>0 && <div key={index} className='mt-3'>
  <Label>{attri?.description}</Label>
 <Input type="select">
 <option value="">Select</option>
 {attri?.attributeValues.map(
                                        (attributes: any, index:number) => (
                                          <option
                                            key={index}
                                            value={attributes.value}
                                          >
                                            {attributes.value}
                                          </option>
                                        )
                                      )}
                                     </Input>
                     </div>)
)
       })
      
       }
    </div>

  )
}

export default catattribute