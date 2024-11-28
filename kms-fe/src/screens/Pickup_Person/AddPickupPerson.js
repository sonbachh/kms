import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { withRouter } from "react-router-dom";
import Notification from "../../components/Notification";
class AddPickupPerson extends React.Component {
    state = {
        name: "",
        phoneNumber: "",
        avatar: null, // Dùng để lưu file ảnh
        submeet: false,
        showNotification: false, // State to control notification visibility
        notificationText: "", // Text for the notification
        notificationType: "success" // Type of notification (success or error)
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const { name, phoneNumber, avatar } = this.state;

        // Lấy parentId từ localStorage
        const user = JSON.parse(sessionStorage.getItem('user'));
        const parentId = user.user.userId;

        if (!parentId) {
            alert("User ID is missing in localStorage!");
            return;
        }

        // Kiểm tra dữ liệu trước khi gửi
        if (!name || !phoneNumber || !avatar) {
            this.setState({ submeet: true });
            return;
        }

        // Xây dựng URL với query parameters
        const url = `${process.env.REACT_APP_API_URL}/api/PickupPerson/AddPickupPerson?name=${encodeURIComponent(
            name
        )}&phoneNumber=${encodeURIComponent(phoneNumber)}&parentId=${encodeURIComponent(parentId)}`;

        // Chuẩn bị FormData để gửi file ảnh
        const formData = new FormData();
        formData.append("photo", avatar); // Thêm file ảnh vào FormData

        // Gửi yêu cầu API
        fetch(url, {
            method: "POST",
            body: formData, // FormData chứa ảnh
        })
            .then((response) => {
                if (response.ok) {
                    // alert("Pickup person has been added successfully!");
                    this.setState({
                        notificationText: "Pickup person has been added successfully!!",
                        notificationType: "success",
                        showNotification: true
                    });
                    // this.props.history.push("/viewpickup");
                    this.setState({
                        name: "",
                        phoneNumber: "",
                        avatar: null,
                        submeet: false,
                    });
                } else {
                    return response.json().then((data) => {
                        throw new Error(data.message || "Failed to add pickup person.");
                    });
                }
            })
            .catch((error) => {
                console.error("Error adding pickup person:", error);
                alert(error.message || "Failed to add pickup person. Please try again.");
            });
    };



    render() {
        const { name, phoneNumber, avatar, submeet, showNotification, // State to control notification visibility
            notificationText, // Text for the notification
            notificationType } = this.state;

        // return (
        //     <div style={{ flex: 1 }} onClick={() => document.body.classList.remove("offcanvas-active")}>
        //         <div className="container my-5">
        //             <PageHeader
        //                 HeaderText="Pickup Management"
        //                 Breadcrumb={[
        //                     { name: "Pickup Management", navigate: "/viewpickup" },
        //                     { name: "Add Pickup Person", navigate: "" },
        //                 ]}
        //             />
        //             {showNotification && (
        //                 <Notification
        //                     type={notificationType}
        //                     position="top-right"
        //                     dialogText={notificationText}
        //                     show={showNotification}
        //                     onClose={() => this.setState({ showNotification: false })}
        //                 />
        //             )} 
        //             <form onSubmit={this.handleSubmit}>
        //                 <div className="form-group w-50">
        // <label>Name</label>
        // <input
        //     className={`form-control ${name === "" && submeet && "parsley-error"}`}
        //     value={name}
        //     onChange={(e) => this.setState({ name: e.target.value })}
        // />
        // {name === "" && submeet && (
        //     <ul className="parsley-errors-list filled">
        //         <li className="parsley-required">Name is required.</li>
        //     </ul>
        // )}
        //                 </div>

        //                 <div className="form-group w-50">
        // <label>Phone Number</label>
        // <input
        //     type="tel"
        //     className={`form-control ${phoneNumber === "" && submeet && "parsley-error"}`}
        //     value={phoneNumber}
        //     onChange={(e) => this.setState({ phoneNumber: e.target.value })}
        // />
        // {phoneNumber === "" && submeet && (
        //     <ul className="parsley-errors-list filled">
        //         <li className="parsley-required">Phone number is required.</li>
        //     </ul>
        // )}
        //                 </div>

        //                 <div className="form-group w-50">
        // <label>Choose File (Image)</label>
        // <input
        //     type="file"
        //     className="form-control"
        //     accept="image/*"
        //     onChange={(e) => this.setState({ avatar: e.target.files[0] })}
        // />
        // {avatar && (
        //     <img
        //         src={URL.createObjectURL(avatar)}
        //         alt="Preview"
        //         className="img-thumbnail mt-3"
        //         style={{ maxHeight: "150px" }}
        //     />
        // )}
        //                 </div>

        //                 <br />
        //                 <button type="submit" className="btn btn-primary">
        //                     Add Pickup Person
        //                 </button>
        //             </form>
        //         </div>
        //     </div>
        // );

        return (
            <div style={{ flex: 1 }} onClick={() => document.body.classList.remove("offcanvas-active")}>
                <div>
                    <div className="container-fluid">
                        <PageHeader
                            HeaderText="Pickup Person Management"
                            Breadcrumb={[
                                { name: "Pickup Management", navigate: "/listpickupperson" },
                                { name: "Add Pickup Person", navigate: "" },                            ]}
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
                                <h4 className="mb-0">Create Pickup Person</h4>
                            </div>
                            <div className="card-body">
                                <form onSubmit={this.handleSubmit}>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Name</label>
                                                <input
                                                    className={`form-control ${name === "" && submeet && "parsley-error"}`}
                                                    value={name}
                                                    onChange={(e) => this.setState({ name: e.target.value })}
                                                />
                                                {name === "" && submeet && (
                                                    <ul className="parsley-errors-list filled">
                                                        <li className="parsley-required">Name is required.</li>
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Phone Number</label>
                                                <input
                                                    type="tel"
                                                    className={`form-control ${phoneNumber === "" && submeet && "parsley-error"}`}
                                                    value={phoneNumber}
                                                    onChange={(e) => this.setState({ phoneNumber: e.target.value })}
                                                />
                                                {phoneNumber === "" && submeet && (
                                                    <ul className="parsley-errors-list filled">
                                                        <li className="parsley-required">Phone number is required.</li>
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Choose File (Image)</label>
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    accept="image/*"
                                                    onChange={(e) => this.setState({ avatar: e.target.files[0] })}
                                                />
                                                {avatar && (
                                                    <img
                                                        src={URL.createObjectURL(avatar)}
                                                        alt="Preview"
                                                        className="img-thumbnail mt-3"
                                                        style={{ maxHeight: "150px" }}
                                                    />
                                                )}
                                            </div>
                                        </div>

                                    </div>


                                    <div className="text-right">
                                        <button type="submit" className="btn btn-primary">
                                            Add Pickup Person
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

export default connect(mapStateToProps)(withRouter(AddPickupPerson));
