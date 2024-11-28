import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
// import { withRouter } from 'react-router-dom';
import axios from "axios";
import Login from "../Login";
import { getSession } from "../../components/Auth/Auth";
import { addNotificationByRoleId, addNotificationByUserId } from "../../components/Common/Notification";
import Notification from "../../components/Notification";
import Pagination from "../../components/Common/Pagination";



class ScheduleList extends React.Component {
  state = {
    ScheduleListData: [],
    classData: [],
    semesterListData: [],
    myChild: [],

    showNotification: false, // State to control notification visibility
    notificationText: "", // Text for the notification
    notificationType: "success", // Type of notification (success or error)

    searchText: "",
    filterStatus: "all", // Giá trị 'all', '1', hoặc '0' để lọc trạng thái

    currentPage: 1,
    itemsPerPage: 5,
  };

  componentDidMount() {
    const userData = getSession('user')?.user;
    const roleId = userData.roleId
    if (!userData) {
      this.props.history.push("/login");  // Nếu cookie không tồn tại hoặc không hợp lệ, chuyển hướng về login
      return;
    }
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {

        // Nếu là Teacher (roleId = 5), lấy danh sách classId mà giáo viên đó dạy
        let allowedClassIds = [];
        if (roleId === 5) { // Teacher
          try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/Class/GetClassesByTeacherId/${userData.userId}`);
            allowedClassIds = response.data?.map((cls) => cls.classId) || [];
          } catch (error) {
            console.error("Error fetching teacher's classes: ", error);
          }
          console.log(allowedClassIds);

        } else if (roleId === 2) { // Parent
          try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/Children/GetAllChildren`);
            // Lấy tất cả classId từ danh sách con
            const myChild = response.data?.filter(child => child.parentId === userData.userId)
            allowedClassIds = myChild.reduce((acc, student) => {
              student.classes.forEach(cls => {
                if (!acc.includes(cls.classId)) {
                  acc.push(cls.classId); // Thêm classId nếu chưa có trong mảng
                }
              });
              return acc;
            }, []);
            this.setState({ myChild });
          } catch (error) {
            console.error("Error fetching parent's children: ", error);
          }
        }
        axios.get(`${process.env.REACT_APP_API_URL}/api/Schedule/GetAllSchedules`)
          .then((response) => {
            const allSchedules = response.data;
            // Lọc dữ liệu nếu là Teacher (roleId = 5) hoặc Parent (roleId = 2)
            const filteredSchedules = (roleId === 5 || roleId === 2)
              ? allSchedules.filter((schedule) => allowedClassIds.includes(schedule.classId))
              : allSchedules;
            this.setState({ ScheduleListData: filteredSchedules });
          })
          .catch((error) => {
            console.error("Error fetching data: ", error);
          });

        axios.get(`${process.env.REACT_APP_API_URL}/api/Semester/GetAllSemester`)
          .then((response) => {
            this.setState({ semesterListData: response.data });
          })
          .catch((error) => {
            console.error("Error fetching data: ", error);
          });

