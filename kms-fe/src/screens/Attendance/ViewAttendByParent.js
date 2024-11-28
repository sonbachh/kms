import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { withRouter } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import moment from "moment";
import "react-calendar/dist/Calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";

let isMounted = false; // Khai báo isMounted như biến thông thường

class ViewAttendByParent extends React.Component {
  state = {
    studentId: "",
    childerParent: [],
    attendanceData: [],
    selectedWeek: "",
    showCalendar: false,
    highlightedWeek: null,
    weekAttendance: [],
    startOfCurrentWeek: moment().startOf("isoWeek"),
    summary: {
      total: 0,
      attended: 0,
      late: 0,
      absence: 0,
    },
  };

  componentDidMount() {
    isMounted = true; // Đặt isMounted thành true khi component mount
    window.scrollTo(0, 0);

    const user = JSON.parse(sessionStorage.getItem("user"));
    const parentID = user?.user?.userId;

    if (!parentID) {
      console.error("Parent ID not found");
      return;
    }

    const startOfWeek = this.state.startOfCurrentWeek;
    const endOfWeek = startOfWeek.clone().endOf("isoWeek");

    this.setState({
      selectedWeek: `${startOfWeek.format("DD/MM/YYYY")} - ${endOfWeek.format("DD/MM/YYYY")}`,
      startOfCurrentWeek: startOfWeek,
    });

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/Request/GetStudentsByParentId/${parentID}`)
      .then((response) => {
        if (isMounted) {
          this.setState({ childerParent: response.data });
        }
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
      });
  }

  componentWillUnmount() {
    isMounted = false; // Đặt isMounted thành false khi component unmount
  }

  fetchAttendanceData = async (studentId) => {
    const { startOfCurrentWeek } = this.state;

    try {
      // Lấy dữ liệu điểm danh của tuần (Attend)
      const attendanceResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/Attendance/GetAttendanceByStudentId`,
        {
          params: {
            studentId,
            type: "Attend",
            date: startOfCurrentWeek.format("YYYY-MM-DD"),
          },
        }
      );

