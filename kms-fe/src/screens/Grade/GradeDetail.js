import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import axios from "axios";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";


class GradeDetail extends React.Component {

    state = {
        GradesDetail: null,
    };
    componentDidMount() {
        const { gradeId } = this.props.match.params; // Lấy classId từ URL
        this.setState({ gradeId: parseInt(gradeId) }); // Cập nhật classId vào state
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/Grade/GetGradeById/${gradeId}`);
                const data = response.data;
                this.setState({ GradesDetail: data });
                console.log(data);
                // console.log(categoryId);

            } catch (error) {
                console.error('Error fetching category details:', error);
            }
        };

        fetchData();
    };

    render() {
        const { GradesDetail } = this.state;

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
                            HeaderText="Grade Detail"
                            Breadcrumb={[
                                { name: "Grade", navigate: "grade" },
                                { name: "Grade Detail", navigate: "" },
                            ]}
                        />
                        <div className="row clearfix">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="body">
                                        <form className="ng-untouched ng-dirty ng-invalid">
                                            <div className="form-group">
                                                <label>Grade Name</label>
                                                <input
                                                    className={`form-control`}
                                                    value={GradesDetail?.name}
                                                    name="categoryname"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Base Tuition Fee</label>
                                                <input
                                                    className={`form-control`}
                                                    value={GradesDetail?.baseTuitionFee}
                                                    name="description"
                                                />
                                            </div>
                                            {/* <div className="form-group">
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
                                            </div> */}
                                            <br />
                                            <a href="/grade" className="btn btn-success text-center">
                                                Back to Grade List
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


export default withRouter(GradeDetail);
