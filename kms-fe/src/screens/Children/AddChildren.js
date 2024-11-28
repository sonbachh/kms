import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { withRouter } from "react-router-dom";
import axios from "axios";
import Notification from "../../components/Notification";
class CreateChildren extends React.Component {
  state = {
    studentId: 0,
    code: "",
    fullName: "",
    nickName: "",
    grade: 0,
    dob: "",
    gender: 0,
    status: 0,
    ethnicGroups: "",
    nationality: "",
    religion: "",
    parentId: 0,
    parentSearch: "", // Tìm kiếm Parent
    parentSuggestions: [], // Gợi ý Parent
    showSuggestions: false, // Điều khiển hiển thị dropdown
    avatar: "", // URL ảnh
    selectedFile: null, // Chọn file ảnh
    submeet: false,
    grades: [], // Chứa danh sách grades
    usersWithRole3: [], // Danh sách user có roleId là 3
    showNotification: false, // State to control notification visibility
    notificationText: "", // Text for the notification
    notificationType: "success" // Type of notification (success or error)
  };

  componentDidMount() {
    window.scrollTo(0, 0);

    // Fetch grades
    fetch(`${process.env.REACT_APP_API_URL}/api/Grade`)
      .then((res) => res.json())
      .then((grades) => {
        this.setState({ grades });
      })
      .catch((error) => {
        console.error("Error fetching grades: ", error);
        alert("Failed to fetch grades.");
      });

    // Fetch users with roleId = 3
    fetch(`${process.env.REACT_APP_API_URL}/api/User`)
      .then((res) => res.json())
      .then((users) => {
        const usersWithRole3 = users.filter((user) => user.roleId === 2);
        this.setState({ usersWithRole3 });
      })
      .catch((error) => {
        console.error("Error fetching users: ", error);
        alert("Failed to fetch users.");
      });
  }

  handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      this.setState({ selectedFile: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.setState({ avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  handleParentSearch = (e) => {
    const searchValue = e.target.value;
    const { usersWithRole3 } = this.state;

    const parentSuggestions = usersWithRole3.filter((user) =>
      `${user.firstname} ${user.lastName}`
        .toLowerCase()
        .includes(searchValue.toLowerCase())
    );

    this.setState({
      parentSearch: searchValue,
      parentSuggestions,
      showSuggestions: true, // Hiển thị dropdown
    });
  };


  handleParentSelect = (userId, fullName) => {
    this.setState({
      parentId: userId,
      parentSearch: fullName,
      showSuggestions: false, // Đóng dropdown
    });
  };


  handleSubmit = async (e) => {
    e.preventDefault();
    const {
      studentId,
      code,
      fullName,
      nickName,
      grade,
      dob,
      gender,
      status,
      ethnicGroups,
      nationality,
      religion,
      parentId,
      selectedFile,

    } = this.state;

    if (!fullName || !dob || parentId === 0) {
      this.setState({ submeet: true });
      return;
    }
    console.log("test");

    try {
      // Bước 1: Gọi API để tạo học sinh
      const newStudent = {
        studentId,
        code: "",
        fullName,
        nickName,
        gradeId: grade,
        dob,
        gender,
        ethnicGroups,
        nationality,
        religion,
        parentId,
        avatar: "", // Tạm thời để trống, sẽ được cập nhật qua API AddChildrenImage
      };

      const createStudentResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/Children/AddChildren`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStudent),
      });

      const createdStudent = await createStudentResponse.json();
      const newStudentId = createdStudent.studentId;

      this.setState({
        notificationText: `Student created successfully`,
        notificationType: "success",
        showNotification: true
      });
      // Bước 2: Nếu có ảnh, gọi thêm 2 API
      if (selectedFile) {
        // API AddChildrenImage
        const childrenImageFormData = new FormData();
        childrenImageFormData.append("image", selectedFile);

        const addImageResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/Children/AddChildrenImage?studentId=${newStudentId}`,
          {
            method: "POST",
            body: childrenImageFormData,
          }
        );

        const imageResult = await addImageResponse.json();
        // console.log("Avatar added successfully:", imageResult);
        this.setState({
          notificationText: "Avatar added successfully",
          notificationType: "success",
          showNotification: true
        });
        // API AddPerson
        const personFormData = new FormData();
        personFormData.append("photo", selectedFile); // Trường photo cho AddPerson
        console.log(newStudent, "fđs");
        console.log(selectedFile, "sd");
        try {
          const addPersonResponse = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/Luxand/AddPerson?name=${newStudentId}&collections=student`,
            personFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log("Person added successfully:", addPersonResponse.data);

          // Cập nhật thông báo thành công
          this.setState({
            notificationText: "Person added successfully!",
            notificationType: "success",
            showNotification: true,
          });
        } catch (error) {
          console.error("Error adding person:", error);

          // Cập nhật thông báo lỗi
          this.setState({
            notificationText: `Error adding person: ${error.response?.data?.message || error.message}`,
            notificationType: "error",
            showNotification: true,
          });
        }




      }

      this.setState({
        notificationText: "Student has been added successfully!",
        notificationType: "success",
        showNotification: true
      });
      // Reset form
      this.setState({
        studentId: 0,
        code: "",
        fullName: "",
        nickName: "",
        grade: 0,
        dob: "",
        gender: 0,
        status: 0,
        ethnicGroups: "",
        nationality: "",
        religion: "",
        parentId: 0,
        avatar: "",
        selectedFile: null,
        submeet: false,
      });

      // Chuyển hướng đến danh sách học sinh
      this.props.history.push("/viewallstudent");
    } catch (error) {
      console.error("Error adding student:", error);
      // alert("Failed to add student. Please try again.");
      this.setState({
        notificationText: "Failed to add student. Please try again.",
        notificationType: "error",
        showNotification: true
      });
    }
  };

  render() {
    const {
      fullName,
      nickName,
      code,
      grade,
      dob,
      gender,
      status,
      ethnicGroups,
      nationality,
      religion,
      parentSearch,
      parentSuggestions,
      showSuggestions,
      avatar,
      grades,
      submeet,
      showNotification, // State to control notification visibility
      notificationText,// Text for the notification
      notificationType
    } = this.state;

    return (
      <div style={{ flex: 1 }} onClick={() => document.body.classList.remove("offcanvas-active")}>
        <div>
          <div className="container-fluid">
            <PageHeader
              HeaderText="Student Management"
              Breadcrumb={[
                { name: "Student Management", navigate: "/viewallstudent" },
                { name: "Create Student", navigate: "" },
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
                <h4 className="mb-0">Create Student</h4>
              </div>
              <div className="card-body">
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <label>Avatar</label>
                    <div className="d-flex align-items-center">
                      {avatar && (
                        <img
                          src={avatar}
                          alt="Avatar Preview"
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
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Parent ID (Search by Name)</label>
                        <input
                          required
                          type="text"
                          className="form-control"
                          value={parentSearch}
                          onChange={this.handleParentSearch}
                          onFocus={() => this.setState({ showSuggestions: true })}
                        />
                        {showSuggestions && parentSuggestions.length > 0 && (
                          <div className="dropdown-menu show" style={{ maxHeight: "200px", overflowY: "auto" }}>
                            {parentSuggestions.map((user) => (
                              <button
                                type="button"
                                key={user.userId}
                                className="dropdown-item"
                                onClick={() =>
                                  this.handleParentSelect(
                                    user.userId,
                                    `${user.firstname} ${user.lastName}`
                                  )
                                }
                              >
                                {user.firstname} {user.lastName}
                              </button>
                            ))}
                          </div>
                        )}
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
                          value={grade}
                          onChange={(e) => this.setState({ grade: parseInt(e.target.value) })}
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
                        <label>Gender</label>
                        <select
                          required
                          className="form-control"
                          value={gender}
                          onChange={(e) => this.setState({ gender: parseInt(e.target.value) })}
                        >
                          <option value={0}>Female</option>
                          <option value={1}>Male</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
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

                  </div>



                  <div className="text-right">
                    <button type="submit" className="btn btn-primary">
                      Add Student
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

export default connect(mapStateToProps)(withRouter(CreateChildren));
