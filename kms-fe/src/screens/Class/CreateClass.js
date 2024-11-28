import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { withRouter } from "react-router-dom";
import Notification from "../../components/Notification";
class CreateClass extends React.Component {
  state = {
    classId: 0,
    className: "",
    number: 0,
    isActive: 1,
    expireDate: "",
    schoolId: 1,
    semesterId: 0,
    gradeId: 0,
    status: 0,
    submeet: false,
    semesters: [],
    grades: [],
    teachers: [],
    selectedTeachers: [],
    errors: {}, // Thêm `errors` vào state
    showNotification: false, // State to control notification visibility
    notificationText: "", // Text for the notification
    notificationType: "success" // Type of notification (success or error)
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.fetchData();
  }

  fetchData = () => {
    Promise.all([
      fetch(`${process.env.REACT_APP_API_URL}/api/Semester/GetAllSemester`).then((res) => res.json()),
      fetch(`${process.env.REACT_APP_API_URL}/api/Grade`).then((res) => res.json()),
      fetch(`${process.env.REACT_APP_API_URL}/api/Teacher/GetAllTeachers`).then((res) => res.json()),
    ])
      .then(([semesters, grades, teachers]) => {
        const activeSemesters = semesters.filter((semester) => semester.status === 0);
        const validTeachers = teachers.filter((teacher) => teacher.name?.trim());
        this.setState({
          semesters: activeSemesters,
          grades,
          teachers: validTeachers,
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data.");
      });
  };

  validateForm = () => {
    const { className, number, semesterId, gradeId, selectedTeachers } = this.state;

    const errors = {};

    if (!className.trim()) errors.className = "Class name is required.";
    if (number <= 0) errors.number = "Number of students must be greater than 0.";
    if (semesterId === 0) errors.semesterId = "Semester must be selected.";
    if (gradeId === 0) errors.gradeId = "Grade must be selected.";
    if (selectedTeachers.length === 0) errors.selectedTeachers = "At least one teacher must be selected.";

    this.setState({ errors, submeet: true });

    return Object.keys(errors).length === 0; // Returns true if no errors
  };

  // handleSubmit = (e) => {
  //   e.preventDefault();

  //   const isValid = this.validateForm();
  //   if (!isValid) {
  //     return;
  //   }

  //   const { className, number, isActive, schoolId, semesterId, gradeId, selectedTeachers } = this.state;

  //   const newClass = {
  //     classId: 0,
  //     className,
  //     number,
  //     isActive,
  //     schoolId,
  //     semesterId,
  //     gradeId,
  //     status: 0,
  //   };

  //   fetch("${process.env.REACT_APP_API_URL}/api/Class/AddClass", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(newClass),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const classId = data.classId;

  //       this.setState({
  //         notificationText: "Class has been added successfully!",
  //         notificationType: "success",
  //         showNotification: true
  //       });
  //       selectedTeachers.forEach((teacherId) => {
  //         fetch(`${process.env.REACT_APP_API_URL}/api/Class/AddTeacherToClass?classId=${classId}&teacherId=${teacherId}`, {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         })
  //           .then((res) => res.json())
  //           .then((result) => console.log(`Teacher ${teacherId} added to class successfully`, result))
  //           .catch((error) => console.error("Error adding teacher to class:", error));
  //       });

  //       this.props.history.push("/viewclass");
  //       this.resetForm();
  //     })
  //     .catch((error) => {
  //       console.error("Error adding class:", error);
  //       alert("Failed to add class. Please try again.");
  //     });
  // };
  handleSubmit = (e) => {
    e.preventDefault();

    const isValid = this.validateForm();
    if (!isValid) {
      return;
    }

    const { className, number, isActive, schoolId, semesterId, gradeId, selectedTeachers } = this.state;

    const newClass = {
      classId: 0,
      className,
      number,
      isActive,
      schoolId,
      semesterId,
      gradeId,
      status: 0,
    };

    fetch(`${process.env.REACT_APP_API_URL}/api/Class/AddClass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newClass),
    })
      .then((response) => response.json())
      .then((data) => {
        const classId = data.classId;

        // Hiển thị thông báo
        this.setState({
          notificationText: "Class has been added successfully!",
          notificationType: "success",
          showNotification: true,
        });

        // Thêm giáo viên vào lớp
        selectedTeachers.forEach((teacherId) => {
          fetch(`${process.env.REACT_APP_API_URL}/api/Class/AddTeacherToClass?classId=${classId}&teacherId=${teacherId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((res) => res.json())
            .then((result) => console.log(`Teacher ${teacherId} added to class successfully`, result))
            .catch((error) => console.error("Error adding teacher to class:", error));
        });

        // Trì hoãn chuyển hướng 2 giây để hiển thị thông báo
        setTimeout(() => {
          this.props.history.push("/viewclass");
          this.resetForm();
        }, 2000); // 2000ms = 2 giây
      })
      .catch((error) => {
        console.error("Error adding class:", error);
        this.setState({
          notificationText: "Failed to add class. Please try again.",
          notificationType: "error",
          showNotification: true,
        });
      });
  };

