import React from "react";
import { connect } from "react-redux";

class BasicValidation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryname: "",
      description: "",
      submeet: false,
    };
  }
  handleSubmit = (event) => {
    event.preventDefault();
    if (!this.state.categoryname || !this.state.description) {
      this.setState({ submeet: true });
      return;
    }
    // Gọi hàm HandelSubmit từ props
    this.props.handleCreatCategory({ categoryName: this.state.categoryname, description: this.state.description });
  };

  render() {
    const { categoryname, description, submeet } = this.state;
    return (
      <div className="col-md-12">
        <div className="card">
          <div className="header text-center">
            <h4>Create new category Form</h4>
          </div>
          <div className="body">
            <form className="ng-untouched ng-dirty ng-invalid" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label>Category Service Name</label>
                <input
                  className={`form-control ${categoryname === "" && submeet && "parsley-error"
                    }`}
                  value={categoryname}
                  name="categoryname"
                  required=""
                  onChange={(e) => {
                    this.setState({
                      [e.target.name]: e.target.value,
                      submeet: false,
                    });
                  }}
                />
                {categoryname === "" && submeet ? (
                  <ul className="parsley-errors-list filled" id="parsley-id-29">
                    <li className="parsley-required">
                      This value is required.
                    </li>
                  </ul>
                ) : null}
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  className={`form-control ${description === "" && submeet && "parsley-error"
                    }`}
                  value={description}
                  name="description"
                  required=""
                  type="text"
                  onChange={(e) => {
                    this.setState({ description: e.target.value });
                  }}
                />
                {description === "" && submeet ? (
                  <ul className="parsley-errors-list filled" id="parsley-id-29">
                    <li className="parsley-required">
                      This value is required.
                    </li>
                  </ul>
                ) : null}
              </div>
              <div className="form-group">
                <label>Status</label>
                <br />
                <label className="fancy-radio">
                  <input
                    name="gender"
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
              <button type="submit" className="btn btn-success text-center">
                Create
              </button>
            </form>

          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ mailInboxReducer }) => ({});

export default connect(mapStateToProps, {})(BasicValidation);
