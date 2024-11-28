import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import BasicValidation from "../../components/Forms/BasicValidation";
import axios from "axios";

class CategoryCreate extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }

    handleCreatCategory = async (values) => {

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/CategoryService/AddCategoryService`,values
            );
            console.log("Tạo danh mục thành công:", response.data);
            alert("Tạo danh mục thành công!"); // User-friendly success message
            this.props.history.push('/category'); // Redirect to category list after successful update
            // Perform additional actions on successful creation (e.g., reset form)
        } catch (error) {
            console.error("Lỗi khi tạo danh mục:", error);
            alert("Lỗi khi tạo danh mục!"); // User-friendly error message
        }
    };

    render() {
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
                            HeaderText="New category"
                            Breadcrumb={[
                                { name: "Category", navigate: "" },
                                { name: "New category", navigate: "" },
                            ]}
                        />
                        <div className="row clearfix">
                            <BasicValidation handleCreatCategory={this.handleCreatCategory} />
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ CreateCategoryReducer }) => ({});

export default connect(mapStateToProps, {})(CategoryCreate);
