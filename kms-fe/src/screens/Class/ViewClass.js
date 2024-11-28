import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { withRouter } from 'react-router-dom';

class ViewClass extends React.Component {
  state = {
    ProjectsData: [],
    GradesData: [],
    statusFilter: '',
    gradeFilter: '',
    nameFilter: '',
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    fetch(`${process.env.REACT_APP_API_URL}/api/Class/GetAllClass`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ ProjectsData: data });
      })
      .catch((error) => {
        console.error("Error fetching class data: ", error);
      });

    fetch(`${process.env.REACT_APP_API_URL}/api/Grade`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ GradesData: data });
      })
      .catch((error) => {
        console.error("Error fetching grade data: ", error);
      });
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

  formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  getGradeName = (gradeId) => {
    const { GradesData } = this.state;
    const grade = GradesData.find((g) => g.gradeId === gradeId);
    return grade ? grade.name : 'N/A';
  };

  render() {
    const { ProjectsData, statusFilter, gradeFilter, nameFilter, GradesData } = this.state;

    const filteredData = ProjectsData.filter(classData => {
      const statusMatch = statusFilter === '' || 
        (statusFilter === 'active' && classData.status === 1) ||
        (statusFilter === 'inactive' && classData.status === 0);
      
      const gradeMatch = gradeFilter === '' || classData.gradeId === parseInt(gradeFilter);

      const nameMatch = nameFilter === '' || classData.className.toLowerCase().includes(nameFilter.toLowerCase());

      return statusMatch && gradeMatch && nameMatch;
    });

    return (
      <div style={{ flex: 1 }} onClick={() => document.body.classList.remove("offcanvas-active")}>
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
                                  <a className="btn btn-outline-secondary mr-1" onClick={() => this.handleView(classData.classId)}>
                                    <i className="icon-eye"></i>
                                  </a>
                                  <a className="btn btn-outline-secondary mr-1" onClick={() => this.handleEdit(classData.classId)}>
                                    <i className="icon-pencil"></i>
                                  </a>
                                  <a className="btn btn-outline-secondary mr-1">
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

export default connect(mapStateToProps)(withRouter(ViewClass));
