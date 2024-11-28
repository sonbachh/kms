import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { withRouter } from "react-router-dom";
import Notification from "../../components/Notification";
class ViewAllChildren extends React.Component {
  state = {
    StudentsData: [], // State để lưu trữ dữ liệu từ API
    Grades: [], // State để lưu trữ danh sách grades

    file: null, // State để lưu trữ file Excel đã chọn
    error: "", // State để lưu trữ thông báo lỗi
    showNotification: false, // State to control notification visibility
    notificationText: "", // Text for the notification
    notificationType: "success" // Type of notification (success or error)
  };

  componentDidMount() {
    window.scrollTo(0, 0);

    // Gọi API để lấy danh sách học sinh
    fetch(`${process.env.REACT_APP_API_URL}/api/Children/GetAllChildren`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ StudentsData: data });
      })
      .catch((error) => {
        console.error("Error fetching students data: ", error);
      });

    // Gọi API để lấy danh sách grades
    fetch(`${process.env.REACT_APP_API_URL}/api/Grade`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ Grades: data });
      })
      .catch((error) => {
        console.error("Error fetching grades data: ", error);
      });
  }

  handleEdit = (studentId) => {
    // Chuyển hướng đến trang cập nhật thông tin học sinh
    this.props.history.push(`/viewstudentbyId/${studentId}`);
  };

  // Xử lý khi người dùng chọn file
  handleFileChange = (e) => {
    this.setState({ file: e.target.files[0], error: "" });
  };

  // Xử lý việc upload file khi người dùng submit form
  handleSubmit = (e) => {
    e.preventDefault();

    const { file } = this.state;

    if (!file) {
      this.setState({ error: "Please choose an Excel file." });
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // Thêm file vào form data

    fetch(`${process.env.REACT_APP_API_URL}/api/Children/ImportChildrenExcel`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("File uploaded successfully:", data);
        // alert("File uploaded successfully!");
        this.setState({
          notificationText: "File uploaded successfully!",
          notificationType: "success",
          showNotification: true
        });

        // Reset trạng thái sau khi upload thành công
        this.setState({ error: "", file: null }); // Reset file về null và xóa thông báo lỗi

        // Cập nhật danh sách học sinh sau khi upload
        return fetch(`${process.env.REACT_APP_API_URL}/api/Children/GetAllChildren`);
      })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ StudentsData: data }); // Cập nhật danh sách học sinh mới
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        // alert("Failed to upload file. Please try again.");
        this.setState({
          notificationText: "FFailed to upload file. Please try again.",
          notificationType: "error",
          showNotification: true
        });
      });
  };

  render() {
    const { StudentsData, error, file, showNotification, // State to control notification visibility
      notificationText,// Text for the notification
      notificationType } = this.state;

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
              HeaderText="Student Management"
              Breadcrumb={[
                { name: "Student Management", navigate: "" },
                { name: "View Students", navigate: "" },
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
                <label>Choose Excel File</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".xls,.xlsx" // Chỉ chấp nhận file Excel
                  onChange={this.handleFileChange}
                />
                {error && <p className="text-danger">{error}</p>}
              </div>
              <button type="submit" className="btn btn-primary">
                Upload Excel File
              </button>
            </form>

            <div className="row clearfix">
              <div className="col-lg-12 col-md-12">
                <div className="card">
                  <div className="body project_report">
                    <div className="table-responsive">
                      <table className="table m-b-0 table-hover">
                        <thead className="thead-light">
                          <tr>
                            <th>Full Name</th>
                            <th>Nick Name</th>
                            <th>Code</th>
                            <th>Grade</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {StudentsData.map((student, index) => {
                            // Tìm grade name dựa trên gradeId
                            const grade = this.state.Grades.find((g) => g.gradeId === student.gradeId);
                            const gradeName = grade ? grade.name : "Unknown"; // Nếu không tìm thấy thì hiển thị "Unknown"
                            const avatar =
                              student.avatar ||
                              "https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"; // Sử dụng ảnh mặc định nếu avatar null

                            return (
                              <React.Fragment key={"student" + index}>
                                <tr>
                                  <td>
                                    <img
                                      src={avatar}
                                      alt="Avatar"
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        marginRight: "10px",
                                      }}
                                    />
                                    {student.fullName}
                                  </td>
                                  <td>{student.nickName}</td>
                                  <td>{student.code}</td>
                                  <td>{gradeName}</td> {/* Hiển thị tên grade */}
                                  <td>
                                    {student.status === 1 ? (
                                      <span className="badge badge-success">Active</span>
                                    ) : (
                                      <span className="badge badge-default">Inactive</span>
                                    )}
                                  </td>
                                  <td className="project-actions">
                                    <a className="btn btn-outline-secondary mr-1">
                                      <i className="icon-eye"></i>
                                    </a>
                                    <a
                                      className="btn btn-outline-secondary"
                                      onClick={() => this.handleEdit(student.studentId)} // Gọi hàm handleEdit
                                    >
                                      <i className="icon-pencil"></i>
                                    </a>
                                    <a className="btn btn-outline-secondary">
                                      <i className="icon-trash"></i>
                                    </a>
                                  </td>
                                </tr>
                              </React.Fragment>
                            );
                          })}
                        </tbody>

                      </table>
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

export default connect(mapStateToProps)(withRouter(ViewAllChildren));
