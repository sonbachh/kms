import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { withRouter } from "react-router-dom";
import axios from "axios";
import Notification from "../../components/Notification";
class ViewStudentById extends React.Component {
  state = {
    studentDetailId: 0,
    classId: 1,
    fullName: "",
    nickName: "",
    gradeId: 0,
    dob: "",
    gender: 1,
    status: 1,
    ethnicGroups: "",
    nationality: "",
    religion: "",
    code: "",
    avatar: "", // URL ảnh từ database
    selectedFile: null, // File được chọn
    parentId: 0, // Parent ID được lấy từ dữ liệu fetch
    grades: [],
    submeet: false,
    showNotification: false, // State to control notification visibility
    notificationText: "", // Text for the notification
    notificationType: "success" // Type of notification (success or error)
  };

  componentDidMount() {
    const { studentID } = this.props.match.params;
    this.setState({ studentDetailId: parseInt(studentID) });

    // Fetch student details
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/Children/GetChildrenByChildrenId/${studentID}`)
      .then((response) => {
        const data = response.data;
        this.setState({
          studentDetailId: data.studentId,
          fullName: data.fullName,
          nickName: data.nickName,
          gradeId: data.gradeId,
          dob: data.dob ? new Date(data.dob).toISOString().slice(0, 10) : "",
          gender: data.gender,
          status: data.status,
          ethnicGroups: data.ethnicGroups || "",
          nationality: data.nationality || "",
          religion: data.religion || "",
          code: data.code || "",
          avatar: data.avatar || "",
          parentId: data.parentId, // Lấy parentId từ dữ liệu fetch
        });
      })
      .catch((error) => {
        alert("Failed to fetch student data. Please try again.");
      });

    // Fetch grades
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/Grade`)
      .then((response) => {
        this.setState({ grades: response.data });
      })
      .catch(() => {
        alert("Failed to fetch grade data. Please try again.");
      });
  }

  handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      this.setState({ selectedFile: file });

      // Hiển thị hình ảnh đã chọn (local preview)
      const reader = new FileReader();
      reader.onload = () => {
        this.setState({ avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const {
      studentDetailId,
      fullName,
      nickName,
      gradeId,
      dob,
      gender,
      status,
      ethnicGroups,
      nationality,
      religion,
      code, // Thay identifier thành code
      avatar,
      selectedFile,
      parentId,
    } = this.state;

    if (!fullName || !dob) {
      this.setState({ submeet: true });
      return;
    }

    try {
      // Nếu có sự thay đổi avatar, gọi API để upload
      if (selectedFile) {
        // Gọi API AddChildrenImage
        const childrenImageFormData = new FormData();
        childrenImageFormData.append("image", selectedFile); // Trường image cho AddChildrenImage

        const childrenImageResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/Children/AddChildrenImage?studentId=${studentDetailId}`,
          childrenImageFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Avatar updated successfully!", childrenImageResponse.data);

        // Gọi API AddPerson
        const personFormData = new FormData();
        personFormData.append("photo", selectedFile); // Trường photo cho AddPerson

        const addPersonResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/Luxand/AddPerson?name=${studentDetailId}&collections=student`,
          personFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Person added to Luxand collection successfully!", addPersonResponse.data);
      }

      // Chuẩn bị dữ liệu JSON để cập nhật thông tin học sinh
      const updatedStudent = {
        studentId: studentDetailId,
        fullName,
        nickName,
        gradeId,
        dob,
        gender,
        status,
        ethnicGroups,
        nationality,
        religion,
        code, // Sử dụng code thay vì identifier
        parentId,
        avatar: "", // Avatar để trống trong request JSON
      };

      // Gọi API UpdateChildren
      await axios.put(`${process.env.REACT_APP_API_URL}/api/Children/UpdateChildren`, updatedStudent, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // alert("Student updated successfully!");
      this.setState({
        notificationText: "Student updated successfully!",
        notificationType: "success",
        showNotification: true
      });

      // this.props.history.push("/viewallstudent");
    } catch (error) {
      console.error("Error updating student:", error.response || error.message);
      // alert("Failed to update student. Please try again.");
      this.setState({
        notificationText: "Failed to update student. Please try again.",
        notificationType: "error",
        showNotification: true
      });
    }
  };


  render() {
    const {
      fullName,
      nickName,
      gradeId,
      dob,
      gender,
      status,
      ethnicGroups,
      nationality,
      religion,
      code,
      avatar,
      grades,
      submeet,
      showNotification, // State to control notification visibility
      notificationText,// Text for the notification
      notificationType
    } = this.state;

    return (
      <div
        style={{ flex: 1 }}
        onClick={() => document.body.classList.remove("offcanvas-active")}
      >
        <div>
          <div className="container-fluid">
            <PageHeader
              HeaderText="Student Management"
              Breadcrumb={[
                { name: "Student Management", navigate: "" },
                { name: "Update Student", navigate: "" },
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
              <div
                className="card-header text-white"
                style={{ backgroundColor: "#48C3B4" }}
              >
                <h4 className="mb-0">Update Student Information</h4>
              </div>
              <div className="card-body">
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <label>Avatar</label>
                    <div className="d-flex align-items-center">
                      {avatar && (
                        <img
                          src={avatar}
                          alt="Avatar"
                          style={{ width: "80px", height: "80px", marginRight: "10px" }}
                          className="rounded-circle border"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control-file"
                        onChange={this.handleFileChange}
                      />
                    </div>
                  </div>
                  <div className="row">

                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Full Name</label>
                        <input
                          required
                          type="text"
                          className={`form-control ${fullName === "" && submeet && "is-invalid"}`}
                          value={fullName}
                          onChange={(e) => this.setState({ fullName: e.target.value })}
                        />
                        {fullName === "" && submeet && (
                          <div className="invalid-feedback">Full name is required.</div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Nick Name</label>
                        <input
                          required
                          type="text"
                          className="form-control"
                          value={nickName}
                          onChange={(e) => this.setState({ nickName: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Grade</label>
                        <select
                          required
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
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Date of Birth</label>
                        <input
                          required
                          type="date"
                          className="form-control"
                          value={dob}
                          onChange={(e) => this.setState({ dob: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Gender</label>
                        <select
                          required
                          className="form-control"
                          value={gender}
                          onChange={(e) => this.setState({ gender: parseInt(e.target.value) })}
                        >
                          <option value={1}>Male</option>
                          <option value={0}>Female</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Status</label>
                        <select
                          required
                          className="form-control"
                          value={status}
                          onChange={(e) => this.setState({ status: parseInt(e.target.value) })}
                        >
                          <option value={1}>Active</option>
                          <option value={0}>Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Ethnic Groups</label>
                        <input
                          required
                          type="text"
                          className="form-control"
                          value={ethnicGroups}
                          onChange={(e) => this.setState({ ethnicGroups: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Nationality</label>
                        <input
                          required
                          type="text"
                          className="form-control"
                          value={nationality}
                          onChange={(e) => this.setState({ nationality: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Religion</label>
                        <input
                          required
                          type="text"
                          className="form-control"
                          value={religion}
                          onChange={(e) => this.setState({ religion: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Code</label>
                        <input
                          disabled
                          type="text"
                          className="form-control"
                          value={code}
                          onChange={(e) => this.setState({ code: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <button type="submit" className="btn btn-primary">
                      Update Student
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

export default connect(mapStateToProps)(withRouter(ViewStudentById));
