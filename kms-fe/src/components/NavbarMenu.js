import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, Nav, Toast } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  onPressDashbord,
  onPressDashbordChild,
  onPressThemeColor,
  onPressGeneralSetting,
  onPressNotification,
  onPressEqualizer,
  onPressSideMenuToggle,
  onPressMenuProfileDropdown,
  onPressSideMenuTab,
  tostMessageLoad,
} from "../actions";
import Logo from "../assets/images/logo.svg";
import LogoWhite from "../assets/images/logo-white.svg";
import UserImage from "../assets/images/user.png";
import { clearSession, getSession } from "./Auth/Auth";
import axios from "axios";


class NavbarMenu extends React.Component {
  state = {
    linkupdate: false,
    notiData: [],
    Payment: [],
    notiPayment: false
  };
  componentDidMount() {
    this.props.tostMessageLoad(true);
    var res = window.location.pathname;
    res = res.split("/");
    res = res.length > 4 ? res[4] : "/";
    const { activeKey } = this.props;
    this.activeMenutabwhenNavigate("/" + activeKey);
    console.log(getSession('user')?.user.avatar, "test avt");

    const user = getSession('user')?.user
    this.getNotifications(user?.userId);
    this.fetchPaymentData(user?.userId)
  }

  // GET all noti by userId
  async getNotifications(userId) {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/Notification/GetNotificationByUserId`, {
        params: { userId: userId }
      });
      // Cập nhật state với dữ liệu thông báo nhận được
      this.setState({
        notiData: response.data // Thay `notifications` bằng tên state bạn muốn dùng
      });
      console.log(this.state.notiData);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }


  // Update status when user readed noti
  async handleNoti(myNoti) {
    for (let index = 0; index < myNoti.length; index++) {
      try {
        const userNotificationId = myNoti[index]?.usernotifications[0]?.userNotificationId;
        if (userNotificationId) {
          await axios.get(`${process.env.REACT_APP_API_URL}/api/Notification/UpdateNotificationStatus`, {
            params: { UserNotificationID: userNotificationId }
          });
        }
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    }
  }

  async fetchPaymentData(parentId) {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/Tuition/parent/${parentId}`);

      // Kiểm tra mảng tuition trong từng sinh viên
      const hasTuition = response.data.some(payment => payment.tuition && payment.tuition.length > 0);

