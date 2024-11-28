import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { withRouter } from 'react-router-dom';
import axios from "axios";
import Notification from "../../components/Notification";
class UpdateClassByPrincipal extends React.Component {
  state = {
    classId: 0,
    className: "",
    isActive: true,
    expireDate: "",
    schoolId: 102,
    semesterId: 0,
    gradeId: 0,
    grades: [],   // Lưu danh sách grade
    semesters: [],  // Lưu danh sách semester
    status: 0,
    submeet: false,
    showNotification: false, // State to control notification visibility
    notificationText: "", // Text for the notification
    notificationType: "success" // Type of notification (success or error)
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    const { classId } = this.props.match.params;
    this.setState({ classId: parseInt(classId) });

    // Gọi API để lấy thông tin lớp học
    axios.get(`${process.env.REACT_APP_API_URL}/api/Class/GetClassById/${classId}`)
      .then((response) => {
        const data = response.data;
        const formattedExpireDate = data.expireDate ? new Date(data.expireDate).toISOString().slice(0, 16) : "";

        this.setState({
          className: data.className,
          isActive: data.isActive === 1,
          expireDate: formattedExpireDate,
          schoolId: data.schoolId,
          semesterId: data.semesterId,
          gradeId: data.gradeId,
          status: data.status,
        });
      })
      .catch((error) => {
        console.error("Error fetching class data: ", error);
        alert("Failed to fetch class data. Please try again.");
      });

    // Gọi API lấy danh sách Grade
    axios.get(`${process.env.REACT_APP_API_URL}/api/Grade`)
      .then((response) => {
        this.setState({ grades: response.data });
      })
      .catch((error) => {
        console.error("Error fetching grade data:", error);
      });

    // Gọi API lấy danh sách Semester
    axios.get(`${process.env.REACT_APP_API_URL}/api/Semester/GetAllSemester`)
      .then((response) => {
        this.setState({ semesters: response.data });
      })
      .catch((error) => {
        console.error("Error fetching semester data:", error);
      });
  }

  // Hàm lấy tên grade theo gradeId
  getGradeName = (gradeId) => {
    const grade = this.state.grades.find(g => g.gradeId === gradeId);
    return grade ? grade.name : "Unknown Grade";
  };

  // Hàm lấy tên semester theo semesterId
  getSemesterName = (semesterId) => {
    const semester = this.state.semesters.find(s => s.semesterId === semesterId);
    return semester ? semester.name : "Unknown Semester";
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { classId, className, isActive, schoolId, semesterId, gradeId, status } = this.state;

    // Kiểm tra dữ liệu trước khi gửi
    if (!className  || schoolId === 0 || semesterId === 0 || gradeId === 0) {
      this.setState({ submeet: true });
      return;
    }

    // Chuẩn bị dữ liệu theo schema
    const updatedClass = {
      classId,
      className,
      number: 0,
      isActive: 1,
      schoolId,
      semesterId,
      gradeId,
      status: status ? 1 : 0,
    };

    // Gọi API để cập nhật lớp học
    axios.put(`${process.env.REACT_APP_API_URL}/api/Class/UpdateClass`, updatedClass, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        this.setState({
          notificationText: "Class has been updated successfully!",
          notificationType: "success",
          showNotification: true
        });    
            this.props.history.push('/viewclass');
      })
      .catch((error) => {
        console.error("Error updating class:", error);
        alert("Failed to update class. Please try again.");
      });
  };

  render() {
    const { className, status, expireDate, submeet, grades, semesters, gradeId, semesterId, showNotification, // State to control notification visibility
      notificationText, // Text for the notification
      notificationType } = this.state;

    return (
      <div
        style={{ flex: 1 }}
        onClick={() => document.body.classList.remove("offcanvas-active")}
      >
        <div>
          <div className="container-fluid">
            <PageHeader
              HeaderText="Class Management"
              Breadcrumb={[
                { name: "Class Management", navigate: "" },
                { name: "Update Class", navigate: "" },
              ]}
            />
             {showNotification && (
              <Notification
                type={notificationType}
                position="top-right"
                dialogText={notificationText}
                show={showNotification}
                onClose={() => this.setState({ showNotification: false })}
              />
            )}
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label>Class Name</label>
                <input
                  className={`form-control ${className === "" && submeet && "parsley-error"}`}
                  value={className}
                  name="className"
                  required=""
                  onChange={(e) => this.setState({ className: e.target.value })}
                />
                {className === "" && submeet && (
                  <ul className="parsley-errors-list filled">
                    <li className="parsley-required">Class name is required.</li>
                  </ul>
                )}
              </div>

              <div className="form-group">
                <label>Status</label>
                <br />
                <label className="fancy-radio">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={status}
                    onChange={() => this.setState({ status: true })}
                  />
                  <span>
                    <i></i>Active
                  </span>
                </label>
                <label className="fancy-radio">
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={!status}
                    onChange={() => this.setState({ status: false })}
                  />
                  <span>
                    <i></i>Inactive
                  </span>
                </label>
              </div>

              {/* <div className="form-group">
                <label>Expire Date</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={expireDate}
                  name="expireDate"
                  required=""
                  onChange={(e) => this.setState({ expireDate: e.target.value })}
                />
                {expireDate === "" && submeet && (
                  <ul className="parsley-errors-list filled">
                    <li className="parsley-required">Expire date is required.</li>
                  </ul>
                )}
              </div> */}

              <div className="form-group">
                <label>Grade</label>
                <select
                  className="form-control"
                  value={gradeId}
                  onChange={(e) => this.setState({ gradeId: parseInt(e.target.value) })}
                >
                  <option value={0}>Select Grade</option>
                  {grades.map((grade) => (
                    <option key={grade.gradeId} value={grade.gradeId}>
                      {grade.name}
                    </option>
                  ))}
                </select>
                {gradeId === 0 && submeet && (
                  <ul className="parsley-errors-list filled">
                    <li className="parsley-required">Grade is required.</li>
                  </ul>
                )}
              </div>

              <div className="form-group">
                <label>Semester</label>
                <select
                  className="form-control"
                  value={semesterId}
                  onChange={(e) => this.setState({ semesterId: parseInt(e.target.value) })}
                >
                  <option value={0}>Select Semester</option>
                  {semesters.map((semester) => (
                    <option key={semester.semesterId} value={semester.semesterId}>
                      {semester.name}
                    </option>
                  ))}
                </select>
                {semesterId === 0 && submeet && (
                  <ul className="parsley-errors-list filled">
                    <li className="parsley-required">Semester is required.</li>
                  </ul>
                )}
              </div>

              <br />
              <button type="submit" className="btn btn-primary">
                Update Class
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ ioTReducer }) => ({
  isSecuritySystem: ioTReducer.isSecuritySystem,
});

export default connect(mapStateToProps)(withRouter(UpdateClassByPrincipal));
