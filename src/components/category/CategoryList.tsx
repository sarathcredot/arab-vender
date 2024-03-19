import React, { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import {
  Card,
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
  BreadcrumbItem,
} from "reactstrap";
import CategoryForm from "./CategoryForm";
import { gql, useMutation, useQuery } from "@apollo/client";
import { ToastContainer } from "react-toastify";
import { result } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { C } from "@fullcalendar/core/internal-common";
import { capitalCase } from "change-case";
import { Link } from "react-router-dom";
import StatusIndicator from "../statusIndicator/StatusIndicator";

interface sizeChart {
  fileType: string;
  fileURL: string;
  mimeType: string;
  originalName: string;
}

interface Category {
  _id: string;
  categoryName: string;
  description: string;
  children?: Category[];
  isLeaf: boolean;
  sizeChart: sizeChart;
  isBlocked: boolean;
  fullCategoryName: string

}

interface Props { }

const CategoryList: React.FC<Props> = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  // const [itemsPerPage] = useState<number>(5);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [showSubCategories, setShowSubCategories] = useState<boolean>(false);

  // const [showSubCategories, setShowSubCategories] = useState<boolean>(false);
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");
  const [breadcrumb, setBreadcrumb] = useState<Category[]>([]);
  const [topCategory, setTopCategory] = useState<boolean>(false);
  const [filteredCategory, setFilteredCategory] = useState<Category[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
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


  const {
    loading: categoryLoading,
    error: categoryError,
    data: categoryDataResponse,
    refetch: categoryRefetch,
  } = useQuery(GET_CATEGORY);


  useEffect(() => {

    setCategoryData(
      categoryDataResponse?.getAllCategoriesOfVendor?.records || []
    );
  }, [
    categoryLoading,
    categoryDataResponse,
    topCategory,
  ]);

  const openImageModal = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    setIsImageModalOpen(true);
  };

  const flattenedCategories: Category[] = flattenCategories(categoryData);

  // const [currentItems, totalPages] = getCurrentPageItems(flattenedCategories, currentPage, itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
    if (showAddModal) {
      setEditCategory(null);
    }
  };

  const handleAddCategory = () => {
    toggleAddModal();
  };



  const statusOptions = [
    { value: "all", label: "All" },
    { value: "blocked", label: "Blocked" },
    { value: "nonBlocked", label: "Active" },
  ];

  const toggleStatusDropdown = () => {
    setStatusDropdownOpen(!statusDropdownOpen);
  };

  const handleStatusSelect = (selectedOption: any) => {
    setSelectedStatus(selectedOption);
    setStatusDropdownOpen(false);
  };

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
    console.log(event.target.value);
  };

  useEffect(() => {
    if (selectedStatus) {
      const filtered = categoryData.filter((size: any) => {
        const isNameMatch = size.categoryName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        if (selectedStatus.value === "all") {
          return isNameMatch;
        } else {
          return (
            isNameMatch &&
            size?.isBlocked ===
            (selectedStatus.value === "blocked" ? true : false)
          );
        }
      });
      setFilteredCategory(filtered);
    } else {
      const filtered = categoryData.filter((size: any) =>
        size.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategory(filtered);
    }
  }, [selectedStatus, categoryData, breadcrumb, searchTerm]);


  const items = [
    { text: "Dashboard", link: `/` },
  ];


  return (
    <>
      <ToastContainer />
      <div className="page-content">
        <Container fluid={true} style={{ marginTop: "0px" }}>
          <Breadcrumb items={items} currentPage="Categories" />
          <Row>
            <Col lg={12}>
              <Card style={{ borderRadius: "0px" }}>
                <CardHeader>
                  <Row>
                    <Col xs={5} style={{ display: "flex", gap: "20px" }}>
                      <Input
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={handleSearch}
                        style={{ width: "50%", borderRadius: "0" }}

                      />
                      <Dropdown
                        isOpen={statusDropdownOpen}
                        toggle={toggleStatusDropdown}

                      >
                        <DropdownToggle caret style={{ background: "black", borderRadius: "0", boxShadow: "none", border: "none" }}>
                          {selectedStatus
                            ? selectedStatus?.label
                            : "Select Status"}{" "}
                          <FontAwesomeIcon icon={faAngleDown} />
                        </DropdownToggle>
                        <DropdownMenu>
                          {statusOptions.map((option) => (
                            <DropdownItem
                              key={option.value}
                              onClick={() => handleStatusSelect(option)}
                            >
                              {option.label}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </Col>



                  </Row>
                </CardHeader>
                <CardBody>

                  <Table
                    responsive
                    className="table table-bordered table-centered mb-0"
                  >
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Category Name</th>
                        <th>Category Path</th>
                        {/* <th>Size Chart Image</th> */}
                        <th>Status</th>
                        {/* <th>Actions</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCategory.map((category, index) => (
                        <tr key={category._id}>
                          <td>{index + 1}</td>
                          <td>{category?.categoryName}</td>
                          <td>{category?.fullCategoryName}</td>

                          <td>
                            <StatusIndicator status={category?.isBlocked == false ? "ACTIVE" : "BLOCKED"} />

                          </td>


                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <Modal
                    isOpen={isImageModalOpen}
                    toggle={() => setIsImageModalOpen(!isImageModalOpen)}
                  >
                    <img
                      src={selectedImageUrl}
                      alt="Full Size Chart"
                      style={{ width: "100%" }}
                    />
                  </Modal>


                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );

  function flattenCategories(categories: Category[]): Category[] {
    let flattenedCategories: Category[] = [];
    categories.forEach((category) => {
      flattenedCategories.push(category);
      if (category.children && category.children.length > 0) {
        flattenedCategories = [
          ...flattenedCategories,
          ...flattenCategories(category.children),
        ];
      }
    });
    return flattenedCategories;
  }

  function getCurrentPageItems(
    data: Category[],
    currentPage: number,
    itemsPerPage: number
  ): [Category[], number] {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);
    return [currentItems, totalPages];
  }


};

export default CategoryList;
