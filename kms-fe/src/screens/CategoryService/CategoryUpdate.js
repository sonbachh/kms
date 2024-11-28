
import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import axios from "axios";

class CategoryUpdate extends React.Component {
    state = {
        categoriesDetail: null,
        errorMessage: "",
        categoryName: "", // Initialize with empty string
        description: "", // Initialize with empty string
        submeet: false,
    };

    componentDidMount() {
        const { categoryServiceId } = this.props.match.params; // Get categoryServiceId from URL
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/CategoryService/GetCategoryServiceById/${categoryServiceId}`);
                const data = response.data;

                this.setState({
                    categoriesDetail: data,
                    categoryName: data.categoryName, // Set initial state from fetched data
                    description: data.description, // Set initial state from fetched data
                });
            } catch (error) {
                console.error('Error fetching category details:', error);
            }
        };

        fetchData();
    };

    handleSubmit = async (event) => {

        event.preventDefault(); // Make sure this is at the top

        if (!this.state.categoryName) {
            this.setState({ submeet: true });
            return;
        }
        const updatedCategory = {
            categoryServiceId: this.state.categoriesDetail?.categoryServiceId,
            categoryName: this.state.categoryName, // Use state instead of event target
            description: this.state.description, // Use state instead of event target
        };

        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/CategoryService/UpdateCategoryService`, updatedCategory, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            alert("Category has been updated successfully!");
            this.props.history.push('/category'); // Redirect to category list after successful update
        } catch (error) {
            console.error('Error updating category:', error);
            this.setState({ errorMessage: 'Error updating category' });
        }
    };

    render() {
        const { categoriesDetail, categoryName, description, submeet } = this.state;

        return (
            <div style={{ flex: 1 }} onClick={() => document.body.classList.remove("offcanvas-active")}>
                <div>
                    <div className="container-fluid">
                        <PageHeader
                            HeaderText="Category Update"
                            Breadcrumb={[
                                { name: "Category", navigate: "" },
                                { name: "Category Update", navigate: "" },
                            ]}
                        />
                        <div className="row clearfix">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="body">
                                        <form onSubmit={this.handleSubmit}>
                                            <div className="form-group">
                                                <label>Category Service Name</label>
                                                <input
                                                    className={`form-control ${categoryName === "" && submeet && "parsley-error"
                                                        }`}
                                                    value={categoryName} // Bind value from state
                                                    name="categoryName"
                                                    required=""
                                                    onChange={(e) => {
                                                        this.setState({
                                                            [e.target.name]: e.target.value,
                                                            submeet: false,
                                                        });
                                                    }}
                                                />
                                                {categoryName === "" && submeet ? (
                                                    <ul className="parsley-errors-list filled" id="parsley-id-29">
                                                        <li className="parsley-required">This value is required.</li>
                                                    </ul>
                                                ) : null}
                                            </div>
                                            <div className="form-group">
                                                <label>Description</label>
                                                <input
                                                    className="form-control"
                                                    value={description} // Bind value from state
                                                    name="description"
                                                    type="text"
                                                    onChange={(e) => {
                                                        this.setState({ description: e.target.value, submeet: false });
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Status</label>
                                                <br />
                                                <label className="fancy-radio">
                                                    <input name="gender" type="radio" value="male" />
                                                    <span><i></i>Enable</span>
                                                </label>
                                                <label className="fancy-radio">
                                                    <input name="gender" type="radio" value="female" />
                                                    <span><i></i>Disable</span>
                                                </label>
                                            </div>
                                            <br />
                                            <button type="submit" className="btn btn-primary mr-4">Update Category</button>
                                            <a href="/category" className="btn btn-success text-center">Back to Category List</a>
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

export default connect(mapStateToProps, {})(CategoryUpdate);
