import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { withRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap nếu chưa có

class ViewChildrenByClassID extends React.Component {
  state = {
    StudentsData: [],
    GradesData: [],
    searchTerm: "",
    hoveredImageSrc: null, // State để lưu URL ảnh được hover
    hoveredImagePosition: { top: 0, left: 0 }, // State để lưu vị trí của ảnh được hover
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    const classId = this.props.match.params.classId;

    // Gọi API để lấy danh sách học sinh
    fetch(`${process.env.REACT_APP_API_URL}/api/Class/GetChildrenByClassId/${classId}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ StudentsData: data });
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });

    // Gọi API để lấy danh sách grade
    fetch(`${process.env.REACT_APP_API_URL}/api/Grade`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ GradesData: data });
      })
      .catch((error) => {
        console.error("Error fetching grades: ", error);
      });
  }

  handleEdit = (studentId) => {
    this.props.history.push(`/viewstudentbyId/${studentId}`);
  };

  handleSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  };

  handleMouseEnter = (src, event) => {
    // Lấy vị trí của ảnh nhỏ và lưu vào state
    const rect = event.target.getBoundingClientRect();
    this.setState({
      hoveredImageSrc: src,
      hoveredImagePosition: {
        top: rect.top,
        left: rect.right + 10, // Hiển thị ảnh lớn ngay bên cạnh ảnh nhỏ
      },
    });
  };

  handleMouseLeave = () => {
    this.setState({ hoveredImageSrc: null });
  };

  render() {
    const { StudentsData, GradesData, searchTerm, hoveredImageSrc, hoveredImagePosition } = this.state;

    const filteredStudents = StudentsData.filter((student) =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getGradeName = (gradeID) => {
      
      const grade = GradesData.find((g) => g.gradeId === gradeID);
  
      return grade ? grade.name : "Unknown"; // Sử dụng "name" thay vì "Name"
  };
  

    return (
      <div
        style={{ flex: 1 }}
        onClick={() => {
          document.body.classList.remove("offcanvas-active");
        }}
      >
        <div className="container-fluid">
          <PageHeader
            HeaderText="Student Management"
            Breadcrumb={[
              { name: "Student Management", navigate: "" },
              { name: "View Students", navigate: "" },
            ]}
          />

          <div className="row clearfix">
            <div className="col-lg-12 col-md-12">
              <div className="card">
                <div className="body project_report">
                  <input
                    type="text"
                    placeholder="Search by full name..."
                    value={searchTerm}
                    onChange={this.handleSearchChange}
                    className="form-control mb-3"
                  />

                  <div className="table-responsive">
                    <table className="table m-b-0 table-hover">
                      <thead className="thead-light">
                        <tr>
                          <th>Full Name</th>
                          <th>Nick Name</th>
                          <th>Code</th>
                          <th>Grade</th>
                          <th>Date of birth</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((student, index) => (
                          <React.Fragment key={"student" + index}>
                            <tr>
                              <td>
                                <div className="d-flex align-items-center position-relative">
                                  <img
                                    src="https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"
                                    alt="Profile"
                                    className="img-fluid rounded-circle"
                                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                    onMouseEnter={(e) =>
                                      this.handleMouseEnter(
                                        "https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg",
                                        e
                                      )
                                    }
                                    onMouseLeave={this.handleMouseLeave}
                                  />
                                  <span className="ml-2">{student.fullName}</span>
                                </div>
                              </td>
                              <td>{student.nickName}</td>
                              <td>{student.code}</td>
                              <td>{getGradeName(student.gradeId)}</td>
                              <td>
                                {new Date(student.dob).toLocaleDateString("vi-VN", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })}
                              </td>
                              <td>
                                {student.status === 1 ? (
                                  <span className="badge badge-success">Active</span>
                                ) : (
                                  <span className="badge badge-secondary">Inactive</span>
                                )}
                              </td>
                              <td className="project-actions">
                                <a className="btn btn-outline-secondary mr-1">
                                  <i className="icon-eye"></i>
                                </a>
                                <a
                                  className="btn btn-outline-secondary"
                                  onClick={() => this.handleEdit(student.studentId)}
                                >
                                  <i className="icon-pencil"></i>
                                </a>
                                <a className="btn btn-outline-secondary">
                                  <i className="icon-trash"></i>
                                </a>
                              </td>
                            </tr>
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hiển thị ảnh lớn khi hover */}
        {hoveredImageSrc && (
          <div
            className="hovered-image-container"
            style={{
              position: "absolute",
              top: hoveredImagePosition.top,
              left: hoveredImagePosition.left,
              zIndex: 1000,
              backgroundColor: "#fff",
              borderRadius: "10px",
              padding: "10px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
            }}
          >
            <img
              src={hoveredImageSrc}
              alt="Hovered Profile"
              className="img-fluid"
              style={{
                maxWidth: "150px",
                borderRadius: "10px",
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ ioTReducer }) => ({
  isSecuritySystem: ioTReducer.isSecuritySystem,
});

export default connect(mapStateToProps)(withRouter(ViewChildrenByClassID));
