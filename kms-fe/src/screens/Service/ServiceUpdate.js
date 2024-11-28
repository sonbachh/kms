
import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import axios from "axios";
import Notification from "../../components/Notification";

class ServiceUpdate extends React.Component {
    state = {
        categories: [],
        serviceDetail: null,
        errorMessage: "",
        serviceName: "",
        servicePrice: "",
        serviceDes: "",
        categoryServiceId: "",
        status: 0,

        showNotification: false, // Để hiển thị thông báo
        notificationText: "", // Nội dung thông báo
        notificationType: "success", // Loại thông báo (success/error)
    };

    componentDidMount() {
        const { serviceId } = this.props.match.params;
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/Service/GetServiceById/${serviceId}`);
                const data = response.data;

                const CategoryResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/CategoryService/GetAllCategoryService`);
                const Categorydata = CategoryResponse.data;
                this.setState({ categories: Categorydata });

                this.setState({
                    serviceDetail: data,
                    serviceName: data.serviceName,
                    servicePrice: data.servicePrice,
                    serviceDes: data.serviceDes,
                    categoryServiceId: data.categoryService.categoryServiceId,
                    status: data.status
                });

                console.log(Categorydata);

            } catch (error) {
                console.error('Error fetching category details:', error);
            }
        };

        fetchData();
    };

    handleSubmit = async (event) => {

        event.preventDefault(); // Make sure this is at the top
        const updatedService = {
            serviceId: this.state.serviceDetail?.serviceId,
            serviceName: this.state.serviceName,
            servicePrice: this.state.servicePrice,
            serviceDes: this.state.serviceDes,
            categoryServiceId: this.state.categoryServiceId,
            schoolId: 1,
            status: this.state.status,
            categoryService: {
                categoryServiceId: this.state.categoryServiceId,
                categoryName: this.state.categories.find(cat => cat.categoryServiceId === this.state.categoryServiceId)?.categoryName, // Find category name based on selected id
            }
        };

        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/Service/UpdateService`, updatedService, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            this.setState({
                notificationText: "Service has been updated successfully!",
                notificationType: "success",
                showNotification: true,
            });
            setTimeout(() => {
                if (this.state.showNotification) {
                    this.props.history.push('/service');
                }
            }, 1000);
        } catch (error) {
            this.setState({
                notificationText: "Error updating Service!",
                notificationType: "error",
                showNotification: true,
            });
        }
    };

    render() {
        const { categories, serviceName, servicePrice, serviceDes, categoryServiceId } = this.state;
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
                            HeaderText="Service Update"
                            Breadcrumb={[
                                { name: "Service", navigate: "service" },
                                { name: "Service Update", navigate: "" },
                            ]}
                        />
                        <div className="row clearfix">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="body">
                                        <form onSubmit={this.handleSubmit}>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label>Service Name</label>
                                                    <input
                                                        className={`form-control ${serviceName === "" && "parsley-error"}`}
                                                        value={serviceName} // Bind value from state
                                                        name="serviceName"
                                                        required
                                                        type="text"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                [e.target.name]: e.target.value,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label>Service Price</label>
                                                    <input
                                                        className={`form-control ${servicePrice === "" && "parsley-error"
                                                            }`}
                                                        value={servicePrice}
                                                        name="servicePrice"
                                                        required
                                                        type="number"
                                                        onChange={(e) => {
                                                            this.setState({ [e.target.name]: e.target.value });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label>Service Description</label>
                                                    <input
                                                        className={`form-control ${serviceDes === "" && "parsley-error"
                                                            }`}
                                                        value={serviceDes} // Bind value from state
                                                        name="serviceDes"
                                                        required
                                                        type="text"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                [e.target.name]: e.target.value,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label>Category Name</label>
                                                    <select
                                                        className="form-control"
                                                        value={categoryServiceId} // Bind categoryServiceId directly
                                                        name="categoryServiceId"
                                                        required
                                                        onChange={(e) => this.setState({ categoryServiceId: e.target.value })}
                                                    >
                                                        <option value="">Select Category</option>
                                                        {categories.map((option) => (
                                                            <option key={option?.categoryServiceId} value={option?.categoryServiceId}>
                                                                {option.categoryName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <br />
                                            <div className="text-center">
                                                <button type="submit" className="btn btn-primary my-4">Update Service</button>
                                            </div>
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

const mapStateToProps = ({ updatedServiceReducer }) => ({});

export default connect(mapStateToProps, {})(ServiceUpdate);
