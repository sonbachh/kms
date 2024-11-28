import React from "react";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";

class ProfileInfoCard extends React.Component {
  render() {
    return (
      <div className="card">
        <div className="header">
          <h2>Info</h2>

          <Dropdown as="ul" className="header-dropdown">
            <Dropdown.Toggle variant="success" as="li" id="dropdown-basic">
              <Dropdown.Menu
                as="ul"
                className="dropdown-menu dropdown-menu-right"
              >
                <li>
                  <a>Action</a>
                </li>
                <li>
                  <a>Another Action</a>
                </li>
                <li>
                  <a>Something else</a>
                </li>
              </Dropdown.Menu>
            </Dropdown.Toggle>
          </Dropdown>
        </div>
        <div className="body">
          <small className="text-muted">Address: </small>
          <p>795 Folsom Ave, Suite 600 San Francisco, 94107</p>
          <div></div>
          <hr />
          <small className="text-muted">Email address: </small>
          <p>michael@gmail.com</p>
          <hr />
          <small className="text-muted">Mobile: </small>
          <p>+ 202-555-2828</p>
          <hr />
          <small className="text-muted">Birth Date: </small>
          <p className="m-b-0">October 22th, 1990</p>
          <hr />
          <small className="text-muted">Social: </small>
          <p>
            <i className="fa fa-twitter m-r-5"></i> twitter.com/example
          </p>
          <p>
            <i className="fa fa-facebook  m-r-5"></i> facebook.com/example
          </p>
          <p>
            <i className="fa fa-github m-r-5"></i> github.com/example
          </p>
          <p>
            <i className="fa fa-instagram m-r-5"></i> instagram.com/example
          </p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ mailInboxReducer }) => ({});

export default connect(mapStateToProps, {})(ProfileInfoCard);
