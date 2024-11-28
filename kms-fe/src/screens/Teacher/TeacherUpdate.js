import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { withRouter } from 'react-router-dom';
import axios from "axios";
import Notification from "../../components/Notification";

class UpdateChildren extends React.Component {
  state = {
    teacherId: 0,
    firstName: "Hoang",
    lastName: "Kiet",
    address: "Thai Binh",
    phone: "0323241545",
    mail: "kiet7cvl@gmail.com",
    gender: 1,
    status: 1,
    dob: "21/3/2002",
    code: "TC101",
    education: "string",
    experience: "string",
    avatar: "https://greekherald.com.au/wp-content/uploads/2020/07/default-avatar.png",

    showNotification: false, // State to control notification visibility
    notificationText: "", // Text for the notification
    notificationType: "success" // Type of notification (success or error)
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    const { teacherId } = this.props.match.params;
    this.setState({ teacherId: parseInt(teacherId) });

    // Gọi API để lấy thông tin học sinh
    axios.get(`${process.env.REACT_APP_API_URL}/api/Teacher/GetTeacherById/${teacherId}`)
      .then((response) => {
        const data = response.data;
        // Cập nhật state với dữ liệu học sinh
        this.setState({
          teacherId: data.teacherId,
          firstName: data.firstname,
          lastName: data.lastName,
          address: data.address,
          dob: data.dob ? new Date(data.dob).toISOString().slice(0, 10) : "", // Chuyển đổi sang định dạng YYYY-MM-DD
          gender: data.gender,
          status: data.status,
          phone: data.phoneNumber || "string",
          mail: data.mail || "string",
          code: data.code || "string",
          education: data.education || "string",
          experience: data.experience || "string",
          avatar: data.avatar || 1,
        });
      })
      .catch((error) => {
        console.error("Error fetching student data: ", error);
        this.setState({
          notificationText: "Failed to fetch Teacher data!",
          notificationType: "error",
          showNotification: true
        });
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { teacherId, name, education, experience } = this.state;

    // Chuẩn bị dữ liệu cập nhật học sinh
    const updatedTeacher = {
      teacherId,
      name,
      education,
      experience,
    };

    // Gọi API cập nhật học sinh
    axios.put(`${process.env.REACT_APP_API_URL}/api/Teacher/StaffUpdateProfileForTeacher`, updatedTeacher, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log("Teacher updated successfully:", response.data);
        this.setState({
          notificationText: "Teacher has been updated successfully!",
          notificationType: "success",
          showNotification: true
        });
        setTimeout(() => {
          this.props.history.push('/teacher');
        }, 1000); // Delay of 1 second (1000ms)
      })
      .catch((error) => {
        console.error("Error updating Teacher:", error.response ? error.response.data : error.message); // Log thêm thông tin lỗi
        this.setState({
          notificationText: "Failed to update Teacher!",
          notificationType: "error",
          showNotification: true
        });
      });
  };


  render() {
    const { firstName, lastName, address, phone, mail, gender, status, dob, code, education, experience, avatar } = this.state;
    const { showNotification, notificationText, notificationType } = this.state;

    return (
      <div
        style={{ flex: 1 }}
        onClick={() => document.body.classList.remove("offcanvas-active")}
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
              HeaderText="Teacher Management"
              Breadcrumb={[
                { name: "Teacher Management", navigate: "teacher" },
                { name: "Update Teacher", navigate: "" },
              ]}
            />
            <div className="row clearfix">
              <div className="col-md-12">
                <div className="card">
                  <div className="header text-center">
                    <h4>Teacher Update</h4>
                  </div>
                  <div className="body">
                    <form onSubmit={this.handleSubmit} className="update-teacher-form">
                      <div className="row">
                        <div className="form-group col-md-6">
                          <label>First Name</label>
                          <input
                            className={`form-control ${firstName === "" && "parsley-error"}`}
                            value={firstName}
                            name="firstName"
                            type="text"
                            readOnly
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label>Last Name</label>
                          <input
                            className={`form-control ${lastName === "" && "parsley-error"}`}
                            value={lastName}
                            name="lastName"
                            type="text"
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="form-group col-md-6">
                          <label>Address</label>
                          <input
                            className={`form-control ${address === "" && "parsley-error"}`}
                            value={address}
                            name="address"
                            type="text"
                            readOnly
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label>Phone</label>
                          <input
                            className={`form-control ${phone === "" && "parsley-error"}`}
                            value={phone}
                            name="phone"
                            type="text"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-group col-md-6">
                          <label>Code</label>
                          <input
                            className="form-control"
                            value={code}
                            name="code"
                            readOnly
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label>Email</label>
                          <input
                            className={`form-control ${mail === "" && "parsley-error"}`}
                            value={mail}
                            name="mail"
                            type="email"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-group col-md-6">
                          <div className="form-group">
                            <label>Gender</label>
                            <select
                              className="form-control"
                              value={gender}
                              name="gender"
                              readOnly
                            >
                              <option value={1}>Male</option>
                              <option value={0}>Female</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Date Of Birth</label>
                            <input
                              className="form-control"
                              type="date"
                              value={dob}
                              name="dob"
                              readOnly
                            />
                          </div>
                          <div className="form-group">
                            <label>Status</label>
                            <select
                              className="form-control"
                              value={status}
                              name="status"
                              readOnly
                            >
                              <option value={1}>Active</option>
                              <option value={0}>Inactive</option>
                            </select>
                          </div>
                        </div>

                        <div className="form-group col-md-6 d-grid">
                          <label>Avatar</label>
                          <img src={avatar} className="img-thumbnail" style={{ maxWidth: "50%", marginLeft: "12%" }} alt="Teacher Avatar"></img>
                        </div>
                      </div>

                      <div className="row">
                        <div className="form-group col-md-6">
                          <label>Educaiton</label>
                          <input
                            className="form-control"
                            value={education}
                            name="education"
                            onChange={(e) => {
                              this.setState({
                                [e.target.name]: e.target.value,
                              });
                            }}
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label>Work Experience</label>
                          <input
                            className="form-control"
                            value={experience}
                            name="experience"
                            onChange={(e) => {
                              this.setState({
                                [e.target.name]: e.target.value,
                              });
                            }}
                          />
                        </div>
                      </div>

                      <div className="text-center">
                        <button type="submit" className="btn btn-primary my-4 text-center">Update Teacher</button>
                      </div>
                      <br />
                    </form>
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

export default connect(mapStateToProps)(withRouter(UpdateChildren));
