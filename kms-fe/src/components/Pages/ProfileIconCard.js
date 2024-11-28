import React from "react";
import { connect } from "react-redux";

class ProfileIconCard extends React.Component {
  render() {
    return (
      <div className="card">
        <ul className="row profile_state list-unstyled">
          <li className="col-lg-6 col-6">
            <div className="body">
              <i className="fa fa-camera"></i>
              <h5
                className="m-b-0 number count-to"
                data-from="0"
                data-to="2365"
                data-speed="1000"
                data-fresh-interval="700"
              >
                2365
              </h5>
              <small>Shots View</small>
            </div>
          </li>
          <li className="col-lg-6 col-6">
            <div className="body">
              <i className="fa fa-thumbs-o-up"></i>
              <h5
                className="m-b-0 number count-to"
                data-from="0"
                data-to="1203"
                data-speed="1000"
                data-fresh-interval="700"
              >
                1203
              </h5>
              <small>Likes</small>
            </div>
          </li>
          <li className="col-lg-6 col-6">
            <div className="body">
              <i className="fa fa-comments-o"></i>
              <h5
                className="m-b-0 number count-to"
                data-from="0"
                data-to="324"
                data-speed="1000"
                data-fresh-interval="700"
              >
                324
              </h5>
              <small>Comments</small>
            </div>
          </li>
          <li className="col-lg-6 col-6">
            <div className="body">
              <i className="fa fa-user"></i>
              <h5
                className="m-b-0 number count-to"
                data-from="0"
                data-to="1980"
                data-speed="1000"
                data-fresh-interval="700"
              >
                1980
              </h5>
              <small>Profile Views</small>
            </div>
          </li>
          <li className="col-lg-6 col-6">
            <div className="body">
              <i className="fa fa-desktop"></i>
              <h5
                className="m-b-0 number count-to"
                data-from="0"
                data-to="251"
                data-speed="1000"
                data-fresh-interval="700"
              >
                251
              </h5>
              <small>Website View</small>
            </div>
          </li>
          <li className="col-lg-6 col-6">
            <div className="body">
              <i className="fa fa-file-text text-warning"></i>
              <h5
                className="m-b-0 number count-to"
                data-from="0"
                data-to="52"
                data-speed="1000"
                data-fresh-interval="700"
              >
                52
              </h5>
              <small>Attachment</small>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = ({ mailInboxReducer }) => ({});

export default connect(mapStateToProps, {})(ProfileIconCard);
