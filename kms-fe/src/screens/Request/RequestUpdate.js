
import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
// import { withRouter } from 'react-router-dom';
import axios from "axios";
import Notification from "../../components/Notification";
import { getSession } from "../../components/Auth/Auth";
import { addNotificationByUserId } from "../../components/Common/Notification";

class RequestUpdate extends React.Component {
  state = {
    requestId: 1,
    title: "Change Class",
    description: "Want to change class for my children",
    status: 1,
    createAt: "21/3/2002",
    createBy: "Parent",
    studentId: 161307,
    ReasonReject: "Class want to change are already full",
    className: "classname",
    studentName: "name",
    createByName: "createByName",
    statusDescriptions: {
      1: "Pending",
      2: "Processing",
      3: "Approved",
      4: "Rejected",
      // 4: "Cancel",
    },
    filteredStatuses: '',

    showNotification: false, // Để hiển thị thông báo
    notificationText: "", // Nội dung thông báo
    notificationType: "success", // Loại thông báo (success/error)
  };

  async componentDidMount() {
    window.scrollTo(0, 0);
    const { requestId } = this.props.match.params;
    this.setState({ requestId: parseInt(requestId) });
    const userData = getSession('user')?.user;
    const roleId = userData?.roleId;

    const dataRole = this.getFilteredStatusDescriptions(roleId); // Call filtering here
    this.setState({ filteredStatuses: dataRole });
    try {
      // Fetch request details
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/Request/GetRequestById/${requestId}`);
      const data = response.data;

      // Update state with request details
      this.setState({
        requestId: data.requestId,
        title: data.title,
        description: data.description,
        createBy: data.createBy,
        createAt: data.createAt ? new Date(data.createAt).toISOString().slice(0, 10) : "",
        classId: data.classId,
        status: data.statusRequest,
        studentId: data.studentId,
        classChangeId: data.classChangeId,
        ReasonReject: data.processNote || "",
      });

      // Fetch student information
      const studentResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/Children/GetChildrenByChildrenId/${data.studentId}`);
      const studentData = studentResponse.data;

      this.setState(prevState => ({
        ClassRequestChangeInfor: {
          ...prevState.ClassRequestChangeInfor,
          studentName: studentData?.fullName,
        }
      }));

      // Fetch user information
      const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/User/ProfileById/${data.createBy}`);
      const userData = userResponse.data;

      this.setState(prevState => ({
        ClassRequestChangeInfor: {
          ...prevState.ClassRequestChangeInfor,
          createByName: `${userData?.firstname} ${userData?.lastName}`,
        }
      }));


    } catch (error) {
      console.error("Error fetching data: ", error);
      alert("Failed to fetch data. Please try again.");
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    const { requestId, title, description, createBy, createAt, classId, studentId, classChangeId, status, ReasonReject } = this.state;
    try {
      // Make a PUT request to update the request
      await axios.put(`${process.env.REACT_APP_API_URL}/api/Request/UpdateRequest`, {
        requestId,
        title,
        description,
        createBy,
        createAt,
        classId,
        studentId,
        classChangeId,
        statusRequest: status,
        processNote: ReasonReject,
      });
      this.setState({
        notificationText: "Request updated successfully!",
        notificationType: "success",
        showNotification: true,
      });
      console.log(typeof(status));
     

      if (status == 3) {
        addNotificationByUserId("Request Handle", "Request has been approved", createBy)
      }
      if (status == 4) {
        addNotificationByUserId("Request Handle", "Request has been rejected", createBy)
      }
      setTimeout(() => {
        if (this.state.showNotification) {
          this.props.history.push('/request');
        }
      }, 1000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update the request";
      this.setState({
        notificationText: errorMessage,
        notificationType: "error",
        showNotification: true,
      });
    }

  };
  // Function to filter the statuses based on roleId
  getFilteredStatusDescriptions = (roleId) => {
    let filteredStatuses = {};

    // Filter logic based on roleId
    switch (roleId) {
      case 5: // teacher
        filteredStatuses = {
          1: this.state.statusDescriptions[1], // Pending
          2: this.state.statusDescriptions[2], // Processing
          3: this.state.statusDescriptions[3], // Approved
          4: this.state.statusDescriptions[4], // Rejected
        };
        break;

      case 2: // Parent 
        filteredStatuses = {
          1: this.state.statusDescriptions[1], // Pending
        };
        break;

      case 3: // Staff 
        filteredStatuses = {
          2: this.state.statusDescriptions[2], // Processing
          3: this.state.statusDescriptions[3], // Approved
          4: this.state.statusDescriptions[4], // Rejected
        };
        break;

      default:
        filteredStatuses = { 1: this.state.statusDescriptions[1], 6: this.state.statusDescriptions[6] }; // Default to Cancel if no role matches
        break;
    }

    return filteredStatuses;
  };


  render() {
    const { title, description, status, createAt, ClassRequestChangeInfor, changesClassId, ReasonReject, filteredStatuses, statusDescriptions } = this.state;

    const userData = getSession('user')?.user;
    const roleId = userData?.roleId;

    return (
      <div
        style={{ flex: 1 }}
        onClick={() => document.body.classList.remove("offcanvas-active")}
      >
        <div className="container-fluid">
          <PageHeader
            HeaderText="Request Management"
            Breadcrumb={[
              { name: "Request Management", navigate: "request" },
              { name: "Request Update", navigate: "" },
            ]}
          />
          <div className="row clearfix">
            <div className="col-md-12">
              <div className="card">
                <div className="header text-center">
                  <h4>Request Update</h4>
                </div>
                <div className="body">
                  <form className="update-teacher-form" onSubmit={this.handleSubmit}>
                    <div className="row">
                      <div className="form-group col-md-6">
                        <label>Title Request</label>
                        <input className="form-control" value={title} name="title"
                          readOnly={roleId !== 2} // Không readonly nếu roleId = 2 
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <label>Create At</label>
                        <input className="form-control" value={createAt} name="createAt"
                          readOnly={roleId !== 2} // Không readonly nếu roleId = 2 
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="form-group col-md-6">
                        <label>Student</label>
                        <input className="form-control" value={ClassRequestChangeInfor?.studentName} name="studentId"
                          readOnly={roleId !== 2} // Không readonly nếu roleId = 2 
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <label>Created by</label>
                        <input className="form-control" value={ClassRequestChangeInfor?.createByName} name="createBy"
                          readOnly={roleId !== 2} // Không readonly nếu roleId = 2 
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="form-group col-md-6 d-flex flex-column">
                        <label>Request Description</label>
                        <textarea className="form" rows="6" value={description} name="description"
                          readOnly={roleId !== 2} // Không readonly nếu roleId = 2 
                        />
                      </div>
                      <div className="form-group col-md-6 d-flex flex-column">
                        <label>Process Note</label>
                        <textarea className="form" rows="6" value={ReasonReject} name="ReasonReject"
                          onChange={(e) => this.setState({ ReasonReject: e.target.value })}
                          readOnly={roleId === 2} // Không readonly nếu roleId = 2 

                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="form-group col-md-6">
                        <label>Status</label>
                        <select className="form-control" value={status} name="status"
                          onChange={(e) => this.setState({ status: e.target.value })}>
                          {Object.entries(filteredStatuses).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>

                    </div>
                    <div className="text-center">
                      <button type="submit" className="btn btn-primary my-4 text-center">Update Request</button>
                    </div>
                    <br />
                  </form>
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

export default connect(mapStateToProps)((RequestUpdate));