      // Cập nhật state
      this.setState({
        Payment: response.data,
        notiPayment: hasTuition,
      });
    } catch (error) {
      console.error("Error fetching payment data: ", error);
      this.setState({ notiPayment: false });
    }
  }


  // Chỉ cập nhật khi toggleNotification chuyển từ mở sang đóng
  componentDidUpdate(prevProps) {
    if (prevProps.toggleNotification && !this.props.toggleNotification) {
      // Khi toggleNotification chuyển từ mở sang đóng, cập nhật trạng thái thông báo
      this.setState((prevState) => ({
        notiData: prevState.notiData.map(noti => {
          if (noti.usernotifications[0]?.status === 'Unread') {
            noti.usernotifications[0].status = 'Read';
          }
          return noti;
        })
      }));
    }
  }


  formatDateTime(datetimeStr) {
    // Tạo đối tượng Date từ chuỗi datetime
    const dateObj = new Date(datetimeStr);

    // Lấy giờ và phút
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');

    // Lấy ngày, tháng, năm
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Tháng tính từ 0-11 nên cần +1
    const year = dateObj.getFullYear();

    // Trả về chuỗi định dạng mới
    return `${hours}:${minutes} ${day} /${month}/${year} `;
  }

  activeMenutabwhenNavigate(activeKey) {
    if (
      activeKey === "/dashboard" ||
      activeKey === "/demographic"
    ) {
      this.activeMenutabContainer("dashboradContainer");
    }
    else if (
      activeKey === "/dashboardprin" 
    ) {
      this.activeMenutabContainer("DasboardPrinContainer");
    }
    else if (
      activeKey === "/category" ||
      activeKey === "/create-category"
    ) {
      this.activeMenutabContainer("categoryContainer");
    }
    else if (
      activeKey === "/service" ||
      activeKey === "/create-service" ||
      activeKey === "/chooservice"


    ) {
      this.activeMenutabContainer("ServiceContainer");
    }
    else if (
      activeKey === "/classviewclass" ||
      activeKey === "/viewclass" ||
      activeKey === "/viewclass2" ||
      activeKey === "/viewclass3"
    ) {
      this.activeMenutabContainer("ClassContainer");
    }

    else if (
      activeKey === "/viewmenu" ||
      activeKey === "/viewmenu2" ||
      activeKey === "/listmenu"
    ) {
      this.activeMenutabContainer("MenuContainer");
    }
    else if (
      activeKey === "/teacher"
    ) {
      this.activeMenutabContainer("TeacherContainer");
    }
    else if (
      activeKey === "/request"
    ) {
      this.activeMenutabContainer("RequestContainer");
    }
    else if (
      activeKey === "/locationActivity"
    ) {
      this.activeMenutabContainer("LocationActivityContainer");
    }
    else if (
      activeKey === "/schedule" ||
      activeKey === "/listschedule" ||
      activeKey === "/create-schedule"
    ) {
      this.activeMenutabContainer("scheduleContainer");
    }
    // PickupPersonContainer
    else if (
      activeKey === "/addpickupperson"
    ) {
      this.activeMenutabContainer("PickupPersonContainer");
    }
    else if (
      activeKey === "/listclasscheckin" ||
      activeKey === "/listclassattendance"
    ) {
      this.activeMenutabContainer("attendanceContainer");
    }
    else if (
      activeKey === "/checkattendparent"
    ) {
      this.activeMenutabContainer("AttendParentContainer");
    }
    else if (
      activeKey === "/" ||
      activeKey === "/viewallstudent" ||
      activeKey === "/createstudent"
    ) {
      this.activeMenutabContainer("ChildrenContainer");
    }
    else if (
      activeKey === "/" ||
      activeKey === "/viewclass" ||
      activeKey === "/createclass" ||
      activeKey === "/updateclass"
    ) {
      this.activeMenutabContainer("ClassContainer");
    }
    else if (
      activeKey === "/"
    ) {
      this.activeMenutabContainer("UserContainer");
    }
    else if (
      activeKey === "/" ||
      activeKey === "/payment" ||
      activeKey === "/history-payment"
    ) {
      this.activeMenutabContainer("PaymentContainer");
    }
    else if (
      activeKey === "/formvalidation" ||
      activeKey === "/basicelements"
    ) {
      this.activeMenutabContainer("FormsContainer");
    } else if (activeKey === "/tablenormal") {
      this.activeMenutabContainer("TablesContainer");
    } else if (activeKey === "/echart") {
      this.activeMenutabContainer("chartsContainer");
    } else if (activeKey === "/leafletmap") {
      this.activeMenutabContainer("MapsContainer");
    }
  }

  // activeMenutabContainer(id) {
  //   var parents = document.getElementById("main-menu");
  //   var activeMenu = document.getElementById(id);

  //   for (let index = 0; index < parents.children.length; index++) {
  //     if (parents.children[index].id !== id) {
  //       parents.children[index].classList.remove("active");
  //       parents.children[index].children[1].classList.remove("in");
  //     }
  //   }
  //   setTimeout(() => {
  //     activeMenu.classList.toggle("active");
  //     activeMenu.children[1].classList.toggle("in");
  //   }, 10);
  // }
  activeMenutabContainer(id) {
    const parents = document.getElementById("main-menu");
    const activeMenu = document.getElementById(id);

    // Kiểm tra nếu `parents` hoặc `activeMenu` tồn tại
    if (!parents || !activeMenu) {
      console.error("Element not found. Please check the DOM structure or provided id.");
      return;
    }

    // Loop qua các phần tử con của `parents`
    for (let index = 0; index < parents.children.length; index++) {
      const child = parents.children[index];

      // Loại bỏ class "active" khỏi tất cả menu
      child.classList.remove("active");

      // Kiểm tra nếu `child` có phần tử con thứ 2
      if (child.id !== id && child.children[1]) {
        child.classList.remove("active");
        child.children[1].classList.remove("in");
      }
    }

    // Thực hiện thao tác toggle với `activeMenu` sau khi xác nhận tồn tại
    setTimeout(() => {
      activeMenu.classList.toggle("active");
      // Kiểm tra nếu `activeMenu` có phần tử con thứ 2 trước khi thêm/tắt class
      if (activeMenu.children[1]) {
        activeMenu.children[1].classList.toggle("in");
      }
    }, 10);
  }


  handleLogOut = async (evt) => {
    evt.preventDefault();
    localStorage.removeItem('user')
    clearSession('user')
    window.location.href = "/";
  };



  render() {
    const userData = getSession('user')?.user;
    const roleId = userData.roleId
    const username = userData.firstname + " " + userData.lastName || "User"; // Thay "User" bằng tên mặc định nếu không có

    const {
      addClassactive,
      addClassactiveChildAuth,
      addClassactiveChildMaps,
      themeColor,
      toggleNotification,
      toggleEqualizer,
      sideMenuTab,
      isToastMessage,
      activeKey,
    } = this.props;
    var path = window.location.pathname;
    document.body.classList.add(themeColor);

    const { notiData, notiPayment } = this.state;
    const myNoti = notiData.filter(i => i?.usernotifications[0]?.status === 'Unread')
    const showNoti = notiData
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sắp xếp theo thời gian giảm dần
    // .slice(0, 4); // Lấy 5 phần tử đầu tiên

    return (
      <div>
        {/* {isToastMessage ? (
          <Toast
            id="toast-container"
            show={isToastMessage}
            onClose={() => {
              this.props.tostMessageLoad(false);
            }}
            className="toast-info toast-top-right"
            autohide={true}
            delay={5000}
          >
            <Toast.Header className="toast-info mb-0">
              Hello, welcome to KMS
            </Toast.Header>
          </Toast>
        ) : null} */}
        <nav className="navbar navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-btn">
              <button
                className="btn-toggle-offcanvas"
                onClick={() => {
                  this.props.onPressSideMenuToggle();
                }}
              >
                <i className="lnr lnr-menu fa fa-bars"></i>
              </button>
            </div>

            <div className="navbar-brand">
              {/* <a href=""> */}
              <img
                src={
                  document.body.classList.contains("full-dark")
                    ? LogoWhite
                    : Logo
                }
                alt="Lucid Logo"
                className="img-responsive logo"
              />
              {/* </a> */}
            </div>

            <div className="navbar-right">
              <form id="navbar-search" className="navbar-form search-form">
                <input
                  className="form-control"
                  placeholder="Search here..."
                  type="text"
                />
                <button type="button" className="btn btn-default">
                  <i className="icon-magnifier"></i>
                </button>
              </form>

              {notiPayment && <div className=" navbar-nav pt-3 d-none d-md-inline-block">
                <h6 className="text-danger">You have tuition fees need to pay for your child.</h6>
              </div>}

              <div id="navbar-menu">
                <ul className="nav navbar-nav">
                  <li>
                    <a
                      href="listschedule"
                      className="icon-menu d-none d-sm-block d-md-none d-lg-block"
                    >
                      <i className="icon-calendar"></i>
                    </a>
                  </li>
                  {/* Notification */}
                  <li
                    className={
                      toggleNotification ? "show dropdown" : "dropdown"
                    }
                  >
                    <a
                      href="#!"
                      className="dropdown-toggle icon-menu"
                      data-toggle="dropdown"
                      onClick={(e) => {
                        e.preventDefault();
                        this.props.onPressNotification();
                        this.handleNoti(myNoti);
                      }}
                    >
                      <i className="icon-bell"></i>
                      <span className={myNoti.length !== 0 ? `notification-dot` : 'd-none'}></span>
                    </a>
                    <ul
                      className={
                        toggleNotification
                          ? "dropdown-menu notifications show"
                          : "dropdown-menu notifications"
                      }
                      style={{ maxHeight: "350px", overflowY: "auto" }} // Thêm cuộn cho ul khi số lượng thông báo vượt quá 4
                    >
                      <li className="header text-light">
                        <strong>You have {myNoti.length} new Notifications</strong>
                      </li>
                      {showNoti && showNoti?.map((item, index) => {
                        return (
                          <li key={index}>
                            <a>
                              <div className="media">
                                <div className="media-left">
                                  <i className="icon-info text-info"></i>
                                </div>
                                <div className="media-body text-light">
                                  <p className="text">
                                    <strong>{item?.title}</strong>
                                  </p>
                                  <p className="text">
                                    {item?.message}
                                  </p>
                                  <span className="timestamp text-light">{this.formatDateTime(item?.createdAt)}</span>
                                </div>
                              </div>
                            </a>
                          </li>
                        );
                      })}
                      {/* <li className="footer">
                        <a className="more">See all notifications</a>
                      </li> */}
                    </ul>

                  </li>
                  <li>
                    <div className="icon-menu" onClick={this.handleLogOut}>
                      <i className="icon-login"></i>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* Hiển thị chỉ trên mobile (d-md-none) */}
          {notiPayment && <div className="navbar-nav d-md-none">
            <h5 className="text-danger ml-3">You have tuition fees need to pay for your child.</h5>
          </div>}

        </nav>

        <div id="left-sidebar" className="sidebar" style={{ zIndex: 9 }}>
          <div className="sidebar-scroll">
            <div className="user-account">
              <img
                src={getSession('user')?.user.avatar || UserImage}
                className="rounded-circle user-photo"
                alt="User Profile Picture"
                style={{
                  width: "50px",
                  height: "50px",
                }}
              />

              <Dropdown>
                <span>Welcome,</span>
                <Dropdown.Toggle
                  variant="none"
                  as="a"
                  id="dropdown-basic"
                  className="user-name"
                >
                  <strong>{username}</strong>
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu-right account">
                  <Dropdown.Item href="profilev1page">
                    <i className="icon-user"></i>My Profile
                  </Dropdown.Item>
                  <li className="divider"></li>
                  <Dropdown.Item onClick={this.handleLogOut}>
                    <i className="icon-power"></i>Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <hr />
            </div>
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <a
                  className={sideMenuTab[0] ? "nav-link active" : "nav-link"}
                  data-toggle="tab"
                  onClick={() => {
                    this.props.onPressSideMenuTab(0);
                  }}
                >
                  Menu
                </a>
              </li>

              <li className="nav-item">
                <a
                  className={sideMenuTab[2] ? "nav-link active" : "nav-link"}
                  data-toggle="tab"
                  onClick={() => {
                    this.props.onPressSideMenuTab(2);
                  }}
                >
                  <i className="icon-settings"></i>
                </a>
              </li>

            </ul>
            <div className="tab-content p-l-0 p-r-0">
              <div
                className={sideMenuTab[0] ? "tab-pane active show" : "tab-pane"}
                id="menu"
              >
                <Nav id="left-sidebar-nav" className="sidebar-nav">
                  <ul id="main-menu" className="metismenu">

                    {/* Dashboard */}
                    {roleId === 1 ? (
                      <li className="" id="dashboradContainer">
                        <a
                          href="#!"
                          className="has-arrow"
                          onClick={(e) => {
                            e.preventDefault();
                            this.activeMenutabContainer("dashboradContainer");
                          }}
                        >
                          <i className="icon-home"></i> <span>Dashboard</span>
                        </a>
                        <ul className="collapse">
                          <li
                            className={activeKey === "dashboard" ? "active" : ""}
                          >
                            <Link to="dashboard">Analytical</Link>
                          </li>
                          <li
                            className={
                              activeKey === "demographic" ? "active" : ""
                            }
                          >
                            <Link to="demographic">Demographic</Link>
                          </li>
                          <li className={activeKey === "ioT" ? "active" : ""}>
                            <Link to="ioT">IoT</Link>
                          </li>
                        </ul>
                      </li>
                    ) : null}
                      {/* Dashboard prin */}
                    {roleId === 4 ? (
                      <li id="DasboardPrinContainer" className="DasboardPrinContainer">
                        <a
                          href="#!"
                          className="has-arrow"
                          onClick={(e) => {
                            e.preventDefault();
                            this.props.history.push("/dashboardprin");
                            this.activeMenutabContainer("DasboardPrinContainer");
                          }}
                        >
                          <i className="icon-grid"></i> <span>Dashboard</span>
                        </a>
                      </li>
                    ) : null}
                    {/* UserAccount */}
                    {roleId === 1 ? (
                      <li id="UserContainer" className="">
                        <a
                          href="#!"
                          className="has-arrow"
                          onClick={(e) => {
                            e.preventDefault();
                            this.props.history.push("/user");
                            this.activeMenutabContainer("UserContainer");
                          }}
                        >
                          <i className="icon-grid"></i> <span>User</span>
                        </a>

                        <ul className="collapse">
                        </ul>
                      </li>
                    ) : null}

                    {/* Classes */}
                    {roleId === 2 || roleId === 3 || roleId === 4 || roleId === 5 ? (
                      <li id="ClassContainer" className="">
                        <a
                          href="#!"
                          className="has-arrow"
                          onClick={(e) => {
                            e.preventDefault();
                            this.activeMenutabContainer("ClassContainer");
                          }}
                        >
                          <i className="icon-grid"></i> <span>CLass Management</span>
                        </a>
                        <ul className="collapse">
                          {roleId === 3 || roleId === 4 ? (
                            <li
                              className={activeKey === "viewclass" ? "active" : ""}
                              onClick={() => { }}
                            >
                              <Link to="/viewclass">View Class</Link>
                            </li>
                          ) : null}
                          {roleId === 2 ? (
                            <li
                              className={activeKey === "viewclass2" ? "active" : ""}
                              onClick={() => { }}
                            >
                              <Link to="/viewclass2">View Class</Link>
                            </li>
                          ) : null}
                          {roleId === 5 ? (
                            <li
                              className={activeKey === "viewclass2" ? "active" : ""}
                              onClick={() => { }}
                            >
                              <Link to="/viewclass3">View Class</Link>
                            </li>
                          ) : null}
                          {roleId === 3 ? (
                            <li
                              className={activeKey === "createclass" ? "active" : ""}
                              onClick={() => { }}
                            >
                              <Link to="/createclass">Create Class</Link>
                            </li>
                          ) : null}
                        </ul>
                      </li>
                    ) : null}

                    {/* Category service */}
                    {/* {roleId === 3 ? (
                      <li className="" id="categoryContainer">
                        <a
                          href="#!"
                          className="has-arrow"
                          onClick={(e) => {
                            e.preventDefault();
                            this.activeMenutabContainer("categoryContainer");
                          }}
                        >
                          <i className="icon-globe"></i> <span>Category</span>
                        </a>
                        <ul className="collapse">
                          <li
                            className={activeKey === "category" ? "active" : ""}
                          >
                            <Link to="/category">List category service</Link>
                          </li>
                          <li
                            className={
                              activeKey === "create-category" ? "active" : ""
                            }
                          >
                            <Link to="/create-category">New category service</Link>
                          </li>
                        </ul>
                      </li>
                    ) : null} */}

                    {/* Services */}
                    {roleId === 4 || roleId === 3 ? (
                      <li id="ServiceContainer" className="">
                        <a
                          href="#!"
                          className="has-arrow"
                          onClick={(e) => {
                            e.preventDefault();
                            this.props.history.push("/service");
                            this.activeMenutabContainer("ServiceContainer");
                          }}
                        >
                          <i className="icon-grid"></i> <span>Services</span>
                        </a>
                      </li>
                    ) : null}

                    {/* Grade */}
                    {roleId === 4 ? (
                      <li id="GradeContainer" className="">
                        <a
                          href="#!"
                          className="has-arrow"
                          onClick={(e) => {
                            e.preventDefault(); // Ngăn chặn hành vi mặc định
                            this.props.history.push("/grade"); // Chuyển hướng đến route /grade
                            this.activeMenutabContainer("GradeContainer"); // Gọi hàm tùy chỉnh
                          }}
                        >
                          <i className="icon-grid"></i> <span>Grades</span>
                        </a>

                        <ul className="collapse">
                        </ul>
                      </li>
                    ) : null}

                    {/* Semester */}
                    {roleId === 3 ? (
                      <li id="SemesterContainer" className="">
                        <a
                          href="#!"
                          className="has-arrow"
                          onClick={(e) => {
                            e.preventDefault(); // Ngăn chặn hành vi mặc định
                            this.props.history.push("/semester"); // Chuyển hướng đến route /grade
                            this.activeMenutabContainer("SemesterContainer"); // Gọi hàm tùy chỉnh
                          }}
                        >
                          <i className="icon-grid"></i> <span>Semesters</span>
                        </a>

                        <ul className="collapse">
                        </ul>
                      </li>
                    ) : null}


                    {/* Menu */}
                    {roleId === 2 || roleId === 3 || roleId === 5 || roleId === 4 ? (
                      <li id="MenuContainer" className="">
                        <a
                          href="#!"
                          className="has-arrow"
                          onClick={(e) => {
                            e.preventDefault();
                            this.activeMenutabContainer("MenuContainer");
                          }}
                        >
                          <i className="icon-grid"></i> <span>Menu Management</span>
                        </a>
                        <ul className="collapse">
                          {roleId === 2 || roleId === 5 ? (
                            <li
                              className={activeKey === "viewmenu2" ? "active" : ""}
                              onClick={() => { }}
                            >
                              <Link to="/viewmenu2">View Menu</Link>
                            </li>
                          ) : null}

                          {roleId === 3 ? (
                            <li
                              className={activeKey === "viewmenu" ? "active" : ""}
                              onClick={() => { }}
                            >
                              <Link to="/viewmenu">View Menu</Link>
                            </li>
                          ) : null}

                          {roleId === 4 ? (
                            <li
                              className={activeKey === "listmenu" ? "active" : ""}
                              onClick={() => { }}
                            >
                              <Link to="/listmenu">List Menu</Link>
                            </li>
                          ) : null}
                        </ul>
                      </li>
                    ) : null}

                    {/* Daily Schedule */}
                    {roleId === 2 || roleId === 3 || roleId === 4 || roleId === 5 ? (
                      <li id="scheduleContainer" className="">
                        <a
                          href="#!"
                          className="has-arrow"
                          onClick={(e) => {
                            e.preventDefault();
                            this.props.history.push("/listschedule");
                            this.activeMenutabContainer("scheduleContainer");
                          }}
                        >
                          <i className="icon-grid"></i> <span>Daily Schedule</span>
                        </a>
                      </li>
                    ) : null}


                    {/* Albums */}
                    {roleId === 2 || roleId === 3 || roleId === 5 ? (
                      <li id="AlbumContainer" className="">
                        <a
                          href="#!"
                          className="has-arrow"
                          onClick={(e) => {
                            e.preventDefault(); // Ngăn chặn hành vi mặc định
                            this.props.history.push("/album"); // Chuyển hướng đến route /grade
                            this.activeMenutabContainer("AlbumContainer"); // Gọi hàm tùy chỉnh
                          }}
                        >
                          <i className="icon-grid"></i> <span>Albums Manager</span>
                        </a>
                      </li>
                    ) : null}


                    {/* Children */}
                    {roleId === 3 ? (
                      <li id="ChildrenContainer" className="">
                        <a
                          href="#!"
                          className="has-arrow"
                          onClick={(e) => {
                            e.preventDefault();
                            this.activeMenutabContainer("ChildrenContainer");
                          }}
                        >
                          <i className="icon-grid"></i> <span>Student Management</span>
                        </a>
                        <ul className="collapse">

                          <li
                            className={activeKey === "viewallstudent" ? "active" : ""}
                            onClick={() => { }}
                          >
                            <Link to="/viewallstudent">View All Student</Link>
                          </li>
                          <li
                            className={activeKey === "classviewclass" ? "active" : ""}
                            onClick={() => { }}
                          >
                            <Link to="/createstudent">Create Student</Link>
                          </li>
                        </ul>
                      </li>
                    ) : null}


                    {/* Teachers */}
                    {roleId === 3 ? (

                      <li id="TeacherContainer" className="">
                        <a
                          href="#!"
                          className="has-arrow"
                          onClick={(e) => {
                            e.preventDefault();
                            this.props.history.push("/teacher");
                            this.activeMenutabContainer("TeacherContainer");
                          }}
                        >
                          <i className="icon-grid"></i> <span>Teacher Manager</span>
                        </a>

                      </li>
                    ) : null}
                    {/* Teachers */}
                    {roleId === 2 ? (

                      <li id="PickupPersonContainer" className="">
                        <a
                          href="#!"
                          className="has-arrow"
                          onClick={(e) => {
                            e.preventDefault();
                            this.props.history.push("/addpickupperson");
                            this.activeMenutabContainer("PickupPersonContainer");
                          }}
                        >
                          <i className="icon-grid"></i> <span>Pickup Person Manager</span>
                        </a>

                      </li>
                    ) : null}
                    {/* Requests */}
                    {roleId === 2 || roleId === 3 || roleId === 4 || roleId === 5 ? (
                      <li id="RequestContainer" className="">
                        <a
                          href="#!"
                          className="has-arrow"
                          onClick={(e) => {
                            e.preventDefault(); // Ngăn chặn hành vi mặc định
                            this.props.history.push("/request"); // Chuyển hướng đến route /grade
                            this.activeMenutabContainer("RequestContainer"); // Gọi hàm tùy chỉnh
                          }}
                        >
                          <i className="icon-grid"></i> <span>Request Manager</span>
                        </a>
                      </li>
                    ) : null}

                    {/* Location Activity */}
                    {roleId === 3 || roleId === 4 ? (
                      <li id="LocationActivityContainer" className="">
                        <a
                          href="#!"
                          className="has-arrow"
                          onClick={(e) => {
                            e.preventDefault(); // Ngăn chặn hành vi mặc định
                            this.props.history.push("/locationActivity");
                            this.activeMenutabContainer("LocationActivityContainer"); // Gọi hàm tùy chỉnh
                          }}
                        >
                          <i className="icon-grid"></i> <span>Location and Activity</span>
                        </a>
                      </li>
                    ) : null}

                    {/* Payment */}
                    {roleId === 2 ? (
                      <li id="PaymentContainer" className="">
                        <a
                          href="#!"
                          className="has-arrow"
                          onClick={(e) => {
                            e.preventDefault();
                            this.props.history.push("/payment");
                            this.activeMenutabContainer("PaymentContainer");
                          }}
                        >
                          <i className="icon-grid"></i> <span>Payment Manager</span>
                        </a>
                      </li>
                    ) : null}

                    {/* Check in/out */}
                    {roleId === 5 ? (
                      <li id="attendanceContainer" className="">
                        <a
                          href="#!"
                          className="has-arrow"
                          onClick={(e) => {
                            e.preventDefault();
                            this.activeMenutabContainer("attendanceContainer");
                          }}
                        >
                          <i className="icon-grid"></i> <span>Attendance</span>
                        </a>
                        <ul className="collapse">
                          <li
                            className={activeKey === "listclasscheckin" ? "active" : ""}
                            onClick={() => { }}
                          >
                            <Link to="/checkin">Check in/out</Link>
                          </li>
                          <li
                            className={activeKey === "listclassattendance" ? "active" : ""}
                            onClick={() => { }}
                          >
                            <Link to="/listclassattendance">Attendance</Link>
                          </li>
                        </ul>

                      </li>
                    ) : null}
                    {/* Payment */}
                    {roleId === 2 ? (
                      <li id="AttendParentContainer" className="">
                        <a
                          href="#!"
                          className="has-arrow"
                          onClick={(e) => {
                            e.preventDefault();
                            this.activeMenutabContainer("AttendParentContainer");
                          }}
                        >
                          <i className="icon-grid"></i> <span>Attend</span>
                        </a>
                        <ul className="collapse">
                          <li
                            className={activeKey === "checkattendparent" ? "active" : ""}
                            onClick={() => { }}
                          >
                            <Link to="/viewattendparent">Attend</Link>
                          </li>

                        </ul>
                      </li>
                    ) : null}


                  </ul>
                </Nav>
              </div>
              <div
                className={
                  sideMenuTab[2]
                    ? "tab-pane p-l-15 p-r-15 show active"
                    : "tab-pane p-l-15 p-r-15"
                }
                id="setting"
              >
                <h6>Choose Mode</h6>
                <ul className="choose-skin list-unstyled">
                  <li
                    data-theme="white"
                    className={
                      document.body.classList.contains("full-dark")
                        ? ""
                        : "active"
                    }
                    onClick={() => {
                      this.setState({ somethi: false });
                      document.body.classList.remove("full-dark");
                    }}
                  >
                    <div className="white"></div>
                    <span>Light</span>
                  </li>
                  <li
                    data-theme="black"
                    className={
                      document.body.classList.contains("full-dark")
                        ? "active"
                        : ""
                    }
                    onClick={() => {
                      this.setState({ somethi: true });
                      document.body.classList.add("full-dark");
                    }}
                  >
                    <div className="black"></div>
                    <span>Dark</span>
                  </li>
                </ul>
                <hr />
                <h6>Choose Skin</h6>
                <ul className="choose-skin list-unstyled">
                  <li
                    data-theme="purple"
                    className={themeColor === "theme-purple" ? "active" : ""}
                  >
                    <div
                      className="purple"
                      onClick={() => {
                        if (themeColor !== "theme-purple") {
                          document.body.classList.remove(themeColor);
                        }
                        this.props.onPressThemeColor("purple");
                      }}
                    ></div>
                    <span>Purple</span>
                  </li>
                  <li
                    data-theme="blue"
                    className={themeColor === "theme-blue" ? "active" : ""}
                  >
                    <div
                      className="blue"
                      onClick={() => {
                        if (themeColor !== "theme-blue") {
                          document.body.classList.remove(themeColor);
                        }
                        this.props.onPressThemeColor("blue");
                      }}
                    ></div>
                    <span>Blue</span>
                  </li>
                  <li
                    data-theme="cyan"
                    className={`${themeColor === "theme-cyan" ? "active" : ""} ${themeColor === "theme-cyan" ? "active" : ""} `}
                  >
                    <div
                      className="cyan"
                      onClick={() => {
                        if (themeColor !== "theme-cyan") {
                          document.body.classList.remove(themeColor);
                        }
                        this.props.onPressThemeColor("cyan");
                      }}
                    ></div>
                    <span>Cyan</span>
                  </li>
                  <li
                    data-theme="green"
                    className={themeColor === "theme-green" ? "active" : ""}
                  >
                    <div
                      className="green"
                      onClick={() => {
                        if (themeColor !== "theme-green") {
                          document.body.classList.remove(themeColor);
                        }
                        this.props.onPressThemeColor("green");
                      }}
                    ></div>
                    <span>Green</span>
                  </li>
                  <li
                    data-theme="orange"
                    className={themeColor === "theme-orange" ? "active" : ""}
                  >
                    <div
                      className="orange"
                      onClick={() => {
                        if (themeColor !== "theme-orange") {
                          document.body.classList.remove(themeColor);
                        }
                        this.props.onPressThemeColor("orange");
                      }}
                    ></div>
                    <span>Orange</span>
                  </li>
                  <li
                    data-theme="blush"
                    className={themeColor === "theme-blush" ? "active" : ""}
                  >
                    <div
                      className="blush"
                      onClick={() => {
                        if (themeColor !== "theme-blush") {
                          document.body.classList.remove(themeColor);
                        }
                        this.props.onPressThemeColor("blush");
                      }}
                    ></div>
                    <span>Blush</span>
                  </li>
                </ul>
                <hr />
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

NavbarMenu.propTypes = {
  addClassactive: PropTypes.array.isRequired,
  addClassactiveChild: PropTypes.array.isRequired,
  addClassactiveChildApp: PropTypes.array.isRequired,
  addClassactiveChildFM: PropTypes.array.isRequired,
  addClassactiveChildBlog: PropTypes.array.isRequired,
  addClassactiveChildUI: PropTypes.array.isRequired,
  addClassactiveChildWidgets: PropTypes.array.isRequired,
  addClassactiveChildAuth: PropTypes.array.isRequired,
  addClassactiveChildPages: PropTypes.array.isRequired,
  addClassactiveChildForms: PropTypes.array.isRequired,
  addClassactiveChildTables: PropTypes.array.isRequired,
  addClassactiveChildChart: PropTypes.array.isRequired,
  addClassactiveChildMaps: PropTypes.array.isRequired,
  themeColor: PropTypes.string.isRequired,
  generalSetting: PropTypes.array.isRequired,
  toggleNotification: PropTypes.bool.isRequired,
  toggleEqualizer: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ navigationReducer }) => {
  const {
    addClassactive,
    addClassactiveChild,
    addClassactiveChildApp,
    addClassactiveChildFM,
    addClassactiveChildBlog,
    addClassactiveChildUI,
    addClassactiveChildWidgets,
    addClassactiveChildAuth,
    addClassactiveChildPages,
    addClassactiveChildForms,
    addClassactiveChildTables,
    addClassactiveChildChart,
    addClassactiveChildMaps,
    themeColor,
    generalSetting,
    toggleNotification,
    toggleEqualizer,
    menuProfileDropdown,
    sideMenuTab,
    isToastMessage,
  } = navigationReducer;
  return {
    addClassactive,
    addClassactiveChild,
    addClassactiveChildApp,
    addClassactiveChildFM,
    addClassactiveChildBlog,
    addClassactiveChildUI,
    addClassactiveChildWidgets,
    addClassactiveChildAuth,
    addClassactiveChildPages,
    addClassactiveChildForms,
    addClassactiveChildTables,
    addClassactiveChildChart,
    addClassactiveChildMaps,
    themeColor,
    generalSetting,
    toggleNotification,
    toggleEqualizer,
    menuProfileDropdown,
    sideMenuTab,
    isToastMessage,
  };
};

export default connect(mapStateToProps, {
  onPressDashbord,
  onPressDashbordChild,
  onPressThemeColor,
  onPressGeneralSetting,
  onPressNotification,
  onPressEqualizer,
  onPressSideMenuToggle,
  onPressMenuProfileDropdown,
  onPressSideMenuTab,
  tostMessageLoad,
})(NavbarMenu);
