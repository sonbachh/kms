
import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import axios from "axios";
import { withRouter } from "react-router-dom/cjs/react-router-dom";
import Notification from "../../components/Notification";

class SemesterUpdate extends React.Component {
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
        const { semesterId } = this.props.match.params; // Get categoryServiceId from URL
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/Semester/GetAllSemester`);
                const data = response.data;
                const dataDetail = data?.find(i => i.semesterId == semesterId)
                console.log(dataDetail);
                this.setState({
                    semesterDetail: dataDetail,
                    name: dataDetail.name,
                    status: dataDetail.status,
                    startDate: dataDetail.startDate.split("T")[0],
                    endDate: dataDetail.endDate.split("T")[0],
                });
            } catch (error) {
                console.error('Error fetching category details:', error);
            }
        };

        fetchData();
    };

    handleSubmit = async (event) => {

        event.preventDefault(); // Make sure this is at the top

        const updatedSemester = {
            semesterId: this.state.semesterDetail?.semesterId,
            name: this.state.name,
            status: this.state.status,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
        };
        console.log(updatedSemester);


        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/Semester/UpdateSemester`, updatedSemester, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            this.setState({
                notificationText: "Semester Update successfully!",
                notificationType: "success",
                showNotification: true
            });
            // Delay for 1 second, then redirect
            setTimeout(() => {
                this.props.history.push('/semester');
            }, 1000); // Delay of 1 second (1000ms)
        } catch (error) {
            console.error('Error updating semester:', error);
            this.setState({
                notificationText: "Error Updateing Album!",
                notificationType: "error",
                showNotification: true
            });
        }
    };

    render() {
        const { semesterDetail, name, status, startDate, endDate } = this.state;
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
                <div>
                    <div className="container-fluid">
                        <PageHeader
                            HeaderText="Semester Update"
                            Breadcrumb={[
                                { name: "Semester", navigate: "semester" },
                                { name: "Semester Update", navigate: "" },
                            ]}
                        />
                        <div className="row clearfix">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="body">
                                        <form onSubmit={this.handleSubmit}>
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
                                            <button type="submit" className="btn btn-primary mr-4">Update Semester</button>
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


export default withRouter(SemesterUpdate);
