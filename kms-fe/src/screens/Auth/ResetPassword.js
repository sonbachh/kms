import React from "react";
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // Don't forget to import axios if you're making API requests
import Logo from "../../assets/images/logo-white.svg";
import Notification from "../../components/Notification";

class ResetPassword extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      newPassword: "",
      confirmPassword: "",
      tokenReset: "", // Store the token from URL
      errorMessage: "",
      successMessage: "",
      showPassword: false, // State to manage password visibility
      showConfirmPassword: false, // State to manage password visibility

      showNotification: false, // State to control notification visibility
      notificationText: "", // Text for the notification
      notificationType: "success" // Type of notification (success or error)
    };
  }

  componentDidMount() { // Corrected the typo here
    // Get tokenReset from URL query params
    const urlParams = new URLSearchParams(this.props.location.search);
    const tokenReset = urlParams.get('token'); // Extract token from URL

    if (tokenReset) {
      this.setState({ tokenReset });
    } else {
      this.setState({ errorMessage: "Invalid or missing token." });
    }
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { newPassword, confirmPassword, tokenReset } = this.state;
    if (!newPassword || !confirmPassword) {
      this.setState({ errorMessage: "Please fill in all fields." });
      return;
    }

    if (newPassword !== confirmPassword) {
      this.setState({ errorMessage: "Passwords do not match." });
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/Account/reset-password`, {
        password: newPassword,
        confirmPassword: confirmPassword,
        token: tokenReset,  // Include tokenReset in the request
      });

      if (response.status === 200) {
        this.setState({
          errorMessage: "",
        });
        this.setState({
          notificationText: "Password successfully reset!",
          notificationType: "success",
          showNotification: true
        });
        
        // Optionally redirect to login after successful password reset
        setTimeout(() => {
          this.props.history.push('/login');
        }, 2000);
      }
    } catch (error) {
      // If the response is a string (not an object)
      if (error.response && typeof error.response.data === 'string') {
        this.setState({ errorMessage: error.response.data }); // Set the plain string error message
      } else if (error.response && error.response.data.message) {
        this.setState({ errorMessage: error.response.data.message });
      } else {
        this.setState({ errorMessage: "An error occurred while resetting the password." });
      }
    }
  }
  togglePasswordVisibility = () => {
    this.setState(prevState => ({ showPassword: !prevState.showPassword }));
  };

  toggleConfirmPasswordVisibility = () => {
    this.setState(prevState => ({ showConfirmPassword: !prevState.showConfirmPassword }));
  };

  render() {

    const { showPassword, showConfirmPassword } = this.state;
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
                    <p className="lead">Reset password</p>
                  </div>
                  <div className="body">
                    <p>Please enter your new Password below to reset your password.</p>
                    <form className="form-auth-small" onSubmit={this.handleSubmit}>
                      <div className="form-group position-relative">
                        <label>New Password</label>
                        <input
                          className="form-control"
                          placeholder="New Password"
                          type={showPassword ? "text" : "password"}
                          name="newPassword"
                          value={this.state.newPassword}
                          onChange={this.handleInputChange}
                          required
                        />
                        <span
                          className="position-absolute"
                          style={{ right: "10px", top: "70%", transform: "translateY(-50%)", cursor: "pointer" }}
                          onClick={this.togglePasswordVisibility}
                        >
                          <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true"></i>
                        </span>
                      </div>
                      <div className="form-group position-relative">
                        <label>Confirm Password</label>
                        <input
                          className="form-control"
                          placeholder="Confirm Password"
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={this.state.confirmPassword}
                          onChange={this.handleInputChange}
                          required
                        />
                        <span
                          className="position-absolute"
                          style={{ right: "10px", top: "70%", transform: "translateY(-50%)", cursor: "pointer" }}
                          onClick={this.toggleConfirmPasswordVisibility}
                        >
                          <i className={`fa ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true"></i>
                        </span>
                      </div>
                      {this.state.errorMessage && (
                        <p style={{ color: "red" }}>{this.state.errorMessage}</p>
                      )}
                      {this.state.successMessage && (
                        <p style={{ color: "green" }}>{this.state.successMessage}</p>
                      )}
                      <button className="btn btn-primary btn-lg btn-block" type="submit">
                        CHANGE PASSWORD
                      </button>
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

ResetPassword.propTypes = {
};

const mapStateToProps = ({ loginReducer }) => ({});

export default connect(mapStateToProps, {})(ResetPassword);
