import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import axios from "axios";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import Notification from "../../components/Notification";

class SemesterCreate extends React.Component {

    state = {
        semesterDetail: null,
        name: "",
        status: 1,
        startDate: '',
        endDate: '',

        showNotification: false, // State to control notification visibility
        notificationText: "", // Text for the notification
        notificationType: "success" // Type of notification (success or error)
    };
    componentDidMount() {
        window.scrollTo(0, 0);
    }

    handleCreatSemester = async (event) => {
        event.preventDefault(); // Ngăn hành vi mặc định của form
        const values = {
            name: this.state.name,
            status: this.state.status,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
        };
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/Semester/AddSemester`, values
            );
            this.setState({
                notificationText: "Semester Create successfully!",
                notificationType: "success",
                showNotification: true
            });
            setTimeout(() => {
                if (this.state.showNotification) {
                    this.props.history.push('/semester');
                }
            }, 1000);
        } catch (error) {
            let errorMessage = "An unexpected error occurred!";

            if (error.response?.data) {
                const fullMessage = error.response.data; // Lấy thông báo đầy đủ
                const startIndex = fullMessage.lastIndexOf(":") + 1; // Vị trí bắt đầu từ dấu `:`
                errorMessage = fullMessage.slice(startIndex).trim(); // Lấy phần sau dấu `:` và xóa khoảng trắng
            }
            this.setState({
                notificationText: errorMessage,
                notificationType: "error",
                showNotification: true
            });
        }
    };

    render() {
        const { name, status, endDate, startDate } = this.state;
        const { showNotification, notificationText, notificationType } = this.state;


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
                            HeaderText="Semester Create"
                            Breadcrumb={[
                                { name: "Semester", navigate: "semester" },
                                { name: "Semester Create", navigate: "" },
                            ]}
                        />
                        <div className="row clearfix">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="body">
                                        <form onSubmit={this.handleCreatSemester}>
                                            <div className="form-group">
                                                <label>Semester Name</label>
                                                <input
                                                    className={`form-control`}
                                                    value={name} // Bind value from state
                                                    name="name"
                                                    required
                                                    onChange={(e) => {
                                                        this.setState({
                                                            [e.target.name]: e.target.value,
                                                        });
                                                    }}
                                                />
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label>Start Date</label>
                                                    <input
                                                        className={`form-control`}
                                                        value={startDate} // Bind value from state
                                                        name="startDate"
                                                        type="date"
                                                        required
                                                        onChange={(e) => {
                                                            this.setState({
                                                                [e.target.name]: e.target.value,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label>End Date</label>
                                                    <input
                                                        className={`form-control`}
                                                        value={endDate} // Bind value from state
                                                        name="endDate"
                                                        type="date"
                                                        required
                                                        onChange={(e) => {
                                                            this.setState({
                                                                [e.target.name]: e.target.value,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Status</label>
                                                <br />
                                                <label className="fancy-radio">
                                                    <input
                                                        name="status"
                                                        type="radio"
                                                        value={1}
                                                        checked={status === 1}
                                                        onChange={() => this.setState({ status: 1 })}
                                                    />
                                                    <span>
                                                        <i></i>Enable
                                                    </span>
                                                </label>
                                                <label className="fancy-radio">
                                                    <input
                                                        name="status"
                                                        type="radio"
                                                        value={0}
                                                        checked={status === 0}
                                                        onChange={() => this.setState({ status: 0 })}
                                                    />
                                                    <span>
                                                        <i></i>Disable
                                                    </span>
                                                </label>
                                            </div>
                                            <br />
                                            <br />
                                            <button type="submit" className="btn btn-primary mr-4">Create Semester</button>
                                            <a href="semester" className="btn btn-success text-center">Back to Semester List</a>
                                        </form>
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


export default withRouter(SemesterCreate);