        axios.get(`${process.env.REACT_APP_API_URL}/api/Class/GetAllClass`)
          .then((response) => {
            this.setState({ classData: response.data });
          })
          .catch((error) => {
            console.error("Error fetching data: ", error);
          });

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();

  }

  // Function to handle status change and call API
  handleStatusChange = async (data, scheduleId, newStatus) => {
    try {
      let formdata = {
        scheduleId,
        startDate: data?.startDate,
        endDate: data?.endDate,
        classId: data?.classId,
        status: newStatus,
        classId: data?.classId,
        teacherName: data?.teacherName
      }
      await axios.put(`${process.env.REACT_APP_API_URL}/api/Schedule/UpdateSchedule`, formdata);

      // tao thong bao moi
      addNotificationByUserId('UserId', 'content', 21);
      // addNotificationByRoleId('RoleId', 'content', 3);

      // Update the state locally after a successful API call
      this.setState((prevState) => ({
        ScheduleListData: prevState.ScheduleListData.map(schedule =>
          schedule.scheduleId === scheduleId ? { ...schedule, status: newStatus } : schedule
        )
      }));
      this.setState({
        notificationText: "Status updated successfully!",
        notificationType: "success",
        showNotification: true
      });
    } catch (error) {
      console.error("Error updating status:", error);
      this.setState({
        notificationText: "Status updated Error!",
        notificationType: "error",
        showNotification: true
      });
    }
  };

  handleDetailSchedule = (classId) => {
    this.props.history.push(`/schedule?classId=${classId}`);
  }

  handleCreateSchedule = () => {
    this.props.history.push(`/create-schedule`);
  }

  handleSearchChange = (e) => {
    this.setState({ searchText: e.target.value });
  };

  handleStatusFilterChange = (e) => {
    this.setState({ filterStatus: e.target.value });
  };

  handleClassSelectChange = (event) => {
    const selectedStudentId = event.target.value;
    if (selectedStudentId === 'all') {
      this.setState({ selectedClassId: null }); // Nếu chọn 'All Your Children', bỏ lọc theo classId
    } else {
      const selectedChild = this.state.myChild.find(child => child.studentId.toString() === selectedStudentId);
      this.setState({
        selectedClassId: selectedChild?.classes?.map(cls => cls.classId) || [] // Lấy tất cả classId của child đã chọn
      });
    }
  };

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  render() {
    const { ScheduleListData, classData, semesterListData, myChild, selectedClassId } = this.state;
    const { searchText, filterStatus } = this.state;

    const { showNotification, notificationText, notificationType } = this.state;


    const statusOptions = [
      { value: 1, label: "Active", className: "badge-success" },
      { value: 2, label: "Inactive", className: "badge-danger" },
      { value: 0, label: "Pending", className: "badge-default" },
    ];

    const userData = getSession('user')?.user;
    const roleId = userData?.roleId



    // Lọc danh sách
    console.log(ScheduleListData);

    const filteredSchedules = ScheduleListData
      .filter((item) => {

        const classDetail = classData?.find(i => i.classId === item?.classId);
        const semesterDetail = semesterListData?.find(i => i.semesterId === classDetail?.semesterId);

        // Điều kiện tìm kiếm
        const classNameMatch = classDetail?.className?.toLowerCase().includes(searchText.toLowerCase());
        const semesterNameMatch = semesterDetail?.name?.toLowerCase().includes(searchText.toLowerCase());

        // Điều kiện lọc trạng thái
        const statusMatch = filterStatus === "all" ? true : item.status.toString() === filterStatus;

        // Lọc theo classId nếu có
        const classIdMatch = selectedClassId ? selectedClassId.includes(item.classId) : true;

        // Kết hợp tất cả các điều kiện
        return (classNameMatch || semesterNameMatch) && statusMatch && classIdMatch;

      }
      );

    // phan trang
    const { currentPage, itemsPerPage } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSchedules.slice(indexOfFirstItem, indexOfLastItem);

    return (
      <div
        style={{ flex: 1 }}
        onClick={() => {
          document.body.classList.remove("offcanvas-active");
        }}
      >
        {showNotification && (
          <Notification
            type={notificationType}
            position="top-right"
            dialogText={notificationText}
            show={showNotification}
            onClose={() => this.setState({ showNotification: false })}
          />
        )}
        <div>
          <div className="container-fluid">
            <PageHeader
              HeaderText="Schedule List"
              Breadcrumb={[
                { name: "Schedule List", navigate: "" },
              ]}
            />
            <div className="row clearfix">

              <div className="col-lg-12 col-md-12">
                <div className="card planned_task">
                  <div className="header d-flex justify-content-between">
                    <h2>Schedule List</h2>
                    {myChild && myChild.length !== 0 ?
                      <div className="col-md-3 mb-2" onChange={(e) => this.handleClassSelectChange(e)}>
                        <select className="form-control">
                          <option value="all">All Your Children</option>
                          {myChild.map((child, index) => (
                            <option key={index} value={child.studentId}>
                              {child.fullName} {/* Hiển thị tên của child */}
                            </option>
                          ))}
                        </select>
                      </div>
                      :
                      <div className="col-md-3 mb-2">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by Name"
                          value={searchText}
                          onChange={this.handleSearchChange}
                        />
                      </div>
                    }
                    {roleId !== 2 && roleId !== 5 ?
                      <div className="col-md-3  mb-2">
                        <select
                          className="form-control"
                          value={filterStatus}
                          onChange={this.handleStatusFilterChange}
                        >
                          <option value="all">All Status</option>
                          <option value="1">Active</option>
                          <option value="2">Inactive</option>
                          <option value="0">Pending</option>
                        </select>
                      </div>
                      : <></>}

                    {roleId === 3 ? (
                      <a onClick={() => this.handleCreateSchedule()} class="btn btn-success text-white">Create New Schedule</a>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="card">
                  <div className="body project_report">
                    <div className="table-responsive">
                      <table className="table m-b-0 table-hover">
                        <thead className="theme-color">
                          <tr>
                            <th>#</th>
                            <th>Class</th>
                            <th>Semeter</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Create By</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems?.map((request, index) => {
                            const classDetail = classData?.find(i => i.classId === request?.classId)
                            const semesterDetail = semesterListData?.find(i => i.semesterId === classDetail?.semesterId)
                            return (
                              <React.Fragment key={"schedule" + index}>
                                <tr>
                                  <td>{index + 1}</td>
                                  <td
                                    onClick={() => this.handleDetailSchedule(request?.classId)}
                                    style={{ cursor: 'pointer' }}
                                    className="theme-color"
                                  >{classDetail?.className}</td>
                                  <td>
                                    {semesterDetail?.name}
                                  </td>
                                  <td>{semesterDetail?.startDate?.split("T")[0]}</td>
                                  <td>{semesterDetail?.endDate?.split("T")[0]}</td>
                                  <td>{request?.createBy || 'Staff'}</td>

                                  {(roleId === 4) ? (
                                    <td>
                                      <select
                                        value={request.status}
                                        onChange={(e) => this.handleStatusChange(request, request.scheduleId, parseInt(e.target.value))}
                                        className={`form-control ${request?.status === 1 ? 'badge-success' : request?.status === 2 ? 'badge-danger' : 'badge-default'}`}
                                      >
                                        {statusOptions.map(option => (
                                          <option key={option.value} value={option.value} className={option.className}>
                                            {option.label}
                                          </option>
                                        ))}
                                      </select>
                                    </td>
                                  ) : (roleId === 2 || roleId === 3 || roleId === 5) && (
                                    <td>
                                      <span className={`badge ${request?.status === 1 ? 'badge-success' : request?.status === 2 ? 'badge-danger' : 'badge-default'}`}>
                                        {statusOptions.find(option => option.value === request.status)?.label || 'Unknown'}
                                      </span>
                                    </td>
                                  )}


                                </tr>
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="pt-4">
                      <Pagination
                        currentPage={currentPage}
                        totalItems={filteredSchedules.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={this.handlePageChange}
                      />
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

const mapStateToProps = ({ ioTReducer }) => ({
  isSecuritySystem: ioTReducer.isSecuritySystem,
});

export default connect(mapStateToProps)((ScheduleList));
