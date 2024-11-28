import React from "react";
import { connect } from "react-redux";
import imageuser from "../../assets/images/user.png";

class ProfileV1Setting extends React.Component {
  render() {
    return (
      <div>
        <div className="body">
          <h6>Profile Photo</h6>
          <div className="media">
            <div className="media-left m-r-15">
              <img
                alt="User"
                className="user-photo media-object"
                src={imageuser}
              />
            </div>
            <div className="media-body">
              <p>
                Upload your photo. <br />
                <em>Image should be at least 140px x 140px</em>
              </p>
              <button
                className="btn btn-default-dark"
                id="btn-upload-photo"
                type="button"
              >
                Upload Photo
              </button>
              <input className="sr-only" id="filePhoto" type="file" />
            </div>
          </div>
        </div>
        <div className="body">
          <h6>Basic Information</h6>
          <div className="row clearfix">
            <div className="col-lg-6 col-md-12">
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="First Name"
                  type="text"
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Last Name"
                  type="text"
                />
              </div>
              <div className="form-group">
                <div>
                  <label className="fancy-radio">
                    <input
                      name="gender2"
                      type="radio"
                      value="male"
                      onChange={() => {}}
                    />
                    <span>
                      <i></i>Male
                    </span>
                  </label>
                  <label className="fancy-radio">
                    <input
                      name="gender2"
                      type="radio"
                      value="female"
                      onChange={() => {}}
                    />
                    <span>
                      <i></i>Female
                    </span>
                  </label>
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="icon-calendar"></i>
                    </span>
                  </div>
                  <input
                    className="form-control"
                    data-date-autoclose="true"
                    data-provide="datepicker"
                    placeholder="Birthdate"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Address"
                  type="text"
                />
              </div>
            
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="City"
                  type="text"
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="State/Province"
                  type="text"
                />
              </div>
              <div className="form-group">
                <select className="form-control">
                  <option value="">-- Select Country --</option>
                  <option value="VN">Viet Nam</option>
                </select>
              </div>
            </div>
          </div>
          <button className="btn btn-primary" type="button">
            Update
          </button>{" "}
          &nbsp;&nbsp;
          <button className="btn btn-default" type="button">
            Cancel
          </button>
        </div>
        <div className="body">
          <div className="row clearfix">
            <div className="col-lg-6 col-md-12">
              <h6>Account Data</h6>
              <div className="form-group">
                <input
                  className="form-control"
                  disabled=""
                  placeholder="Username"
                  type="text"
                  value="alizeethomas"
                  onChange={() => {}}
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Email"
                  type="email"
                  value="alizee.info@yourdomain.com"
                  onChange={() => {}}
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Phone Number"
                  type="text"
                  onChange={() => {}}
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <h6>Change Password</h6>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Current Password"
                  type="password"
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="New Password"
                  type="password"
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Confirm New Password"
                  type="password"
                />
              </div>
            </div>
          </div>
          <button className="btn btn-primary" type="button">
            Update
          </button>{" "}
          &nbsp;&nbsp;
          <button className="btn btn-default">Cancel</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ mailInboxReducer }) => ({});

export default connect(mapStateToProps, {})(ProfileV1Setting);
