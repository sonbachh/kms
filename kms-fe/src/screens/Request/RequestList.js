import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import axios from "axios";
import { getSession } from "../../components/Auth/Auth";
import Pagination from "../../components/Common/Pagination";

class RequestList extends React.Component {
  state = {
    UserListData: [],
    RequestListData: [],
    NewRequestListData: [],

    filterTitle: "", // Lưu tiêu đề cần lọc
    filterStatus: "", // Lưu trạng thái cần lọc

    currentPage: 1,
    itemsPerPage: 10,
  };

  componentDidMount() {
    window.scrollTo(0, 0);

    // Gọi API lấy dữ liệu request
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/Request/GetAllRequests`)
      .then((response) => {
        const { data } = response;
        const userData = getSession("user")?.user;
        const roleId = userData?.roleId;

        const reversedData = data.reverse(); // Đảo ngược thứ tự dữ liệu

        let filteredData = [];

        if (roleId === 5) {
          filteredData = reversedData;
        } else if (roleId === 3) {
          filteredData = reversedData.filter(
            (i) => i.statusRequest === 2 || i.statusRequest === 3 || i.statusRequest === 4
          );
        } else if (roleId === 2) {
          filteredData = reversedData.filter((i) => i.createBy === userData.userId);
        } else {
          filteredData = reversedData;
        }

        this.setState({ RequestListData: reversedData, NewRequestListData: filteredData });
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });

    // Gọi API lấy dữ liệu người dùng
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/User`)
      .then((response) => {
        this.setState({ UserListData: response.data });
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }

  handleEdit = (requestId) => {
    this.props.history.push(`/request-update/${requestId}`);
  };

  handleDetail = (requestId) => {
    this.props.history.push(`/request-detail/${requestId}`);
  };

  handleCreateRequest = () => {
    this.props.history.push(`/create-request`);
  };

  handleFilterChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value }, this.applyFilters);
  };

  applyFilters = () => {
    const { RequestListData, filterTitle, filterStatus } = this.state;

    let filteredData = [...RequestListData]; // Sao chép dữ liệu để xử lý

    // Lọc theo tiêu đề
    if (filterTitle) {
      filteredData = filteredData.filter((item) =>
        item.title.toLowerCase().includes(filterTitle.toLowerCase())
      );
    }

    // Lọc theo trạng thái
    if (filterStatus) {
      filteredData = filteredData.filter(
        (item) => item.statusRequest === parseInt(filterStatus, 10)
      );
    }

    this.setState({ NewRequestListData: filteredData });
  };

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  render() {
    const { NewRequestListData, UserListData } = this.state;
    const userData = getSession("user")?.user;
    const roleId = userData?.roleId;

    const statusDescriptions = {
      1: "Pending",
      2: "Processing",
      3: "Approved",
      4: "Rejected",
    };

    // phan trang
    const { currentPage, itemsPerPage } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = NewRequestListData.slice(indexOfFirstItem, indexOfLastItem);

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
              HeaderText="Request Management"
              Breadcrumb={[
                { name: "Request Management", navigate: "request" },
                { name: "Request List", navigate: "" },
              ]}
            />
            <div className="row clearfix">
              <div className="col-lg-12 col-md-12">
                <div className="card planned_task">
                  <div className="header d-flex justify-content-between">
                    <h2>Request Manager</h2>
                    <div className="col-lg-3">
                      <select
                        name="filterStatus"
                        className="form-control"
                        value={this.state.filterStatus}
                        onChange={this.handleFilterChange}
                      >
                        <option value="">All Status</option>
                        <option value="1">Pending</option>
                        <option value="2">Processing</option>
                        <option value="3">Approved</option>
                        <option value="4">Rejected</option>
                      </select>
                    </div>
                    <div className="col-lg-3">
                      <input
                        type="text"
                        name="filterTitle"
                        className="form-control"
                        placeholder="Filter by Title"
                        value={this.state.filterTitle}
                        onChange={this.handleFilterChange}
                      />
                    </div>
                    {roleId === 2 && (
                      <button
                        onClick={this.handleCreateRequest}
                        className="btn btn-success text-white"
                      >
                        Create New Request
                      </button>
                    )}
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
                            <th>Title</th>
                            <th>Description</th>
                            <th>Create By</th>
                            <th>Create At</th>
                            <th>Process Note</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.map((request, index) => {
                            const fullname = UserListData.find(
                              (user) => user.userId === request.createBy
                            );

                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{request.title}</td>
                                <td
                                  className="text-truncate"
                                  style={{ maxWidth: "150px" }}
                                >
                                  {request.description}
                                </td>
                                <td>
                                  {fullname
                                    ? `${fullname.firstname} ${fullname.lastName}`
                                    : "Unknown User"}
                                </td>
                                <td>
                                  {request.createAt
                                    ? request.createAt.slice(0, 10)
                                    : ""}
                                </td>
                                <td
                                  className="text-truncate"
                                  style={{ maxWidth: "150px" }}
                                >
                                  {request.processNote}
                                </td>
                                <td>
                                  {(() => {
                                    switch (request.statusRequest) {
                                      case 1:
                                        return (
                                          <span className="badge badge-default">
                                            Pending
                                          </span>
                                        );
                                      case 2:
                                        return (
                                          <span className="badge badge-info">
                                            Processing
                                          </span>
                                        );
                                      case 3:
                                        return (
                                          <span className="badge badge-success">
                                            Approved
                                          </span>
                                        );
                                      default:
                                        return (
                                          <span className="badge badge-danger">
                                            Rejected
                                          </span>
                                        );
                                    }
                                  })()}
                                </td>
                                <td className="project-actions">
                                  <button
                                    className="btn btn-outline-secondary mr-1"
                                    onClick={() =>
                                      this.handleDetail(request.requestId)
                                    }
                                  >
                                    <i className="icon-eye"></i>
                                  </button>
                                  {(roleId === 3 &&
                                    request.statusRequest === 2) ||
                                    (roleId === 5 &&
                                      request.statusRequest === 1) ||
                                    (roleId === 2 &&
                                      request.statusRequest === 1) ? (
                                    <button
                                      className="btn btn-outline-secondary"
                                      onClick={() =>
                                        this.handleEdit(request.requestId)
                                      }
                                    >
                                      <i className="icon-pencil"></i>
                                    </button>
                                  ) : null}
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
                        totalItems={NewRequestListData.length}
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

export default connect(mapStateToProps)(RequestList);
