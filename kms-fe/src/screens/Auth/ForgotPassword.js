import React from "react";
import { connect } from "react-redux";
import axios from 'axios'; // Import axios
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "../../assets/images/logo-white.svg";
import Notification from "../../components/Notification";

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",  // State to store email input
      errorMessage: "",

      showNotification: false, // State to control notification visibility
      notificationText: "", // Text for the notification
      notificationType: "success" // Type of notification (success or error)
    };

  }

  handleEmailChange = (event) => {
    this.setState({ email: event.target.value });  // Update state with email input
  }

  handleSubmit = async (event) => {
    event.preventDefault();  // Prevent default form submission
    const { email } = this.state;

    if (!email) {
      this.setState({ errorMessage: "Please enter a valid email address." });
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/Account/forgot-password`, {
        mail: email,  // Send the email in the request body
      });
      if (response.status === 200) {
        this.setState({
          notificationText: "Password reset instructions have been sent to your email!",
          notificationType: "success",
          showNotification: true
        });
        // Optionally redirect to login
        setTimeout(() => {
          this.props.history.push('/login');
        }, 2000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        this.setState({
          notificationText: error.response.data,
          notificationType: "error",
          showNotification: true
        });
      } else {
        this.setState({
          notificationText: "An error occurred while sending the request.!",
          notificationType: "error",
          showNotification: true
        });
      }
    }
  }

  render() {
    const { showNotification, notificationText, notificationType } = this.state;

    return (
      <div className="theme-cyan">
        {showNotification && (
          <Notification
            type={notificationType}
            position="top-right"
            dialogText={notificationText}
            show={showNotification}
            onClose={() => this.setState({ showNotification: false })}
          />
        )}
        <div >
          <div className="vertical-align-wrap">
            <div className="vertical-align-middle auth-main">
              <div className="auth-box">
                <div className="top">
                  <img src={Logo} alt="Lucid" style={{ height: "40px", margin: "10px" }} />
                </div>
                <div className="card">
                  <div className="header">
                    <p className="lead">Recover my password</p>
                  </div>
                  <div className="body">
                    <p>Please enter your email address below to receive instructions for resetting password.</p>
                    <form className="form-auth-small ng-untouched ng-pristine ng-valid" onSubmit={this.handleSubmit}>
                      <div className="form-group">
                        <input
                          className="form-control"
                          placeholder="Email"
                          type="email"
                          value={this.state.email}
                          onChange={this.handleEmailChange} // Capture email input
                          required
                        />
                      </div>
                      {this.state.errorMessage && (
                        <p style={{ color: "red" }}>{this.state.errorMessage}</p>
                      )}
                      <button className="btn btn-primary btn-lg btn-block" type="submit">
                        RESET PASSWORD
                      </button>
                      <div className="bottom">
                        <span className="helper-text">Know your password? <a href="login">Login</a></span>
                      </div>
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

ForgotPassword.propTypes = {
};

const mapStateToProps = ({ loginReducer }) => ({
});

export default connect(mapStateToProps, {
})(ForgotPassword);
