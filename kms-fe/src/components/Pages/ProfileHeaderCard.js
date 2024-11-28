import React from "react";
import { connect } from "react-redux";
import image from "../../assets/images/user.png";

class ProfileHeaderCard extends React.Component {
  render() {
    return (
      <div className="card profile-header">
        <div className="body">
          <div className="profile-image">
            <img alt="" className="rounded-circle" src={image} />
          </div>
          <div>
            <h4 className="m-b-0">
              <strong>Alizee</strong> Thomas
            </h4>
            <span>Washington, d.c.</span>
          </div>
          <div className="m-t-15">
            <button className="btn btn-primary mr-1">Follow</button>
            <button className="btn btn-outline-secondary">Message</button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ mailInboxReducer }) => ({});

export default connect(mapStateToProps, {})(ProfileHeaderCard);
