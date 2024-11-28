import React from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";

class BorderedTable extends React.Component {
  
  handleEdit = (categoryServiceId) => {
    // Chuyển hướng đến trang cập nhật lớp học
    this.props.history.push(`/category-detail/${categoryServiceId}`);
  };
  render() {

    const { categories } = this.props;

    return (
      <div className="col-lg-12">
        <div className="card">
          <div className="header">
          </div>
          <div className="body table-responsive">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>CategoryService</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td><a onClick={() => this.handleEdit(category.categoryServiceId)} >{category?.categoryName}</a></td>
                    <td>{category?.status}</td>
                    <td>{category?.description}</td>
                    <td>
                      <Button variant="primary">Update</Button>{' '}
                      <Button variant="warning">Enable</Button>{' '}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ mailInboxReducer }) => ({});

export default connect(mapStateToProps, {})(BorderedTable);
