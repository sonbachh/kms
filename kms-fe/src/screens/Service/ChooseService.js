import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { withRouter } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

class ChooseService extends React.Component {
    state = {
        studentId: "",
        childerParent: [],
        services: [],
        selectedServices: [],
    };

    componentDidMount() {
        window.scrollTo(0, 0);

        const user = JSON.parse(sessionStorage.getItem("user"));
        const parentID = user?.user?.userId;

        if (!parentID) {
            console.error("Parent ID not found");
            return;
        }

        // Fetch children data
        axios
            .get(`${process.env.REACT_APP_API_URL}/api/Request/GetStudentsByParentId/${parentID}`)
            .then((response) => {
                this.setState({ childerParent: response.data });
            })
            .catch((error) => {
                console.error("Error fetching student data:", error);
            });

        // Fetch services data
        axios
            .get(`${process.env.REACT_APP_API_URL}/api/Service/GetAllServices`)
            .then((response) => {
                this.setState({ services: response.data });
            })
            .catch((error) => {
                console.error("Error fetching service data:", error);
            });
    }

    handleStudentChange = (e) => {
        const studentId = e.target.value;
        this.setState({
            studentId,
            selectedServices: [] // Đặt lại danh sách dịch vụ được chọn khi thay đổi học sinh
        });
    };

    toggleServiceSelection = (serviceId) => {
        this.setState((prevState) => {
            const selectedServices = [...prevState.selectedServices];
            const serviceIndex = selectedServices.indexOf(serviceId);

            if (serviceIndex === -1) {
                selectedServices.push(serviceId);
            } else {
                selectedServices.splice(serviceIndex, 1);
            }

            return { selectedServices };
        });
    };

    handleConfirm = () => {
        const { studentId, selectedServices } = this.state;

        if (!studentId) {
            alert("Please select a student.");
            return;
        }

        if (selectedServices.length === 0) {
            alert("Please select at least one service.");
            return;
        }

        // Gửi yêu cầu cho từng service đã chọn
        selectedServices.forEach((serviceId) => {
            const body = {
                chidrenServicesId: 0, // Giữ mặc định là 0
                time: new Date().toISOString().split('T')[0], // Lấy ngày hiện tại
                status: 0, // Trạng thái mặc định là 0
                serviceId: serviceId,
                studentId: studentId,
            };

            axios
                .post(`${process.env.REACT_APP_API_URL}/api/Service/AddChildService`, body)
                .then((response) => {
                    console.log("Service added successfully:", response.data);
                    alert(`Service with ID ${serviceId} added successfully for student ${studentId}.`);
                })
                .catch((error) => {
                    console.error("Error adding service:", error);
                    alert(`Failed to add service with ID ${serviceId} for student ${studentId}.`);
                });
        });
    };

    render() {
        const { childerParent, studentId, services, selectedServices } = this.state;

        return (
            <div className="container mt-4">
                <PageHeader
                    HeaderText="Service Selection"
                    Breadcrumb={[
                        { name: "Service Management", navigate: "" },
                        { name: "Choose Services", navigate: "" },
                    ]}
                />

                <div className="row mb-4">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="form-label fw-bold">
                                <i className="bi bi-person-lines-fill me-2"></i> Select Child
                            </label>
                            <div className="input-group mb-3">
                                <span className="input-group-text bg-light">
                                    <i className="icon-user"></i>
                                </span>
                                <select
                                    className="form-select border-primary"
                                    value={studentId}
                                    onChange={this.handleStudentChange}
                                    style={{
                                        borderRadius: "0.5rem",
                                        boxShadow: "0 0 5px rgba(0, 123, 255, 0.25)",
                                    }}
                                >
                                    <option value="" disabled>
                                        Choose Student
                                    </option>
                                    {childerParent.map((option) => (
                                        <option key={option.studentId} value={option.studentId}>
                                            {option.fullName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <small className="text-muted">Select a child to assign services.</small>
                        </div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-12">
                        <h5>Select Services for the Selected Child</h5>
                        <table className="table table-bordered table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>Service Name</th>
                                    <th>Price</th>
                                    <th>Select</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map((service) => (
                                    <tr key={service.serviceId}>
                                        <td>{service.serviceName}</td>
                                        <td>{service.servicePrice} VND</td>
                                        <td>
                                            <div class="fancy-checkbox d-inline-block">
                                                <label>
                                                    <input class="select-all" type="checkbox" name="checkbox"
                                                        checked={selectedServices.includes(service.serviceId)}
                                                        onChange={() => this.toggleServiceSelection(service.serviceId)} />
                                                    <span>
                                                    </span>
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-12 text-end">
                        <Button variant="primary" onClick={this.handleConfirm}>
                            Confirm Selection
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ ioTReducer }) => ({
    isSecuritySystem: ioTReducer.isSecuritySystem,
});

export default connect(mapStateToProps)(withRouter(ChooseService));
