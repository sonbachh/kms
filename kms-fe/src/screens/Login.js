import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "../assets/images/logo-white.svg";
import { updateEmail, updatePassword, onLoggedin } from "../actions";
import { Button } from "react-bootstrap";
import axios from 'axios';
import { setSession } from "../components/Auth/Auth";
import Notification from "../components/Notification";

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoad: true,
      showPassword: false, // State to manage password visibility

      showNotification: false, // State to control notification visibility
      notificationText: "", // Text for the notification
      notificationType: "success" // Type of notification (success or error)
    }
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isLoad: false
      })
    }, 500);
    document.body.classList.remove("theme-cyan");
    document.body.classList.remove("theme-purple");
    document.body.classList.remove("theme-blue");
    document.body.classList.remove("theme-green");
    document.body.classList.remove("theme-orange");
    document.body.classList.remove("theme-blush");
  }

  handleOnSubmit = async (evt) => {
    evt.preventDefault();
    try {
      // Gọi API để đăng nhập
      const loginResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/Account/login`, {
        email: this.props.email,
        password: this.props.password,
      });
  
      if (loginResponse.status !== 200) {
        throw new Error("Failed to log in");
      }
  
      const loginData = loginResponse.data; // Dữ liệu từ API /api/Account/login
      console.log(loginData, "Login response");
  
      const userId = loginData.user.userId;
  
      // Gọi API để lấy thông tin chi tiết người dùng (bao gồm avatar)
      const profileResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/User/ProfileById/${userId}`);
  
      if (profileResponse.status !== 200) {
        throw new Error("Failed to fetch user profile");
      }
  
      const profileData = profileResponse.data; // Dữ liệu từ API /api/User/ProfileById
      console.log(profileData, "Profile response");
  
      // Thêm avatar vào dữ liệu user mà không thay đổi cấu trúc ban đầu
      const userWithAvatar = {
        ...loginData.user, // Dữ liệu ban đầu
        avatar: profileData.avatar, // Thêm trường avatar
      };
  
      // Lưu lại vào localStorage và sessionStorage
      // localStorage.setItem("user", JSON.stringify({ ...loginData, user: userWithAvatar }));
      sessionStorage.setItem("user", JSON.stringify({ ...loginData, user: userWithAvatar }));
  
      // Chuyển hướng dựa trên roleId
      switch (userWithAvatar.roleId) {
        case 1:
          window.location.href = "/dashboard";
          break;
        case 2:
          window.location.href = "/viewattendparent";
          break;
        case 3:
          window.location.href = "/viewclass";
          break;
        case 4:
          window.location.href = "/dashboardprin";
          break;
        case 5:
          window.location.href = "/viewclass3";
          break;
        default:
          window.location.href = "/";
          break;
      }
      this.setState({
        notificationText: "Wellcome to KMS",
        notificationType: "info",
        showNotification: true
      });
    } catch (error) {
      console.error("Login error:", error); // Log lỗi để kiểm tra
      this.setState({
        notificationText: error.response?.data || "An error occurred during login.",
        notificationType: "error",
        showNotification: true,
      });
    }
  };
  

  togglePasswordVisibility = () => {
    this.setState(prevState => ({ showPassword: !prevState.showPassword }));
  };
  render() {
    const { navigation } = this.props;
    const { email, password } = this.props;
    const { showPassword } = this.state;
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
        <div className="page-loader-wrapper" style={{ display: this.state.isLoad ? 'block' : 'none' }}>
          <div className="loader">
            <div className="m-t-30"><img src={require('../assets/images/logo-icon.svg')} width="48" height="48" alt="Lucid" /></div>
            <p>Please wait...</p>
          </div>
        </div>
        <div className="hide-border">
          <div className="vertical-align-wrap">
            <div className="vertical-align-middle auth-main">
              <div className="auth-box">
                <div className="top">
                  <img src={Logo} alt="Lucid" style={{ height: "40px", margin: "10px" }} />
                </div>
                <div className="card">
                  <div className="header">
                    <p className="lead">Login to your account</p>
                  </div>
                  <div className="body">
                    <div className="form-auth-small">
                      <form class="space-y-4 md:space-y-6" onSubmit={this.handleOnSubmit}>
                        <div className="form-group">
                          <label className="control-label sr-only">Email</label>
                          <input
                            className="form-control"
                            id="signin-email"
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={val => {
                              this.props.updateEmail(val.target.value);
                            }}
                          />
                        </div>
                        <div className="form-group position-relative">
                          <label className="control-label sr-only">
                            Password
                          </label>
                          <input
                            className="form-control "
                            id="signin-password"
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={val => {
                              this.props.updatePassword(val.target.value);
                            }}
                          />
                          <span
                            className="position-absolute"
                            style={{ right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
                            onClick={this.togglePasswordVisibility}
                          >

                            <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true"></i>
                          </span>
                        </div>
                        <div className="form-group clearfix">
                          <label className="fancy-checkbox element-left">
                            <input type="checkbox" />
                            <span>Remember me</span>
                          </label>
                        </div>
                        <Button
                          type="submit"
                          className="btn btn-primary btn-lg btn-block"
                        >Login</Button>

                      </form>
                      <div className="bottom">
                        <span className="helper-text m-b-10">
                          <i className="fa fa-lock"></i>{" "}
                          <a href={`${process.env.PUBLIC_URL}/forgotpassword`}
                          >
                            Forgot password?
                          </a>
                        </span>
                      </div>
                    </div>
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

Login.propTypes = {
  // updateEmail: PropTypes.func.isRequired,
  updateEmail: PropTypes.func.isRequired,
  updatePassword: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
};

const mapStateToProps = ({ loginReducer }) => ({
  email: loginReducer.email,
  password: loginReducer.password
});

export default connect(mapStateToProps, {
  updateEmail,
  updatePassword,
  onLoggedin
})(Login);
