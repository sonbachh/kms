import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
// import { withRouter } from 'react-router-dom';
import axios from "axios";

class RequestDetail extends React.Component {
  state = {
    requestId: 1,
    title: "Change Class",
    description: "Want to change class for my children",
    status: 1,
    createAt: "21/3/2002",
    createBy: "Parent",
    studentId: null,
    ReasonReject: "Class want to change are already full",
    studentName: "name",
    createByName: "createByName"

  };

  async componentDidMount() {
    window.scrollTo(0, 0);
    const { requestId } = this.props.match.params;
    this.setState({ requestId: parseInt(requestId) });

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
        status: data.statusRequest,
        studentId: data.studentId,
        ReasonReject: data.processNote || "",
      });

      // Fetch student information
      const studentResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/Children/GetChildrenByChildrenId/${data.studentId}`);
      const studentData = studentResponse.data;
      this.setState({ studentName: studentData?.fullName });

      // Fetch user information
      const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/User/ProfileById/${data.createBy}`);
      const userData = userResponse.data;
      this.setState({ createByName: `${userData?.firstname} ${userData?.lastName}` });

    } catch (error) {
      console.error("Error fetching data: ", error);
      alert("Failed to fetch data. Please try again.");
    }
  }

  render() {
    const { title, description, status, createAt, studentName, createByName, ReasonReject } = this.state;
    const statusDescriptions = {
      1: "Pending",
      2: "Processing",
      3: "Approved ",
      4: "Rejected",
    };

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
              { name: "Request Detail", navigate: "" },
            ]}
          />
          <div className="row clearfix">
            <div className="col-md-12">
              <div className="card">
                <div className="header text-center">
                  <h4>Request Detail</h4>
                </div>
                <div className="body">
                  <form className="update-teacher-form">
                    <div className="row">
                      <div className="form-group col-md-6">
                        <label>Title Request</label>
                        <input className="form-control" value={title} name="title" readOnly />
                      </div>
                      <div className="form-group col-md-6">
                        <label>Create At</label>
                        <input className="form-control" value={createAt} name="createAt" readOnly />
                      </div>
                    </div>

                    <div className="row">
                      <div className="form-group col-md-6">
                        <label>Student</label>
                        <input className="form-control" value={studentName} name="studentId" readOnly />
                      </div>
                      <div className="form-group col-md-6">
                        <label>Created by</label>
                        <input className="form-control" value={createByName} name="createBy" readOnly />
                      </div>
                    </div>

                    <div className="row">
                      <div className="form-group col-md-6 d-flex flex-column">
                        <label>Request Description</label>
                        <textarea className="form" rows="6" value={description} name="description" readOnly />
                      </div>
                      <div className="form-group col-md-6 d-flex flex-column">
                        <label>Process Note</label>
                        <textarea className="form" rows="6" value={ReasonReject} name="ReasonReject" readOnly />
                      </div>
                    </div>

                    <div className="row">
                      <div className="form-group col-md-6">
                        <label>Status</label>
                        <select className="form-control" value={status} name="status" readOnly>
                          {Object.entries(statusDescriptions).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <br />
                  </form>
                </div>

                <div className="text-center pb-4">
                  <a href="/request" class="btn btn-success text-white">Back to list Request</a>
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

export default connect(mapStateToProps)((RequestDetail));
