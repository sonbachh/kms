
import React, { useState, useEffect } from 'react';
import PageHeader from "../../components/PageHeader";
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { getSession } from '../../components/Auth/Auth';
import Pagination from "../../components/Common/Pagination";

class UserList extends React.Component {
  state = {
    users: [],
    searchText: "",
    filterStatus: "all", // Giá trị 'all', '1', hoặc '0' để lọc trạng thái
    filterRoles: "all",
    roleMap: {
      1: "Admin",
      2: "Parent",
      3: "Staff",
      4: "Principal",
      5: "Teacher",
    },

    currentPage: 1,
    itemsPerPage: 10,
  };
  componentDidMount() {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/User`);
        const data = response.data;
        this.setState({ users: data });
        console.log(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }

  handleCreateUser = () => {
    // Chuyển hướng đến cap nhat category
    this.props.history.push(`/create-user`);
  };

  handleViewDetail = (semesterId) => {
    // Chuyển hướng đến trang chi tiet category
    this.props.history.push(`/semester-detail/${semesterId}`);
  };


  handleSearchChange = (e) => {
    this.setState({ searchText: e.target.value });
  };


  handleStatusFilterChange = (e) => {
    this.setState({ filterStatus: e.target.value });
  };

  handleRolesFilterChange = (e) => {
    this.setState({ filterRoles: e.target.value });
  };

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  render() {

    const { users, searchText, filterStatus, filterRoles } = this.state;
    const userData = getSession('user').user;
    const roleId = userData.roleId


    // Lọc danh sách
    const filteredUsers = users
      .filter((item) =>
        item.mail?.toLowerCase().includes(searchText?.toLowerCase()) // Tìm kiếm theo tên
      )
      .filter((item) =>
        filterStatus === "all" ? true : item.status.toString() === filterStatus // Lọc theo trạng thái
      )
      .filter((item) =>
        filterRoles === "all" ? true : item.roleId.toString() === filterRoles // Lọc theo trạng thái
      );

    // phan trang
    const { currentPage, itemsPerPage } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

    const statusOptions = [
      { value: 1, label: "Active", className: "badge-success" },
      { value: 0, label: "Inactive", className: "badge-default" },
    ];
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
              HeaderText="User Management"
              Breadcrumb={[
                { name: "User", navigate: "" },
              ]}
            />
            <div className="row clearfix">
              <div className="col-lg-12 col-md-12">
                <div className="card planned_task">
                  <div className="header d-flex justify-content-between">
                    <h2>User Manager</h2>
                    {roleId === 1 ? (
                      <div>
                        <a onClick={() => this.handleCreateUser()} class="btn btn-success text-white">Create New User</a>
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
                      <select
                        className="form-control"
                        value={filterRoles}
                        onChange={this.handleRolesFilterChange}
                      >
                        <option value="all">All Roles</option>
                        <option value="1">Admin</option>
                        <option value="2">Parent</option>
                        <option value="3">Staff</option>
                        <option value="4">Principal</option>
                        <option value="5">Teacher</option>
                      </select>
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
                          <th>FirstName</th>
                          <th>LastName</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Gender</th>
                          <th>Role</th>
                          <th>Status</th>
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
                                {item?.firstname}
                              </td>
                              <td>
                                {item?.lastName}
                              </td>
                              <td>
                                {item?.mail}
                              </td>
                              <td>
                                {item?.phoneNumber}
                              </td>
                              <td>
                                {item?.gender === 0 ? "FeMale" : "Male"}
                              </td>
                              <td>
                                {this.state.roleMap[item?.roleId] || "Unknown Role"}
                              </td>
                              <td>
                                <select
                                  value={item?.status}
                                  onChange={(e) => this.handleStatusChange(item.userId, parseInt(e.target.value))}
                                  className={`form-control ${item?.status === 1 ? 'badge-success' : 'badge-default'}`}
                                >
                                  {statusOptions.map(option => (
                                    <option key={option.value} value={option.value} className={option.className}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
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
                      totalItems={filteredUsers.length}
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

export default withRouter(UserList);