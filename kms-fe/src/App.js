import React from "react";
import { connect } from "react-redux";
import { Route, Switch, withRouter } from "react-router-dom";
import Login from "./screens/Login";
import dashboard from "./screens/Dashbord/Dashbord";
import demographic from "./screens/Dashbord/Demographic";
import ioT from "./screens/Dashbord/IoT";
import NavbarMenu from "./components/NavbarMenu";
import forgotpassword from "./screens/Auth/ForgotPassword";
import resetpassword from "./screens/Auth/ResetPassword";
import page404 from "./screens/Auth/Page404";
import maintanance from "./screens/Pages/Maintanance";
import viewclass from "./screens/Class/ViewClass";
import createclass from "./screens/Class/CreateClass";
import updateclass from "./screens/Class/UpdateClass";
import viewallstudent from "./screens/Children/ViewAllChildren";
import viewstudentbyID from "./screens/Children/ViewChildrenByID"
import createstudent from "./screens/Children/AddChildren"
import Category from "./screens/CategoryService/Category";
import CategoryCreate from "./screens/CategoryService/CategoryCreate";
import CategoryDetail from "./screens/CategoryService/CategoryDetail";
import CategoryUpdate from "./screens/CategoryService/CategoryUpdate";
import Service from "./screens/Service/Service";
import ServiceCreate from "./screens/Service/ServiceCreate";
import ServiceDetail from "./screens/Service/ServiceDetail";
import ServiceUpdate from "./screens/Service/ServiceUpdate";
import TeacherDetail from "./screens/Teacher/TeacherDetail";
import TeacherList from "./screens/Teacher/TeacherList";
import TeacherUpdate from "./screens/Teacher/TeacherUpdate";
import RequestList from "./screens/Request/RequestList";
import RequestDetail from "./screens/Request/RequestDetail";
import RequestUpdate from "./screens/Request/RequestUpdate";
import RequestCreate from "./screens/Request/RequestCreate";
import ViewMenu from "./screens/Menu/ViewMenu"
import ProtectedRoute from "./components/Router/ProtectRouter";
import Schedule from "./screens/Schedule/Schedule";
import ScheduleList from "./screens/Schedule/ScheduleList";
import Checkin from "./screens/Attendance/Checkin";
import ListClassCheckin from "./screens/Attendance/ListClassCheckin";
import UpdateMenu from "./screens/Menu/UpdateMenu";
import profilev1page from "./screens/Pages/ProfileV1";
import ListMenu from "./screens/Menu/ListMenu"
import ViewChildrenbyClassID from "./screens/Children/ViewChildrenbyClassID";
import ViewMenuByTeacherAndParent from "./screens/Menu/ViewMenuByTeacherAndParent";
import UpdateClassByPrincipal from "./screens/Class/UpdateClassByPrincipal";
import ViewClassByParentAndTeacher from "./screens/Class/ViewClassByParent";
import ViewClassByTeacher from "./screens/Class/ViewClassByTeacher";
import ViewAttendByParent from "./screens/Attendance/ViewAttendByParent";
import ChooseService from "./screens/Service/ChooseService";
import ScheduleCreate from "./screens/Schedule/ScheduleCreate";
import ScheduleDetailCreate from "./screens/Schedule/ScheduleDetailCreate";

import AlbumList from "./screens/Album/AlbumList";
import AlbumDetail from "./screens/Album/AlbumDetail";
import AlbumCreate from "./screens/Album/AlbumCreate";
import PaymentList from "./screens/Payment/PaymentList";
import PaymentHistory from "./screens/Payment/PaymentHistory";
import DashboardPrincipal from "./screens/Dashbord/DashboardPrincipal";
import AddPickupPerson from "./screens/Pickup_Person/AddPickupPerson";
import ListClassAttend from "./screens/Attendance/ListClassAttend";
import Attend from "./screens/Attendance/Attend";

