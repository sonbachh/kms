import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { withRouter } from 'react-router-dom';
import axios from "axios";
import Pagination from "../../components/Common/Pagination";


class TeacherList extends React.Component {
  state = {
    TeacherListData: [], // State để lưu trữ dữ liệu từ API
    filteredTeacherListData: [], // Dữ liệu sau khi lọc
    filterPhone: "", // Bộ lọc theo số điện thoại
    filterCode: "", // Bộ lọc theo mã
    filterStatus: "", // Bộ lọc theo trạng thái

    currentPage: 1,
    itemsPerPage: 10,
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    // Gọi API và cập nhật state
    const fetchData = async () => {
      try {
        const TeacherResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/Teacher/GetAllTeachers`);
        const Teacherdata = TeacherResponse.data;
        this.setState({ TeacherListData: Teacherdata, filteredTeacherListData: Teacherdata })

        // // Fetch student by ParentID
        // const user = localStorage.getItem("user")
        // const parentId = JSON.parse(user).user.userId
        // const studentResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/Request/GetStudentsByParentId/${parentId}`);
        // const studentData = studentResponse.data;


      } catch (error) {
        console.error('Error fetching category details:', error);
      }
    };
    fetchData();
  }

  filterTeacherList = () => {
    const { TeacherListData, filterPhone, filterCode, filterStatus } = this.state;
    const filteredData = TeacherListData.filter((teacher) => {
      const matchesPhone = filterPhone === "" || teacher.phoneNumber.includes(filterPhone);
      const matchesCode = filterCode === "" || teacher.code.includes(filterCode.toLocaleUpperCase());
      const matchesStatus = filterStatus === "" || teacher.status === parseInt(filterStatus);
      return matchesPhone && matchesCode && matchesStatus;
    });
    this.setState({ filteredTeacherListData: filteredData });
  };

  handleFilterPhoneChange = (e) => {
    this.setState({ filterPhone: e.target.value }, this.filterTeacherList);
  };

  handleFilterCodeChange = (e) => {
    this.setState({ filterCode: e.target.value }, this.filterTeacherList);
  };

  handleFilterStatusChange = (e) => {
    this.setState({ filterStatus: e.target.value }, this.filterTeacherList);
  };

  handleEdit = (teacherId) => {
    // Chuyển hướng đến trang cập nhật thông tin học sinh
    this.props.history.push(`/teacher-update/${teacherId}`);
  };

  handleDetail = (teacherId) => {
    // Chuyển hướng đến trang cập nhật thông tin học sinh
    this.props.history.push(`/teacher-detail/${teacherId}`);
  };

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  render() {
    const { filteredTeacherListData } = this.state;

    // phan trang
    const { currentPage, itemsPerPage } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTeacherListData.slice(indexOfFirstItem, indexOfLastItem);

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
              HeaderText="Teacher Management"
              Breadcrumb={[
                { name: "Teacher Management", navigate: "1" },
                { name: "Teacher List", navigate: "" },
              ]}
            />
            <div className="row clearfix">

              <div className="col-lg-12 col-md-12">
                <div className="card planned_task">
                  <div className="header d-flex justify-content-between">
                    <h2>Teacher Manager</h2>
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Filter by Phone"
                        value={this.state.filterPhone}
                        onChange={this.handleFilterPhoneChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Filter by Code"
                        value={this.state.filterCode}
                        onChange={this.handleFilterCodeChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <select
                        className="form-control"
                        value={this.state.filterStatus}
                        onChange={this.handleFilterStatusChange}
                      >
                        <option value="">All Status</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="card">
                  <div className="body project_report">
                    <div className="table-responsive">
                      <table className="table m-b-0 table-hover">
                        <thead className="">
                          <tr className="theme-color">
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Phone</th>
                            <th>Gender</th>
                            <th>Code</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems?.map((teacher, index) => (
                            <React.Fragment key={"teacher" + index}>
                              <tr>
                                <td>{index + 1}</td>
                                <td>{teacher?.firstname}</td>
                                <td>{teacher.lastName}</td>
                                <td>{teacher.phoneNumber}</td>
                                <td>
                                  {teacher.gender === 1 ? (
                                    <span className="">
                                      Male
                                    </span>
                                  ) : (
                                    <span className="">
                                      Female
                                    </span>
                                  )}
                                </td>
                                <td>{teacher.code}</td>

                                <td>
                                  {teacher?.status === 1 ? (
                                    <span className="badge badge-success">Active</span>
                                  ) : teacher?.status === 0 ? (
                                    <span className="badge badge-default">InActive</span>
                                  ) : null}
                                </td>


                                <td className="project-actions">
                                  <a className="btn btn-outline-secondary mr-1"
                                    onClick={() => this.handleDetail(teacher.teacherId)} // Gọi hàm handleEdit
                                  >
                                    <i className="icon-eye"></i>
                                  </a>
                                  <a
                                    className="btn btn-outline-secondary"
                                    onClick={() => this.handleEdit(teacher.teacherId)} // Gọi hàm handleEdit
                                  >
                                    <i className="icon-pencil"></i>
                                  </a>
                                </td>
                              </tr>
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="pt-4">
                      <Pagination
                        currentPage={currentPage}
                        totalItems={filteredTeacherListData.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={this.handlePageChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ ioTReducer }) => ({
  isSecuritySystem: ioTReducer.isSecuritySystem,
});

export default connect(mapStateToProps)(withRouter(TeacherList));
