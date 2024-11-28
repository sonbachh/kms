import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
// import { withRouter } from 'react-router-dom';
import axios from "axios";
import Pagination from "../../components/Common/Pagination";
import { Modal, Button, Form } from "react-bootstrap"; // Thêm modal từ react-bootstrap
import Notification from "../../components/Notification";
import { getSession } from "../../components/Auth/Auth";


class LocationActivityList extends React.Component {
  state = {
    RequestListData: [],
    NewRequestListData: [],
    LocationListData: [],
    NewLocationListData: [],
    ActivityListData: [],
    NewActivityListData: [],

    currentPageActivity: 1,
    itemsPerPage: 10,
    currentPageLocation: 1,

    newLocationName: "", // State để lưu trữ tên địa điểm mới
    showModalLocation: false, // State để kiểm soát hiển thị modal
    selectedStatusLocation: "", // Lưu trạng thái được chọn để lọc
    FilterLocationListData: [],

    newActivityName: "", // State để lưu trữ tên địa điểm mới
    showModalActivity: false, // State để kiểm soát hiển thị modal
    selectedStatusActivity: "", // Lưu trạng thái được chọn để lọc
    FilterActivityListData: [],


    showNotification: false,
    notificationText: "",
    notificationType: "success",
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    // Gọi API và cập nhật state bằng axios
    axios.get(`${process.env.REACT_APP_API_URL}/api/LocationActivity/GetAllLocations`)
      .then((response) => {
        this.setState({ LocationListData: response.data });
        this.setState({ FilterLocationListData: response.data });
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });

    axios.get(`${process.env.REACT_APP_API_URL}/api/LocationActivity/GetAllActivities`)
      .then((response) => {
        this.setState({ ActivityListData: response.data });
        this.setState({ FilterActivityListData: response.data });

      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });

  }

  handleCreateLocation = () => {
    const { newLocationName } = this.state;
    if (!newLocationName.trim()) {
      this.setState({
        notificationText: "Please enter a Location name!",
        notificationType: "error",
        showNotification: true,
      });
      return;
    }

    axios.post(`${process.env.REACT_APP_API_URL}/api/LocationActivity/AddLocation`, {
      locationName: newLocationName,
      status: 0
    })
      .then((response) => {
        this.setState({
          notificationText: "Location added successfully!",
          notificationType: "success",
          showNotification: true,
        });
        // Gọi lại API để lấy danh sách mới nhất
        axios.get(`${process.env.REACT_APP_API_URL}/api/LocationActivity/GetAllLocations`)
          .then((response) => {
            this.setState({
              LocationListData: response.data, // Cập nhật lại LocationListData từ API
              newLocationName: "", // Reset lại tên địa điểm
              showModalLocation: false, // Đóng modal sau khi thêm thành công
            });
          })
          .catch((error) => {
            console.error("Error fetching updated locations: ", error);
          });
      })
      .catch((error) => {
        this.setState({
          notificationText: "Failed to add location!",
          notificationType: "error",
          showNotification: true,
        });
      });
  };

  handleShowModalLocation = () => {
    this.setState({ showModalLocation: true });
  };

  handleCloseModalLocation = () => {
    this.setState({ showModalLocation: false, newLocationName: "" });
  };

  handleInputChangeLocation = (event) => {
    this.setState({ newLocationName: event.target.value });
  };


  handleCreateActivity = () => {
    const { newActivityName } = this.state;
    if (!newActivityName.trim()) {
      alert("Please enter a location name.");
      return;
    }

    axios.post(`${process.env.REACT_APP_API_URL}/api/LocationActivity/AddActivity`, {
      activityName: newActivityName,
      status: 0
    })
      .then((response) => {
        alert("Activity added successfully!");
        // Gọi lại API để lấy danh sách mới nhất
        axios.get(`${process.env.REACT_APP_API_URL}/api/LocationActivity/GetAllActivities`)
          .then((response) => {
            this.setState({
              ActivityListData: response.data, // Cập nhật lại LocationListData từ API
              newActivityName: "", // Reset lại tên địa điểm
              showModalActivity: false, // Đóng modal sau khi thêm thành công
            });
          })
          .catch((error) => {
            console.error("Error fetching updated locations: ", error);
          });
      })
      .catch((error) => {
        console.error("Error adding activity: ", error);
        alert("Failed to add activity. Please try again.");
      });
  };

  handleShowModalActivity = () => {
    this.setState({ showModalActivity: true });
  };

  handleCloseModalActivity = () => {
    this.setState({ showModalActivity: false, newActivityName: "" });
  };

  handleInputChangeActivity = (event) => {
    this.setState({ newActivityName: event.target.value });
  };
  // handleEdit = (requestId) => {
  //   this.props.history.push(`/request-update/${requestId}`);
  // };

  // handleDetail = (requestId) => {
  //   this.props.history.push(`/request-detail/${requestId}`);
  // };

  // handleCreateRequest = () => {
  //   // Chuyển hướng đến trang add teacher
  //   this.props.history.push(`/create-request`);
  // };

