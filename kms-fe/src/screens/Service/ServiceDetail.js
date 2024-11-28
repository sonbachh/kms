import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import axios from "axios";


class ServiceDetail extends React.Component {

    state = {
        serviceDetail: null,
    };
    componentDidMount() {
        const { serviceId } = this.props.match.params; // Lấy classId từ URL
        this.setState({ serviceId: parseInt(serviceId) }); // Cập nhật classId vào state
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/Service/GetServiceById/${serviceId}`);
                const data = response.data;
                this.setState({ serviceDetail: data });
                console.log(data);

            } catch (error) {
                console.error('Error fetching service details:', error);
            }
        };

        fetchData();
    };

    render() {
        const { serviceDetail } = this.state;

        return (
            <div
                style={{ flex: 1 }}
                onClick={() => {
                    document.body.classList.remove("offcanvas-active");
                }}
            >
                <div>
                    <div className="container-fluid">
                        <PageHeader
                            HeaderText="Service Detail"
                            Breadcrumb={[
                                { name: "Service", navigate: "" },
                                { name: "Service Detail", navigate: "" },
                            ]}
                        />
                        <div className="row clearfix">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="body">
                                        <form className="ng-untouched ng-dirty ng-invalid">
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label>Service Name</label>
                                                    <input
                                                        className={`form-control`}
                                                        value={serviceDetail?.serviceName}
                                                        name="serviceName"
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label>Service Price</label>
                                                    <input
                                                        className={`form-control`}
                                                        value={serviceDetail?.servicePrice}
                                                        name="servicePrice"
                                                    />
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label>Service Description</label>
                                                    <input
                                                        className={`form-control`}
                                                        value={serviceDetail?.serviceDes}
                                                        name="serviceDes"
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label>Category Name</label>
                                                    <input
                                                        className={`form-control`}
                                                        value={serviceDetail?.categoryService?.categoryName}
                                                        name="categoryName"
                                                    />
                                                </div>

                                            </div>
                                            <br />
                                            <a href="/service" className="btn btn-success text-center">
                                                Back to Service List
                                            </a>
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

const mapStateToProps = ({ CreateServiceReducer }) => ({});

export default connect(mapStateToProps, {})(ServiceDetail);