  resetForm = () => {
    this.setState({
      classId: 0,
      className: "",
      number: 0,
      isActive: 1,
      expireDate: "",
      schoolId: 1,
      semesterId: 0,
      gradeId: 0,
      status: 0,
      submeet: false,
      selectedTeachers: [],
      errors: {}, // Reset errors
    });
  };

  render() {
    const { className, number, semesterId, gradeId, semesters, grades, teachers, selectedTeachers, errors, submeet, showNotification, // State to control notification visibility
      notificationText, // Text for the notification
      notificationType // Type of notification (success or error) 
    } = this.state;

    return (
      <div style={{ flex: 1 }} onClick={() => document.body.classList.remove("offcanvas-active")}>
        <div>
          <div className="container-fluid">
            <PageHeader
              HeaderText="Class Management"
              Breadcrumb={[
                { name: "Class Management", navigate: "" },
                { name: "Create Class", navigate: "" },
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
           
            <div className="card shadow-lg">
              <div className="card-header text-white" style={{ backgroundColor: "#48C3B4" }}>
                <h4 className="mb-0">Create Class</h4>
              </div>
              <div className="card-body">
                <form onSubmit={this.handleSubmit}>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Class Name</label>
                        <input
                          className={`form-control ${errors.className && submeet ? "is-invalid" : ""}`}
                          value={className}
                          onChange={(e) => this.setState({ className: e.target.value })}
                        />
                        {errors.className && submeet && <div className="invalid-feedback">{errors.className}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Number of Students</label>
                        <input
                          type="number"
                          className={`form-control ${errors.number && submeet ? "is-invalid" : ""}`}
                          value={number}
                          onChange={(e) => this.setState({ number: parseInt(e.target.value) || 0 })}
                        />
                        {errors.number && submeet && <div className="invalid-feedback">{errors.number}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Grade</label>
                        <select
                          className={`form-control ${errors.gradeId && submeet ? "is-invalid" : ""}`}
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
                        {errors.gradeId && submeet && <div className="invalid-feedback">{errors.gradeId}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Semester</label>
                        <select
                          className={`form-control ${errors.semesterId && submeet ? "is-invalid" : ""}`}
                          value={semesterId}
                          onChange={(e) => this.setState({ semesterId: parseInt(e.target.value) })}
                        >
                          <option value={0}>Select Semester</option>
                          {semesters.map((semester) => (
                            <option key={semester.semesterId} value={semester.semesterId}>
                              {semester.name} ({semester.startDate.split("T")[0]} - {semester.endDate.split("T")[0]})
                            </option>
                          ))}
                        </select>
                        {errors.semesterId && submeet && <div className="invalid-feedback">{errors.semesterId}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                      <label>Select Teacher</label>
                <select
                  className={`form-control ${errors.selectedTeachers && submeet ? "is-invalid" : ""}`}
                  value={selectedTeachers[0] || ""}
                  onChange={(e) => this.setState({ selectedTeachers: [parseInt(e.target.value)] })}
                >
                  <option value="">Select a Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.teacherId} value={teacher.teacherId}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
                {errors.selectedTeachers && submeet && <div className="invalid-feedback">{errors.selectedTeachers}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <button type="submit" className="btn btn-primary">
                      Add Class
                    </button>
                  </div>
                </form>
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

export default connect(mapStateToProps)(withRouter(CreateClass));
