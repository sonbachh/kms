import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import axios from "axios";
import Notification from "../../components/Notification";
import { getSession } from "../../components/Auth/Auth";

class RequestCreate extends React.Component {
    state = {
        requestId: 1,
        title: "",
        description: "",
        statusRequest: 1,
        createAt: new Date().toLocaleDateString(),
        createBy: "Staff",
        studentId: null,
        reason: "",
        childerParent: [],
        studentClasses: null, // Start with null for better control

        showNotification: false, // Để hiển thị thông báo
        notificationText: "", // Nội dung thông báo
        notificationType: "success", // Loại thông báo (success/error)
    };

    componentDidMount() {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            try {
                // Fetch student by ParentID
                const userData = getSession('user')?.user;
                const parentId = userData?.userId;

                const studentResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/Request/GetStudentsByParentId/${parentId}`);
                const studentData = studentResponse.data;
                this.setState({ createBy: parentId });
                this.setState({ childerParent: studentData });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }

    handleStudentChange = async (e) => {
        const studentId = e.target.value;
        this.setState({ studentId });

        try {
            // Fetch classes for the selected student
            const classResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/Class/GetClassesByStudentId/${studentId}`);

            // Ensure that classResponse exists and has valid data
            if (classResponse && classResponse.data && Array.isArray(classResponse.data)) {
                const classData = classResponse.data;

                // If classData is an array with a single object, set it directly; otherwise, set to null
                this.setState({ studentClasses: classData.length === 1 ? classData[0] : null });
            } else {
                // If classResponse is invalid or data is not an array, set studentClasses to null
                this.setState({ studentClasses: null });
            }
        } catch (error) {
            // Log other types of errors (network, server issues, etc.)
            console.error("Error fetching class data:", error);
            this.setState({ studentClasses: null });
        }
    };




    handleCreateRequest = async (e) => {
        e.preventDefault(); // Prevent default form submission
        const { studentId, classChangeId, description, studentClasses, createBy, title, reason } = this.state;

        // Thời gian hiện tại ở UTC
        const nowUTC = new Date();

        // Chuyển đổi sang giờ Việt Nam (UTC+7)
        const nowVietnam = new Date(nowUTC.getTime() + (7 * 60 * 60 * 1000));

        // Chuyển đổi về định dạng ISO
        const createAt = nowVietnam.toISOString().slice(0, 19); // Kết quả là định dạng 'YYYY-MM-DDTHH:mm:ss'

        const newRequest = {
            studentId,
            title,
            createAt,
            createBy,
            statusRequest: 1,
            description,
            reason,
        };
        console.log(newRequest);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/Request/AddRequest`, newRequest);
            this.setState({
                notificationText: "Request created successfully!",
                notificationType: "success",
                showNotification: true,
            });
            setTimeout(() => {
                if (this.state.showNotification) {
                    this.props.history.push('/request');
                }
            }, 1000);
        } catch (error) { 
            const errorMessage = error.response?.data?.message || "Failed to create request!";
            this.setState({
                notificationText: errorMessage,
                notificationType: "error",
                showNotification: true,
            });
        }
    };

    render() {
        const { studentId, childerParent, title, classAll, classChangeId, description, studentClasses } = this.state;
        const { showNotification, notificationText, notificationType } = this.state;


        return (
            <div style={{ flex: 1 }} onClick={() => document.body.classList.remove("offcanvas-active")}>
                {showNotification && (
                    <Notification
                        type={notificationType}
                        position="top-right"
                        dialogText={notificationText}
                        show={showNotification}
                        onClose={() => this.setState({ showNotification: false })}
                    />
                )}
                <div className="container-fluid">
                    <PageHeader
                        HeaderText="New Request"
                        Breadcrumb={[
                            { name: "Request", navigate: "request" },
                            { name: "New Request", navigate: "" },
                        ]}
                    />
                    <div className="row clearfix">
                        <div className="col-lg-12 col-md-12">
                            <div className="card planned_task">
                                <div className="header d-flex justify-content-between">
                                    <h2>Request Manager</h2>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="card">
                                <div className="header text-center">
                                    <h4>Create New Request</h4>
                                </div>
                                <div className="body">
                                    <form onSubmit={this.handleCreateRequest}>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label>Children</label>
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
                                            <div className="form-group col-md-6">
                                                <label>Class Studying</label>
                                                <input
                                                    className="form-control"
                                                    value={studentClasses ? studentClasses.className : ''}
                                                    name="studentClasses"
                                                    required
                                                    type="text"
                                                    readOnly // Making this read-only since it auto-fills based on selection
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="form-group col-md-6 d-flex flex-column">
                                                <label>Tilte</label>
                                                <input
                                                    className="form"
                                                    value={title}
                                                    name="title"
                                                    onChange={(e) => this.setState({ title: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group col-md-12 d-flex flex-column">
                                                <label>Description</label>
                                                <textarea
                                                    className="form"
                                                    rows="6"
                                                    value={description}
                                                    name="description"
                                                    onChange={(e) => this.setState({ description: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <br />
                                        <div className="text-center">
                                            <button type="submit" className="btn btn-success">
                                                Create Request
                                            </button>
                                        </div>
                                    </form>
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

export default connect(mapStateToProps, {})(RequestCreate);
