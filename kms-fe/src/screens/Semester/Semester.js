
import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { getSession } from '../../components/Auth/Auth';
import Pagination from "../../components/Common/Pagination";

class Semester extends React.Component {
  state = {
    semesters: [],
    searchText: "",
    sortDirection: "asc", // Giá trị 'asc' hoặc 'desc' cho sắp xếp
    filterStatus: "all", // Giá trị 'all', '1', hoặc '0' để lọc trạng thái

    currentPage: 1,
    itemsPerPage: 10,
  };
  componentDidMount() {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/Semester/GetAllSemester`);
        const data = response.data;
        this.setState({ semesters: data });
        console.log(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }

  handleCreateSemester = () => {
    // Chuyển hướng đến cap nhat category
    this.props.history.push(`/create-semester`);
  };

  handleViewDetail = (semesterId) => {
    // Chuyển hướng đến trang chi tiet category
    this.props.history.push(`/semester-detail/${semesterId}`);
  };

  handleEdit = (semesterId) => {
    // Chuyển hướng đến cap nhat category
    this.props.history.push(`/semester-update/${semesterId}`);
  };

  handleSearchChange = (e) => {
    this.setState({ searchText: e.target.value });
  };

  handleSort = () => {
    const { sortDirection, semesters } = this.state;
    const sortedSemesters = [...semesters].sort((a, b) => {
      if (sortDirection === "asc") {
        return new Date(a.startDate) - new Date(b.startDate);
      } else {
        return new Date(b.startDate) - new Date(a.startDate);
      }
    });
    this.setState({
      semesters: sortedSemesters,
      sortDirection: sortDirection === "asc" ? "desc" : "asc",
    });
  };

  handleStatusFilterChange = (e) => {
    this.setState({ filterStatus: e.target.value });
  };

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  render() {

    const { semesters, searchText, sortDirection, filterStatus } = this.state;
    
    const userData = getSession('user').user;
    const roleId = userData.roleId


    // Lọc danh sách
    const filteredSemesters = semesters
      .filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) // Tìm kiếm theo tên
      )
      .filter((item) =>
        filterStatus === "all" ? true : item.status.toString() === filterStatus // Lọc theo trạng thái
      );

    // phan trang
    const { currentPage, itemsPerPage } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSemesters.slice(indexOfFirstItem, indexOfLastItem);

    return (
      <div
        style={{ flex: 1 }}
        onClick={() => {
          document.body.classList.remove("offcanvas-active");
        }}
      >
        <div>
          <div className="container-fluid">
            <PageHeader
              HeaderText="Semester Management"
              Breadcrumb={[
                { name: "Semester", navigate: "" },
              ]}
            />
            <div className="row clearfix">
              <div className="col-lg-12 col-md-12">
                <div className="card planned_task">
                  <div className="header d-flex justify-content-between">
                    <h2>Semester Manager</h2>
                    {roleId === 3 ? (
                      <div>
                        <a onClick={() => this.handleCreateSemester()} class="btn btn-success text-white">Create New Semester</a>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group row pl-3">
                    <div className="col-md-3 mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Semester Name"
                        value={searchText}
                        onChange={this.handleSearchChange}
                      />
                    </div>
                    <div className="col-md-3  mb-2">
                      <select
                        className="form-control"
                        value={filterStatus}
                        onChange={this.handleStatusFilterChange}
                      >
                        <option value="all">All Status</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </select>
                    </div>

                    <div className="col-md-3  mb-2">
                      <button className="btn btn-primary" onClick={this.handleSort}>
                        Sort by Start Date ({sortDirection === "asc" ? "Asc" : "Desc"})
                      </button>
                    </div>

                  </div>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="card">
                  <div className="table-responsive">
                    <table className="table m-b-0 table-hover">
                      <thead className="">
                        <tr className="theme-color">
                          <th>#</th>
                          <th>Semester Name</th>
                          <th>startDate</th>
                          <th>endDate</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((item, i) => {
                          return (
                            <tr key={"dihf" + i}>

                              <td className="project-title">
                                <th scope="row">{i + 1}</th>
                              </td>
                              <td>
                                {item?.name}
                              </td>
                              <td>
                                {item?.startDate?.split("T")[0]}
                              </td>
                              <td>
                                {item?.endDate?.split("T")[0]}
                              </td>
                              <td>
                                {item?.status === 1 ? (
                                  <span className="badge badge-success">Active</span>
                                ) : item?.status === 0 ? (
                                  <span className="badge badge-default">InActive</span>
                                ) : null}
                              </td>
                              <td className="project-actions">
                                {/* <a onClick={() => this.handleViewDetail(item.semesterId)} className="btn btn-outline-secondary mr-1">
                                  <i className="icon-eye"></i>
                                </a> */}
                                <a onClick={() => this.handleEdit(item.semesterId)} className="btn btn-outline-secondary">
                                  <i className="icon-pencil"></i>
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="pt-4">
                    <Pagination
                      currentPage={currentPage}
                      totalItems={filteredSemesters.length}
                      itemsPerPage={itemsPerPage}
                      onPageChange={this.handlePageChange}
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div >
      </div >
    );
  }
}

export default withRouter(Semester);