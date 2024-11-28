import React from "react";
import { connect } from "react-redux";

class ProjectsListTable extends React.Component {
  handleViewDetail = (categoryServiceId) => {
    // Chuyển hướng đến trang chi tiet category
    this.props.history.push(`/category-detail/${categoryServiceId}`);
  };

  handleEdit = (categoryServiceId) => {
    // Chuyển hướng đến cap nhat category
    this.props.history.push(`/category-update/${categoryServiceId}`);
  };

  render() {
    const { categories } = this.props;

    return (

      <div className="col-lg-12">
        <div className="card">
          <div className="header">
          </div>
          <div className="table-responsive">
            <table className="table m-b-0 table-hover">
              <thead className="thead-light">
                <tr>
                  <th>#</th>
                  <th>CategoryName</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, i) => {
                  return (
                    <tr key={"dihf" + i}>

                      <td className="project-title">
                        <th scope="row">{i + 1}</th>
                      </td>
                      <td>
                        <a onClick={() => this.handleViewDetail(category.categoryServiceId)} >{category?.categoryName}</a>
                      </td>
                      <td>
                        {category?.description}
                      </td>
                      <td>
                        {category?.status === "Active" ? (
                          <span className="badge badge-success">Active</span>
                        ) : category?.status === "InActive" ? (
                          <span className="badge badge-default">InActive</span>
                        ) : category?.status === "PENDING" ? (
                          <span className="badge badge-warning">Pending</span>
                        ) : category?.status === "Closed" ? (
                          <span className="badge badge-primary">Closed</span>
                        ) : null}
                      </td>
                      <td className="project-actions">
                        <a  onClick={() => this.handleViewDetail(category.categoryServiceId)}  className="btn btn-outline-secondary mr-1">
                          <i className="icon-eye"></i>
                        </a>
                        <a onClick={() => this.handleEdit(category.categoryServiceId)} className="btn btn-outline-secondary">
                          <i className="icon-pencil"></i>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ mailInboxReducer }) => ({});

export default connect(mapStateToProps, {})(ProjectsListTable);
