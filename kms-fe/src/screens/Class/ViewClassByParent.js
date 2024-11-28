import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { withRouter } from 'react-router-dom';
import axios from "axios";

class ViewMenuByTeacherAndParent extends React.Component {
    state = {
        studentId: '',
        childerParent: [],
        studentClasses: [],
        GradesData: [],
        statusFilter: '',
        gradeFilter: '',
        nameFilter: '',
    };

    componentDidMount() {
        window.scrollTo(0, 0);

        const user = JSON.parse(sessionStorage.getItem('user'));
        const parentID = user.user.userId;

        if (!parentID) {
            console.error("Parent ID not found");
            return;
        }

        // Gọi API để lấy danh sách con theo parentID
        axios.get(`${process.env.REACT_APP_API_URL}/api/Request/GetStudentsByParentId/${parentID}`)
            .then(response => {
                this.setState({ childerParent: response.data });
            })
            .catch(error => {
                console.error("Error fetching student data:", error);
            });

        // Gọi API để lấy danh sách grade
        axios.get(`${process.env.REACT_APP_API_URL}/api/Grade`)
            .then(response => {
                this.setState({ GradesData: response.data });
            })
            .catch(error => {
                console.error("Error fetching grade data:", error);
            });
    }

    handleStudentChange = async (e) => {
        const studentId = e.target.value;
        this.setState({ studentId });
        try {
            const classResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/Class/GetClassesByStudentId/${studentId}`);
            const classData = classResponse.data;
            this.setState({ studentClasses: classData });
        } catch (error) {
            console.error("Error fetching class data:", error);
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

    render() {
        const { childerParent, studentId, studentClasses, statusFilter, gradeFilter, nameFilter, GradesData } = this.state;

        // Lọc dữ liệu theo các tiêu chí
        const filteredData = studentClasses.filter(classData => {
            const statusMatch = statusFilter === '' || 
                (statusFilter === 'active' && classData.status === 1) ||
                (statusFilter === 'inactive' && classData.status === 0);

            const gradeMatch = gradeFilter === '' || classData.gradeId === parseInt(gradeFilter);

            const nameMatch = nameFilter === '' || classData.className.toLowerCase().includes(nameFilter.toLowerCase());

            return statusMatch && gradeMatch && nameMatch;
        });

        return (
            <div style={{ flex: 1 }} onClick={() => { document.body.classList.remove("offcanvas-active"); }}>
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

                                    {/* Dropdown để chọn học sinh */}
                                    <div className="form-group">
                                        <label>Choose Your Children</label>
                                        <select
                                            className="form-control"
                                            value={studentId}
                                            name="studentId"
                                            required
                                            onChange={this.handleStudentChange}
                                        >
                                            <option value="">Choose Student</option>
                                            {childerParent.map((option) => (
                                                <option key={option.studentId} value={option.studentId}>
                                                    {option.fullName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Các bộ lọc */}
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

                                    {/* Hiển thị thông tin lớp học của học sinh đã chọn */}
                                    {filteredData.length > 0 ? (
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
                                                        <tr key={"class" + classIndex}>
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
                                                                <button 
                                                                    className="btn btn-outline-secondary mr-1"
                                                                    onClick={() => this.handleView(classData.classId)}
                                                                >
                                                                    <i className="icon-eye"></i> View
                                                                </button>
                                                                <button className="btn btn-outline-secondary">
                                                                    <i className="icon-trash"></i> Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p>No classes found matching the criteria.</p>
                                    )}

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

export default connect(mapStateToProps)(withRouter(ViewMenuByTeacherAndParent));
