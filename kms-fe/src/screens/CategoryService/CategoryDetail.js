import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import axios from "axios";


class CategoryDetail extends React.Component {

    state = {
        categoriesDetail: null,
    };
    componentDidMount() {
        const { categoryServiceId } = this.props.match.params; // Lấy classId từ URL
        this.setState({ categoryServiceId: parseInt(categoryServiceId) }); // Cập nhật classId vào state
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/CategoryService/GetCategoryServiceById/${categoryServiceId}`);
                const data = response.data;
                this.setState({ categoriesDetail: data });
                console.log(data);
                // console.log(categoryId);

            } catch (error) {
                console.error('Error fetching category details:', error);
            }
        };

        fetchData();
    };

    render() {
        const { categoriesDetail } = this.state;

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
                            HeaderText="Category Detail"
                            Breadcrumb={[
                                { name: "Category", navigate: "" },
                                { name: "Category Detail", navigate: "" },
                            ]}
                        />
                        <div className="row clearfix">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="body">
                                        <form className="ng-untouched ng-dirty ng-invalid">
                                            <div className="form-group">
                                                <label>Category Service Name</label>
                                                <input
                                                    className={`form-control`}
                                                    value={categoriesDetail?.categoryName}
                                                    name="categoryname"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Description</label>
                                                <input
                                                    className={`form-control`}
                                                    value={categoriesDetail?.description}
                                                    name="description"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Status</label>
                                                <br />
                                                <label className="fancy-radio">
                                                    <input
                                                        data-parsley-errors-container="#error-radio"
                                                        name="gender"
                                                        required=""
                                                        type="radio"
                                                        value="male"
                                                    />
                                                    <span>
                                                        <i></i>Enable
                                                    </span>
                                                </label>
                                                <label className="fancy-radio">
                                                    <input name="gender" type="radio" value="female" />
                                                    <span>
                                                        <i></i>Disable
                                                    </span>
                                                </label>
                                            </div>
                                            <br />
                                            <a href="/category" className="btn btn-success text-center">
                                                Back to Category List
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

const mapStateToProps = ({ CreateCategoryReducer }) => ({});

export default connect(mapStateToProps, {})(CategoryDetail);