      // Lấy dữ liệu Checkin
      const checkinResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/Attendance/GetAttendanceByStudentId`,
        {
          params: {
            studentId,
            type: "Checkin",
            date: startOfCurrentWeek.format("YYYY-MM-DD"),
          },
        }
      );

      // Lấy dữ liệu Checkout
      const checkoutResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/Attendance/GetAttendanceByStudentId`,
        {
          params: {
            studentId,
            type: "Checkout",
            date: startOfCurrentWeek.format("YYYY-MM-DD"),
          },
        }
      );

      // Gộp tất cả dữ liệu lại
      const attendanceData = attendanceResponse.data.map((attendance) => {
        // Tìm Checkin và Checkout tương ứng với ngày
        const checkin = checkinResponse.data.find((item) =>
          moment(item.createdAt).isSame(attendance.createdAt, "day")
        );
        const checkout = checkoutResponse.data.find((item) =>
          moment(item.createdAt).isSame(attendance.createdAt, "day")
        );

        return {
          ...attendance,
          checkinImageUrl: checkin?.attendanceDetail[0]?.imageUrl || null,
          checkoutImageUrl: checkout?.attendanceDetail[0]?.imageUrl || null,
        };
      });

      if (isMounted) {
        this.setState({ attendanceData }, this.updateSummary);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu điểm danh:", error);
    }
  };


  handleStudentChange = (e) => {
    const studentId = e.target.value;

    // Xác định tuần hiện tại
    const startOfWeek = moment().startOf("isoWeek");
    const endOfWeek = startOfWeek.clone().endOf("isoWeek");

    // Cập nhật `studentId` và đặt tuần về tuần hiện tại
    this.setState(
      {
        studentId,
        selectedWeek: `${startOfWeek.format("DD/MM/YYYY")} - ${endOfWeek.format("DD/MM/YYYY")}`,
        startOfCurrentWeek: startOfWeek,
      },
      () => {
        // Gọi `updateWeekAttendance` để lấy dữ liệu điểm danh của tuần hiện tại cho học sinh mới
        this.updateWeekAttendance(startOfWeek, endOfWeek);
      }
    );
  };

  updateSummary = () => {
    if (!isMounted) return;

    const { attendanceData } = this.state;

    // Đảm bảo `total` là số lượng phần tử hợp lệ trong `attendanceData`
    const validAttendanceData = attendanceData.filter(att => att && att.attendanceDetail && att.attendanceDetail.length > 0);

    const summary = {
      total: validAttendanceData.length,
      attended: validAttendanceData.filter(
        (att) => att.attendanceDetail[0]?.status === "Attend"
      ).length,
      late: validAttendanceData.filter(
        (att) => att.attendanceDetail[0]?.status === "Muộn"
      ).length,
      absence: validAttendanceData.filter(
        (att) => att.attendanceDetail[0]?.status === "Absence"
      ).length,
    };

    this.setState({ summary });
  };

  handleDayHover = (date) => {
    const startOfWeek = moment(date).startOf("isoWeek");
    const endOfWeek = moment(date).endOf("isoWeek");
    this.setState({ highlightedWeek: { start: startOfWeek, end: endOfWeek } });
  };

  handleDaySelect = (date) => {
    const startOfWeek = moment(date).startOf("isoWeek");
    const endOfWeek = moment(date).endOf("isoWeek");

    this.setState(
      {
        selectedWeek: `${startOfWeek.format("DD/MM/YYYY")} - ${endOfWeek.format("DD/MM/YYYY")}`,
        showCalendar: false,
        highlightedWeek: null,
        startOfCurrentWeek: startOfWeek,
      },
      () => this.updateWeekAttendance(startOfWeek, endOfWeek)
    );
  };

  updateWeekAttendance = async (startOfWeek, endOfWeek) => {
    const { studentId } = this.state;

    if (!studentId || !startOfWeek || !endOfWeek) {
      console.warn("Student ID, startOfWeek, or endOfWeek is missing.");
      return;
    }

    try {
      // Lấy dữ liệu Attend
      const attendanceResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/Attendance/GetAttendanceByStudentId`,
        {
          params: {
            studentId,
            type: "Attend",
            date: startOfWeek.format("YYYY-MM-DD"),
          },
        }
      );

      // Lấy dữ liệu Checkin
      const checkinResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/Attendance/GetAttendanceByStudentId`,
        {
          params: {
            studentId,
            type: "Checkin",
            date: startOfWeek.format("YYYY-MM-DD"),
          },
        }
      );

      // Lấy dữ liệu Checkout
      const checkoutResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/Attendance/GetAttendanceByStudentId`,
        {
          params: {
            studentId,
            type: "Checkout",
            date: startOfWeek.format("YYYY-MM-DD"),
          },
        }
      );

      // Tạo mảng ngày trong tuần
      const weekDays = Array.from({ length: 7 }, (_, i) =>
        startOfWeek.clone().add(i, "days").format("YYYY-MM-DD")
      );

      // Gộp dữ liệu Attendance, Checkin và Checkout
      const weekAttendanceData = weekDays.map((date) => {
        const dayAttendance = attendanceResponse.data.find((attendance) =>
          moment(attendance.createdAt).isSame(date, "day")
        );
        const checkin = checkinResponse.data.find((item) =>
          moment(item.createdAt).isSame(date, "day")
        );
        const checkout = checkoutResponse.data.find((item) =>
          moment(item.createdAt).isSame(date, "day")
        );

        let status = "No Data";
        let checkinImageUrl = null;
        let checkoutImageUrl = null;

        if (dayAttendance && dayAttendance.attendanceDetail.length > 0) {
          status = dayAttendance.attendanceDetail[0].status;
        }

        if (checkin && checkin.attendanceDetail.length > 0) {
          checkinImageUrl = checkin.attendanceDetail[0].imageUrl;
        }

        if (checkout && checkout.attendanceDetail.length > 0) {
          checkoutImageUrl = checkout.attendanceDetail[0].imageUrl;
        }

        return {
          date,
          status,
          checkinImageUrl,
          checkoutImageUrl,
        };
      });

      if (isMounted) {
        this.setState({ weekAttendance: weekAttendanceData, attendanceData: attendanceResponse.data }, this.updateSummary);
      }
    } catch (error) {
      console.error("Error fetching weekly attendance data:", error);
    }
  };


  toggleCalendar = () => {
    this.setState((prevState) => ({ showCalendar: !prevState.showCalendar }));
  };

  render() {
    const {
      childerParent,
      studentId,
      selectedWeek,
      showCalendar,
      highlightedWeek,
      weekAttendance,
      summary,
    } = this.state;

    return (
      <div className="container mt-4">
        <PageHeader
          HeaderText="Attendance Management"
          Breadcrumb={[
            { name: "Attendance Management", navigate: "" },
            { name: "View Attendance", navigate: "" },
          ]}
        />

        {/* Filter Section */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label fw-bold">Select Child</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="icon-user"></i>
                </span>
                <select
                  className="form-select"
                  value={studentId}
                  onChange={this.handleStudentChange}
                >
                  <option value="">Choose Student</option>
                  {childerParent.map((option) => (
                    <option key={option.studentId} value={option.studentId}>
                      {option.fullName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Week Selection */}
          <div className="col-md-6">
            <label className="form-label fw-bold">Selected Week</label>
            <div className="input-group">
              <span className="input-group-text" onClick={this.toggleCalendar} style={{ cursor: "pointer" }}>
                <i className="fa fa-calendar"></i>
              </span>
              <input
                type="text"
                className="form-control"
                value={selectedWeek || "Select a week"}
                onClick={this.toggleCalendar}
                readOnly
              />
            </div>

            {showCalendar && (
              <div
                className="calendar-popup"
                style={{
                  position: "absolute",
                  zIndex: 1000,
                  backgroundColor: "white",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              >
                <Calendar
                  onMouseOver={({ activeStartDate }) => this.handleDayHover(activeStartDate)}
                  onClickDay={(date) => this.handleDaySelect(date)}
                  tileContent={({ date, view }) => {
                    if (view === "month") {
                      const startOfWeek = highlightedWeek && highlightedWeek.start;
                      const endOfWeek = highlightedWeek && highlightedWeek.end;
                      if (
                        startOfWeek &&
                        endOfWeek &&
                        moment(date).isBetween(startOfWeek, endOfWeek, null, "[]")
                      ) {
                        return <div className="bg-info text-white rounded">{date.getDate()}</div>;
                      }
                    }
                    return null;
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="row text-center mb-4">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">All</h5>
                <p className="card-text">{summary.total}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h5 className="card-title">Attended</h5>
                <p className="card-text">{summary.attended}</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card bg-danger text-white">
              <div className="card-body">
                <h5 className="card-title">Absence</h5>
                <p className="card-text">{summary.absence}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Table for Selected Week */}
        <div className="row mt-4">
          <div className="col-12">
            <h5>Attendance Details for Week of {selectedWeek}</h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Status</th>
                  <th>Checkin Image</th> {/* Cột Checkin Image */}
                  <th>Checkout Image</th> {/* Cột Checkout Image */}
                </tr>
              </thead>
              <tbody>
                {weekAttendance.map((attendance, index) => (
                  <tr key={index}>
                    <td>{moment(attendance.date).format("DD/MM/YYYY")}</td>
                    <td>{moment(attendance.date).format("dddd")}</td>
                    <td>
                      {attendance.status === "Attend" && (
                        <span className="badge bg-success">Attended</span>
                      )}
                      {attendance.status === "Muộn" && (
                        <span className="badge bg-warning">Late</span>
                      )}
                      {attendance.status === "Absence" && (
                        <span className="badge bg-danger">Absence</span>
                      )}
                      {attendance.status === "No Data" && (
                        <span className="badge bg-secondary">No Data</span>
                      )}
                    </td>
                    <td>
                      {attendance.checkinImageUrl ? (
                        <img
                          src={attendance.checkinImageUrl}
                          alt="Checkin"
                          style={{ width: "100px", height: "auto" }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td>
                      {attendance.checkoutImageUrl ? (
                        <img
                          src={attendance.checkoutImageUrl}
                          alt="Checkout"
                          style={{ width: "100px", height: "auto" }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ ioTReducer }) => ({
  isSecuritySystem: ioTReducer.isSecuritySystem,
});

export default connect(mapStateToProps)(withRouter(ViewAttendByParent));
