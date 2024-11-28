import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { withRouter } from 'react-router-dom';
import { getSession } from "../../components/Auth/Auth";
import { Modal, Button } from "react-bootstrap";
import Notification from "../../components/Notification";


class ViewClassByTeacher extends React.Component {
  state = {
    ProjectsData: [],
    GradesData: [],
    statusFilter: '',
    gradeFilter: '',
    nameFilter: '',

    // Trạng thái cho popup confirm
    showConfirmModal: false,

    showNotification: false, // State to control notification visibility
    notificationText: "", // Text for the notification
    notificationType: "success" // Type of notification (success or error)
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    const user = JSON.parse(sessionStorage.getItem('user'));
    const teacherId = user ? user.user.userId : null;

    if (teacherId) {
      // Gọi API lấy danh sách class theo teacherId
      fetch(`${process.env.REACT_APP_API_URL}/api/Class/GetClassesByTeacherId/${teacherId}`)
        .then((response) => response.json())
        .then((data) => {
          const activeClasses = data.filter(classData => classData.status === 1);
          this.setState({ ProjectsData: activeClasses });
        })
        .catch((error) => {
          console.error("Error fetching class data: ", error);
        });

      // Gọi API lấy danh sách grade
      fetch(`${process.env.REACT_APP_API_URL}/api/Grade`)
        .then((response) => response.json())
        .then((data) => {
          this.setState({ GradesData: data });
        })
        .catch((error) => {
          console.error("Error fetching grade data: ", error);
        });
    } else {
      console.error("Teacher ID không tồn tại trong localStorage.");
    }
  }

  handleEdit = (classId) => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user.user.roleId === 3) {
      this.props.history.push(`/updateclass/${classId}`);
    } else if (user && user.user.roleId === 4) {
      this.props.history.push(`/updateclass2/${classId}`);
    } else {
      console.error("User roleId không hợp lệ hoặc không tồn tại.");
    }
  };

  handleView = (classId) => {
    this.props.history.push(`/viewchildrenbyclassid/${classId}`);
  };

  handleStatusFilterChange = (event) => {
    this.setState({ statusFilter: event.target.value });
  };

  handleGradeFilterChange = (event) => {
    this.setState({ gradeFilter: event.target.value });
  };

  handleNameFilterChange = (event) => {
    this.setState({ nameFilter: event.target.value });
  };

  getGradeName = (gradeId) => {
    const { GradesData } = this.state;
    const grade = GradesData.find((g) => g.gradeId === gradeId);
    return grade ? grade.name : 'N/A';
  };

  // Hàm xử lý khi nhấn "Send Mail Notification"
  handleSendMailNotification = () => {
    this.setState({ showConfirmModal: true });
  };

  handleConfirmSendMail = async () => {
    this.setState({ showConfirmModal: false });

    const { ProjectsData } = this.state; // Giả sử 'nameFilter' là classId

    // Lấy classId từ nameFilter hoặc một nguồn khác
    const classId = ProjectsData[0].classId; // Thay đổi nếu cần thiết
    console.log(classId);

    try {
      // API call sử dụng fetch
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/Class/SendMailToParentsByClassId/${classId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        this.setState({
          notificationText: "Mail sent successfully!",
          notificationType: "success",
          showNotification: true
        });
      }
    } catch (error) {
      this.setState({
        notificationText: "Mail sent Error!",
        notificationType: "error",
        showNotification: true
      });
    }
  };


  // Hàm đóng popup confirm
  handleCloseConfirmModal = () => {
    this.setState({ showConfirmModal: false });
  };

  render() {
    const { ProjectsData, statusFilter, gradeFilter, nameFilter, GradesData, showConfirmModal } = this.state;
    const { showNotification, notificationText, notificationType } = this.state;


    // Lọc dữ liệu theo status, grade, và tên lớp
    const filteredData = ProjectsData.filter(classData => {
      const statusMatch = statusFilter === '' ||
        (statusFilter === 'active' && classData.status === 1) ||
        (statusFilter === 'inactive' && classData.status === 0);

      const gradeMatch = gradeFilter === '' || classData.gradeId === parseInt(gradeFilter);

      const nameMatch = nameFilter === '' || classData.className.toLowerCase().includes(nameFilter.toLowerCase());

      return statusMatch && gradeMatch && nameMatch;
    });
    console.log(ProjectsData);


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
              HeaderText="Class Management"
              Breadcrumb={[
                { name: "Class Management", navigate: "" },
                { name: "View Class", navigate: "" },
              ]}
            />
            <div className="row clearfix">
              <div className="col-lg-12 col-md-12">
                <div className="card">
                  <div className="body project_report">
                    {/* Các bộ lọc trên cùng một dòng */}
                    <div className="form-inline mb-3">
                      <div className="form-group mr-3">
                        <label htmlFor="statusFilter" className="mr-2">Status:</label>
                        <select
                          id="statusFilter"
                          className="form-control"
                          value={statusFilter}
                          onChange={this.handleStatusFilterChange}
                        >
                          <option value="">All</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      <div className="form-group mr-3">
                        <label htmlFor="gradeFilter" className="mr-2">Grade:</label>
                        <select
                          id="gradeFilter"
                          className="form-control"
                          value={gradeFilter}
                          onChange={this.handleGradeFilterChange}
                        >
                          <option value="">All</option>
                          {GradesData.map(grade => (
                            <option key={grade.gradeId} value={grade.gradeId}>
                              {grade.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="nameFilter" className="mr-2">Class Name:</label>
                        <input
                          type="text"
                          id="nameFilter"
                          className="form-control"
                          value={nameFilter}
                          onChange={this.handleNameFilterChange}
                          placeholder="Enter class name"
                        />
                      </div>

                      {/* Button để gửi email */}
                      <button
                        className="btn btn-primary ml-3"
                        onClick={this.handleSendMailNotification}
                      >
                        Send Mail Notification
                      </button>

                      {/* Modal confirm */}
                      <Modal show={showConfirmModal} onHide={this.handleCloseConfirmModal}>
                        <Modal.Header closeButton>
                          <Modal.Title>Confirm Mail Notification</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          Are you sure you want to send mail notifications with the current filters?
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={this.handleCloseConfirmModal}>
                            Cancel
                          </Button>
                          <Button variant="primary" onClick={this.handleConfirmSendMail}>
                            Confirm
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>

                    <div className="table-responsive">
                      <table className="table m-b-0 table-hover">
                        <thead className="thead-light">
                          <tr>
                            <th>Class Name</th>
                            <th>Number</th>
                            <th>Grade</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredData.map((classData, classIndex) => (
                            <React.Fragment key={"class" + classIndex}>
                              <tr>
                                <td>{classData.className}</td>
                                <td>{classData.number}</td>
                                <td>{this.getGradeName(classData.gradeId)}</td>
                                <td>
                                  {classData.status === 1 ? (
                                    <span className="badge badge-success">Active</span>
                                  ) : (
                                    <span className="badge badge-default">Inactive</span>
                                  )}
                                </td>

                                <td className="project-actions">
                                  <a className="btn btn-outline-secondary mr-1"
                                    onClick={() => this.handleView(classData.classId)}
                                  >
                                    <i className="icon-eye"></i>
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
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ ioTReducer }) => ({
  isSecuritySystem: ioTReducer.isSecuritySystem,
});

export default connect(mapStateToProps)(withRouter(ViewClassByTeacher));
