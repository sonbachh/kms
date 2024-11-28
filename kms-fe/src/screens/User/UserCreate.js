import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import axios from "axios";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import Notification from "../../components/Notification";

class UserCreate extends React.Component {

    state = {
        mail: "",
        roleId: "",
        password: '',

        roleMap: {
            1: "Admin",
            2: "Parent",
            3: "Staff",
            4: "Principal",
            5: "Teacher",
        },

        showNotification: false, // State to control notification visibility
        notificationText: "", // Text for the notification
        notificationType: "success" // Type of notification (success or error)
    };
    componentDidMount() {
        window.scrollTo(0, 0);
    }

    handleCreatUser = async (event) => {
        event.preventDefault(); // Ngăn hành vi mặc định của form
        const values = {
            mail: this.state.mail,
            roleId: this.state.roleId,
            password: ''
        };
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/Account/register`, values
            );
            this.setState({
                notificationText: "Account User Create successfully!",
                notificationType: "success",
                showNotification: true
            });
            this.setState({
                mail: "",
                roleId: "",
            });
        } catch (error) {
            // let errorMessage = "An unexpected error occurred!";

            // if (error.response?.data) {
            //     const fullMessage = error.response.data; // Lấy thông báo đầy đủ
            //     const startIndex = fullMessage.lastIndexOf(":") + 1; // Vị trí bắt đầu từ dấu `:`
            //     errorMessage = fullMessage.slice(startIndex).trim(); // Lấy phần sau dấu `:` và xóa khoảng trắng
            // }
            this.setState({
                notificationText: error.response?.data,
                notificationType: "error",
                showNotification: true
            });
        }
    };

    render() {
        const { mail, roleId } = this.state;
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
                            HeaderText="User Create"
                            Breadcrumb={[
                                { name: "User", navigate: "user" },
                                { name: "User Create", navigate: "" },
                            ]}
                        />
                        <div className="row clearfix">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="body">
                                        <form onSubmit={this.handleCreatUser}>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label>Enter Email </label>
                                                    <input
                                                        type="email"
                                                        className={`form-control`}
                                                        value={mail} // Bind value from state
                                                        name="mail"
                                                        required
                                                        onChange={(e) => {
                                                            this.setState({
                                                                [e.target.name]: e.target.value,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label>Select Role</label>
                                                    <select
                                                        className="form-control"
                                                        name="role"
                                                        value={this.state.roleId} // Bind value từ state
                                                        required
                                                        onChange={(e) => {
                                                            this.setState({ roleId: e.target.value });
                                                        }}
                                                    >
                                                        <option value="" >Select a Role</option>
                                                        {Object.entries(this.state.roleMap).map(([key, value]) => (
                                                            <option key={key} value={key}>
                                                                {value}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <br />
                                            <br />
                                            <button type="submit" className="btn btn-primary mr-4">Create User</button>
                                            <a href="user" className="btn btn-success text-center">Back to User List</a>
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


export default withRouter(UserCreate);