import LocationActivityList from "./screens/LocatonActivity/LocationActivityList";
import Grade from "./screens/Grade/Grade";
import GradeCreate from "./screens/Grade/GradeCreate";
import GradeDetail from "./screens/Grade/GradeDetail";
import GradeUpdate from "./screens/Grade/GradeUpdate";
import Semester from "./screens/Semester/Semester";
import SemesterUpdate from "./screens/Semester/SemesterUpdate";
import SemesterCreate from "./screens/Semester/SemesterCreate";
import UserList from "./screens/User/UserList";
import UserCreate from "./screens/User/UserCreate";
import ListPickupPerson from "./screens/Pickup_Person/ListPickupPerson";
window.__DEV__ = true;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
    };
  }
  render() {

    var res = window.location.pathname;
    var baseUrl = process.env.PUBLIC_URL;
    baseUrl = baseUrl.split("/");
    res = res.split("/");
    res = res.length > 0 ? res[baseUrl.length] : "/";
    res = res ? res : "/";
    const activeKey1 = res;

    return (
      <div id="wrapper">
        {activeKey1 === "" ||
          activeKey1 === "/" ||
          activeKey1 === "login" ||
          activeKey1 === "forgotpassword" ||
          activeKey1 === "resetpassword" ||
          activeKey1 === "page404" ||
          activeKey1 === "maintanance" ? (
          <Switch>
            <Route exact path={`${process.env.PUBLIC_URL}/`} component={Login} />
            <Route exact path={`${process.env.PUBLIC_URL}/login`} component={Login} />
            <Route exact path={`${process.env.PUBLIC_URL}/forgotpassword`} component={forgotpassword} />
            <Route exact path={`${process.env.PUBLIC_URL}/resetpassword`} component={resetpassword} />
            <Route exact path={`${process.env.PUBLIC_URL}/page404`} component={page404} />
            <Route exact path={`${process.env.PUBLIC_URL}/maintanance`} component={maintanance} />
          </Switch>
        ) : (
          <>
            <NavbarMenu history={this.props.history} activeKey={activeKey1} />
            <div id="main-content">
              <Switch>
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/dashboard`}
                  component={dashboard}
                  allowedRoles={[1, 3]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/category`}
                  component={Category}
                  allowedRoles={[3]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/create-category`}
                  component={CategoryCreate}
                  allowedRoles={[3]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/category-detail/:categoryServiceId`}
                  component={CategoryDetail}
                  allowedRoles={[3]}

                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/category-update/:categoryServiceId`}
                  component={CategoryUpdate}
                  allowedRoles={[3]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/service`}
                  component={Service}
                  allowedRoles={[2, 3, 4]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/create-service`}
                  component={ServiceCreate}
                  allowedRoles={[3]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/service-detail/:serviceId`}
                  component={ServiceDetail}
                  allowedRoles={[2, 3, 4]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/service-update/:serviceId`}
                  component={ServiceUpdate}
                  allowedRoles={[3, 4]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/teacher`}
                  component={TeacherList}
                  allowedRoles={[3]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/teacher-detail/:teacherId`}
                  component={TeacherDetail}
                  allowedRoles={[2, 3, 5]}

                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/teacher-update/:teacherId`}
                  component={TeacherUpdate}
                  allowedRoles={[3]}
                />

                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/request`}
                  component={RequestList}
                  allowedRoles={[2, 3, 4, 5]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/request-detail/:requestId`}
                  component={RequestDetail}
                  allowedRoles={[2, 3, 4, 5]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/request-update/:requestId`}
                  component={RequestUpdate}
                  allowedRoles={[2, 3, 4, 5]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/create-request`}
                  component={RequestCreate}
                  allowedRoles={[2]}
                />


                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/grade`}
                  component={Grade}
                  allowedRoles={[4]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/grade-detail/:gradeId`}
                  component={GradeDetail}
                  allowedRoles={[4]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/grade-update/:gradeId`}
                  component={GradeUpdate}
                  allowedRoles={[4]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/create-grade`}
                  component={GradeCreate}
                  allowedRoles={[4]}
                />

                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/semester`}
                  component={Semester}
                  allowedRoles={[3]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/semester-update/:semesterId`}
                  component={SemesterUpdate}
                  allowedRoles={[3]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/create-semester`}
                  component={SemesterCreate}
                  allowedRoles={[3]}
                />

                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/user`}
                  component={UserList}
                  allowedRoles={[1]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/create-user`}
                  component={UserCreate}
                  allowedRoles={[1]}
                />

                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/locationActivity`}
                  component={LocationActivityList}
                  allowedRoles={[3, 4]}
                />

                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/viewallstudent`}
                  component={viewallstudent}
                  allowedRoles={[1, 2, 3]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/createstudent`}
                  component={createstudent}
                  allowedRoles={[2, 3]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/viewstudentbyID/:studentID`}
                  component={viewstudentbyID}
                  allowedRoles={[1, 2, 4, 3]}

                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/viewclass`}
                  component={viewclass}
                  allowedRoles={[3, 4]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/viewclass2`}
                  component={ViewClassByParentAndTeacher}
                  allowedRoles={[2]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/viewclass3`}
                  component={ViewClassByTeacher}
                  allowedRoles={[5]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/createclass`}
                  component={createclass}
                  allowedRoles={[3]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/updateclass/:classId`}
                  component={updateclass}
                  allowedRoles={[3]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/updateclass2/:classId`}
                  component={UpdateClassByPrincipal}
                  allowedRoles={[4]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/viewchildrenbyclassid/:classId`}
                  component={ViewChildrenbyClassID}
                  allowedRoles={[2, 3, 4, 5]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/viewmenu`}
                  component={ViewMenu}
                  allowedRoles={[3]}
                />

                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/updatemenu`}
                  component={UpdateMenu}
                  allowedRoles={[3]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/schedule`}
                  component={Schedule}
                  allowedRoles={[2, 3, 4, 5]}
                />

                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/listschedule`}
                  component={ScheduleList}
                  allowedRoles={[2, 3, 4, 5]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/create-schedule`}
                  component={ScheduleCreate}
                  allowedRoles={[3]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/create-scheduledetail`}
                  component={ScheduleDetailCreate}
                  allowedRoles={[3]}
                />

                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/album`}
                  component={AlbumList}
                  allowedRoles={[2, 3, 4, 5]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/create-album`}
                  component={AlbumCreate}
                  allowedRoles={[3, 5]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/album-detail/:albumId`}
                  component={AlbumDetail}
                  allowedRoles={[2, 3, 4, 5]}
                />
                {/* <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/service-update/:serviceId`}
                  component={ServiceUpdate}
                  allowedRoles={[3, 4]}
                /> */}

                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/listmenu`}
                  component={ListMenu}
                  allowedRoles={[4]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/viewmenu2`}
                  component={ViewMenuByTeacherAndParent}
                  allowedRoles={[2, 5]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/profilev1page`}
                  component={profilev1page}
                  allowedRoles={[1, 2, 3, 4, 5]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/checkin`}
                  component={Checkin}
                  allowedRoles={[5]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/listclasscheckin`}
                  component={ListClassCheckin}
                  allowedRoles={[5]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/listclassattendance`}
                  component={ListClassAttend}
                  allowedRoles={[5]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/attend/:classId`}
                  component={Attend}
                  allowedRoles={[5]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/viewattendparent`}
                  component={ViewAttendByParent}
                  allowedRoles={[2]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/payment`}
                  component={PaymentList}
                  allowedRoles={[2,3,4,5]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/payment-history`}
                  component={PaymentHistory}
                  allowedRoles={[2,3,4,5]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/chooseservice`}
                  component={ChooseService}
                  allowedRoles={[2]}
                />
               
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/dashboardprin`}
                  component={DashboardPrincipal}
                  allowedRoles={[4]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/addpickupperson`}
                  component={AddPickupPerson}
                  allowedRoles={[2]}
                />
                <ProtectedRoute
                  exact
                  path={`${process.env.PUBLIC_URL}/listpickupperson`}
                  component={ListPickupPerson}
                  allowedRoles={[2]}
                />
              </Switch>
            </div>
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ loginReducer }) => ({
  isLoggedin: loginReducer.isLoggedin,
});

export default withRouter(connect(mapStateToProps, {})(App));