  handlePageChangeActivity = (pageNumber) => {
    this.setState({ currentPageActivity: pageNumber });
  };
  handlePageChangeLocation = (pageNumber) => {
    this.setState({ currentPageLocation: pageNumber });
  };

  handleStatusFilterLocation = (status) => {
    let filteredData = this.state.LocationListData;
    this.setState({ selectedStatusLocation: status }, () => {
      const filteredLocations = filteredData?.filter((location) =>
        status === "" ? true : location.status == status
      );
      this.setState({ FilterLocationListData: filteredLocations });
    });
  };

  handleStatusChangeLocation = async (location, newStatus) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/LocationActivity/UpdateLocation`, {
        locationId: location.locationId,
        locationName: location.locationName,
        status: newStatus
      });
      this.setState({
        notificationText: "Status updated successfully!",
        notificationType: "success",
        showNotification: true,
      });

      // Cập nhật trạng thái trong state
      this.setState((prevState) => {
        const updatedLocationListData = prevState.FilterLocationListData.map((item) =>
          item.locationId === location.locationId ? { ...item, status: newStatus } : item
        );
        return { FilterLocationListData: updatedLocationListData };
      });
    } catch (error) {
      console.error("Error updating status:", error);
      this.setState({
        notificationText: "Error updating status!",
        notificationType: "error",
        showNotification: true,
      });
    }
  };

  handleStatusFilterActivity = (status) => {
    let filteredData = this.state.ActivityListData;
    this.setState({ selectedStatusActivity: status }, () => {
      const filteredActivitys = filteredData?.filter((activity) =>
        status === "" ? true : activity.status == status
      );
      this.setState({ FilterActivityListData: filteredActivitys });
    });
  };

  handleStatusChangeActivity = async (activity, newStatus) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/LocationActivity/UpdateActivity`, {
        activityId: activity.activityId,
        activityName: activity.activityName,
        status: newStatus
      });
      this.setState({
        notificationText: "Status updated successfully!",
        notificationType: "success",
        showNotification: true,
      });

      // Cập nhật trạng thái trong state
      this.setState((prevState) => {
        const updatedActivityListData = prevState.FilterActivityListData.map((item) =>
          item.activityId === activity.activityId ? { ...item, status: newStatus } : item
        );
        return { FilterActivityListData: updatedActivityListData };
      });
    } catch (error) {
      console.error("Error updating status:", error);
      this.setState({
        notificationText: "Error updating status!",
        notificationType: "error",
        showNotification: true,
      });
    }
  };

  render() {
    const { FilterLocationListData, FilterActivityListData, newLocationName, showModalLocation, newActivityName, showModalActivity } = this.state;
    const { showNotification, notificationText, notificationType } = this.state;

    const statusOptions = [
      { value: 1, label: "Active", className: "badge-success" },
      { value: 0, label: "InActive", className: "badge-default" },
    ];

    // phan trang activity
    const { currentPageActivity, itemsPerPage } = this.state;
    const indexOfLastItemActivity = currentPageActivity * itemsPerPage;
    const indexOfFirstItemActivity = indexOfLastItemActivity - itemsPerPage;
    const currentItemsActivity = FilterActivityListData.slice(indexOfFirstItemActivity, indexOfLastItemActivity);

    // phan trang location
    const { currentPageLocation } = this.state;
    const indexOfLastItemLocation = currentPageLocation * itemsPerPage;
    const indexOfFirstItemLocation = indexOfLastItemLocation - itemsPerPage;
    const currentItemsLocation = FilterLocationListData.slice(indexOfFirstItemLocation, indexOfLastItemLocation);

    // Get user data from cookie
    const userData = getSession('user')?.user;
    const roleId = userData?.roleId;

    return (
      <div
        style={{ flex: 1 }}
        onClick={() => {
          document.body.classList.remove("offcanvas-active");
        }}
      >
        {showNotification && (
          <Notification
            type={notificationType}
            position="top-right"
            dialogText={notificationText}
            show={showNotification}
            onClose={() => this.setState({ showNotification: false })}
          />
        )}
        <div>
          <div className="container-fluid">
            <PageHeader
              HeaderText="Location and Activity"
              Breadcrumb={[
                { name: "Item List", navigate: "" },
              ]}
            />
            <div className="row clearfix">
              <div className="col-lg-12 col-md-12">
                <div className="card planned_task">
                  <div className="header d-flex justify-content-between">
                    <h2>Location and Activity Manager</h2>
                    {/* {roleId === 2 ? (
                      <a onClick={() => this.handleCreateRequest()} class="btn btn-success text-white">Create New Request</a>
                    ) : null} */}
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="card">
                  <div className="body project_report row">
                    <div className="col-md-6">
                      <div className="d-flex justify-content-between">
                        <h4>Location Table</h4>
                        {/* Filter by status */}
                        <select
                          className="form-control"
                          style={{ width: "200px" }}
                          value={this.state.selectedStatus} // Bind với state
                          onChange={(e) => this.handleStatusFilterLocation(e.target.value)}
                        >
                          <option value="">All Status Location</option>
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
                        </select>
                        {roleId === 3 ?
                          <a
                            onClick={() => this.handleShowModalLocation()}
                            className="btn btn-primary text-white mb-2"
                          >
                            <i className="icon-plus"></i>
                          </a>
                          : <></>
                        }
                      </div>
                      <div className="table-responsive">
                        <table className="table m-b-0 table-hover">
                          <thead className="">
                            <tr className="theme-color">
                              <th>#</th>
                              <th>Location Name</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentItemsLocation?.map((item, index) => {
                              return (
                                <React.Fragment key={"teacher" + index}>
                                  <tr>
                                    <td>{index + 1}</td>
                                    <td>{item?.locationName}</td>

                                    {(roleId === 4) && ( // Chỉ cho phép roleId = 4 thay đổi trạng thái
                                      <td>
                                        <select
                                          value={item?.status}
                                          onChange={(e) => this.handleStatusChangeLocation(item, parseInt(e.target.value))}
                                          className={`form-control ${item?.status === 1 ? 'badge-success' : 'badge-default'}`}
                                        >
                                          {statusOptions.map(option => (
                                            <option key={option.value} value={option.value} className={option.className}>
                                              {option.label}
                                            </option>
                                          ))}
                                        </select>
                                      </td>
                                    )}
                                    {(roleId === 3) && ( // Nếu roleId = 3 chỉ hiển thị trạng thái mà không có select
                                      <td>
                                        <span className={`badge ${item?.status === 1 ? 'badge-success' : 'badge-default'}`}>
                                          {statusOptions.find(option => option.value === item?.status)?.label} {/* Hiển thị trạng thái */}
                                        </span>
                                      </td>
                                    )}
                                  </tr>

                                </React.Fragment>
                              );
                            })}
                          </tbody>
                        </table>
                        <div className="pt-4">
                          <Pagination
                            currentPage={currentPageLocation}
                            totalItems={FilterLocationListData.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={this.handlePageChangeLocation}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex justify-content-between">
                        <h4>Actibity Table</h4>
                        {/* Filter by status */}
                        <select
                          className="form-control"
                          style={{ width: "200px" }}
                          value={this.state.selectedStatus} // Bind với state
                          onChange={(e) => this.handleStatusFilterActivity(e.target.value)}
                        >
                          <option value="">All Status Activity</option>
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
                        </select>
                        {roleId === 3 &&
                          <a
                            onClick={() => this.handleShowModalActivity()}
                            className="btn btn-primary text-white mb-2"
                          >
                            <i className="icon-plus"></i>
                          </a>
                        }

                      </div>
                      <div className="table-responsive">
                        <table className="table m-b-0 table-hover">
                          <thead className="">
                            <tr className="theme-color">
                              <th>#</th>
                              <th>Activity Name</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentItemsActivity?.map((item, index) => {
                              return (
                                <React.Fragment key={"teacher" + index}>
                                  <tr>
                                    <td>{index + 1}</td>
                                    <td>{item?.activityName}</td>
                                    {(roleId === 4) && ( // Chỉ cho phép roleId = 4 thay đổi trạng thái
                                      <td>
                                        <select
                                          value={item?.status}
                                          onChange={(e) => this.handleStatusChangeActivity(item, parseInt(e.target.value))}
                                          className={`form-control ${item?.status === 1 ? 'badge-success' : 'badge-default'}`}
                                        >
                                          {statusOptions.map(option => (
                                            <option key={option.value} value={option.value} className={option.className}>
                                              {option.label}
                                            </option>
                                          ))}
                                        </select>
                                      </td>
                                    )}
                                    {(roleId === 3) && ( // Nếu roleId = 3 chỉ hiển thị trạng thái mà không có select
                                      <td>
                                        <span className={`badge ${item?.status === 1 ? 'badge-success' : 'badge-default'}`}>
                                          {statusOptions.find(option => option.value === item?.status)?.label} {/* Hiển thị trạng thái */}
                                        </span>
                                      </td>
                                    )}
                                  </tr>
                                </React.Fragment>
                              );
                            })}
                          </tbody>
                        </table>
                        <div className="pt-4">
                          <Pagination
                            currentPage={currentPageActivity}
                            totalItems={FilterActivityListData.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={this.handlePageChangeActivity}
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Modal để tạo địa điểm */}
        <Modal show={showModalLocation} onHide={this.handleCloseModalLocation}>
          <Modal.Header closeButton>
            <Modal.Title>Create New Location</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formLocationName">
                <Form.Label>Location Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter location name"
                  value={newLocationName}
                  onChange={this.handleInputChangeLocation}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseModalLocation}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleCreateLocation}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Modal để tạo địa điểm */}
        <Modal show={showModalActivity} onHide={this.handleCloseModalActivity}>
          <Modal.Header closeButton>
            <Modal.Title>Create New Activity</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formActivityName">
                <Form.Label>Activity Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Activity name"
                  value={newActivityName}
                  onChange={this.handleInputChangeActivity}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseModalActivity}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleCreateActivity}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = ({ ioTReducer }) => ({
  isSecuritySystem: ioTReducer.isSecuritySystem,
});

export default connect(mapStateToProps)((LocationActivityList));
