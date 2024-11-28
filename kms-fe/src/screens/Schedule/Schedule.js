import React from "react";
// import { withRouter } from "react-router-dom";
import "./Schedule.css"; // Tạo file CSS riêng cho các style
import PageHeader from "../../components/PageHeader";
import axios from "axios";
import Modal from "react-bootstrap/Modal"; // Import Bootstrap Modal
import Button from "react-bootstrap/Button";
import { getSession } from "../../components/Auth/Auth";
import * as XLSX from 'xlsx';
import Notification from "../../components/Notification";



class Schedule extends React.Component {

  getCurrentWeek = () => {
    const today = new Date();
    const vietnamTimezoneOffset = 7 * 60; // GMT+7 offset in minutes
    today.setMinutes(today.getMinutes() + today.getTimezoneOffset() + vietnamTimezoneOffset);

    // Tính ngày đầu tuần (Thứ Hai)
    const dayOfWeek = today.getDay(); // 0 = Chủ nhật, 1 = Thứ Hai, ..., 6 = Thứ Bảy
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Điều chỉnh về Thứ Hai
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + mondayOffset);

    // Tính tuần dựa trên ngày đầu tuần
    const startYear = new Date(startOfWeek.getFullYear(), 0, 1);
    const days = Math.floor((startOfWeek - startYear) / (24 * 60 * 60 * 1000));
    const currentWeek = Math.ceil((days + startYear.getDay() + 1) / 7);
    const year = startOfWeek.getFullYear();

    return `${year}-W${currentWeek.toString().padStart(2, '0')}`;
  };


  // get Start date and end date
  getWeekStartEnd = (selectedWeek) => {
    const [year, week] = selectedWeek?.split('-W');
    const firstDayOfYear = new Date(year, 0, 1);
    const days = (week - 1) * 7;
    const startDate = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + days - firstDayOfYear.getDay() + 1));
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // Ngày kết thúc tuần

    // Tạo một mảng chứa các ngày trong tuần từ thứ 2 đến chủ nhật
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      weekDates.push(day);
    }

    // Helper function to format date as 'DD/MM/YYYY'
    const formatToDDMMYYYY = (date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    return {
      startDate: formatToDDMMYYYY(startDate),
      endDate: formatToDDMMYYYY(endDate),
      weekDates: weekDates.map(formatToDDMMYYYY) // Mảng chứa tất cả các ngày trong tuần
    };
  };

  state = {
    scheduleData: [],
    scheduleDetails: [],

    classData: [],
    daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    timeslots: ['07:00 - 08:00', '08:00 - 08:30', '08:30 - 10:30',
      '10:30 - 11:30', '11:30 - 12:00', '12:00 - 14:00', '14:00 - 14:30',
      '14:30 - 15:00', '15:00 - 15:30', '15:30 - 16:00', '16:00 - 17:00'],

    selectedWeek: this.getCurrentWeek(), // Lấy tuần hiện tại làm mặc định
    selectId: '',
    startDate: this.getWeekStartEnd(this.getCurrentWeek()).startDate,  // Corrected here
    endDate: this.getWeekStartEnd(this.getCurrentWeek()).endDate,      // Corrected here
    className: '',
    showModal: false, // Để quản lý việc mở/đóng modalm
    selectedSlot: null, // Để lưu thông tin của slot được chọn
    activities: [],
    locations: [],

    showNotification: false, // State to control notification visibility
    notificationText: "", // Text for the notification
    notificationType: "success", // Type of notification (success or error)

  };


  componentDidMount() {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/Class/GetAllClass`);
        const data = response.data;

        const urlParams = new URLSearchParams(this.props.location.search);
        const defaultClassId = urlParams.get('classId') || '';

        const activityrespone = await axios.get(`${process.env.REACT_APP_API_URL}/api/Schedule/GetAllActivities`);
        const activitydata = activityrespone.data;

        const locationrespone = await axios.get(`${process.env.REACT_APP_API_URL}/api/Schedule/GetAllLocations`);
        const locationdata = locationrespone.data;

        // Update state with the default class and then fetch schedule data
        this.setState({
          classData: data,
          selectId: defaultClassId,
          activities: activitydata,
          locations: locationdata
        }, async () => {
          // Fetch schedule data only after state update
          const { startDate, endDate, selectId } = this.state;
          await this.fetchScheduleData(startDate, endDate, selectId);
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }

  fetchScheduleData = async (startDate, endDate, selectId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/Schedule/GetSchedulesByClassId?classId=${selectId}`
      );
      const scheduleData = response.data;
      const userData = getSession("user").user;
      const roleId = userData.roleId;

      console.log(scheduleData);
      if (scheduleData.length > 0) {
        const scheduleId = scheduleData[0].scheduleId;

        // if (roleId === 2 && scheduleData[0].status !== 2) {
        this.setState({
          scheduleData: scheduleData,
          scheduleDetails: [], // No details for status 0
        });
        //   return;
        // }

        const detailResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/ScheduleDetail/GetAllScheduleDetailsByScheduleId/${scheduleId}`
        );
        const scheduleDetails = detailResponse.data;
        console.log(scheduleDetails);

        const weekdate = startDate + '-' + endDate
        let newscheduleData = scheduleDetails.filter(i => i.weekdate === weekdate)
        console.log(newscheduleData);
        console.log(weekdate);

        // Set both scheduleData and scheduleDetails into state
        this.setState({
          scheduleDetails: newscheduleData,
        });
      } else {
        // No schedule data for the selected week and class, ensure schedule is empty
        this.setState({
          scheduleData: [],    // Ensure data is cleared if no data is found
          scheduleDetails: [], // Ensure details are cleared as well
        });
        console.log('No schedule found for the selected week and class.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      this.setState({
        scheduleData: [],    // Clear data on error as well
        scheduleDetails: [], // Clear details on error
      });
    }
  };

  handleSlotClick = (slotDetail) => {
    if (slotDetail) {
      this.setState({
        showModal: true,
        selectedSlot: {
          id: slotDetail?.scheduleDetailId || '',
          activityId: slotDetail.activityId || '',
          activityName: slotDetail.activityName || '',  // Đảm bảo không có lỗi khi không có giá trị
          locationId: slotDetail.locationId || '',
          locationName: slotDetail.locationName || '',  // Gán giá trị mặc định là rỗng nếu không có

          timeSlotId: slotDetail.timeSlotId || '',
          note: slotDetail.note || '',
          day: slotDetail.day || '',
          scheduleId: slotDetail.scheduleId || '',
          scheduleDetailId: slotDetail.scheduleDetailId || '',
          timeSlotName: slotDetail.timeSlotName || '',
          weekdate: slotDetail.weekdate || '',

        }
      });
    }
  };

  handleCloseModal = () => {
    this.setState({ showModal: false, selectedSlot: null });
  };

  handleSaveSlotDetails = async () => {
    const { selectedSlot, activities, locations } = this.state;

    // Find the selected activity and location IDs based on the names chosen in the dropdowns
    const activity = activities.find(act => act.activityName === selectedSlot.activityName);
    const location = locations.find(loc => loc.locationName === selectedSlot.locationName);

    // Guard clause to check if both activity and location are selected
    if (!activity || !location) {
      alert("Please select a valid activity and location.");
      return;
    }

    console.log(selectedSlot);
    console.log(activity);
    console.log(location);


    try {
      // Make the PUT request to update the slot with selected activity and location IDs
      await axios.put(`${process.env.REACT_APP_API_URL}/api/ScheduleDetail/UpdateScheduleDetailById/${selectedSlot.id}`, {
        timeSlotId: selectedSlot.timeSlotId,
        note: selectedSlot.note,
        day: selectedSlot.day,
        scheduleId: selectedSlot.scheduleId,
        scheduleDetailId: selectedSlot.scheduleDetailId,
        timeSlotName: selectedSlot.timeSlotName,
        weekdate: selectedSlot.weekdate,


        activityId: activity.activityId,
        activityName: activity.activityName,
        locationId: location.locationId,
        locationName: location.locationName,
      });
      this.handleCloseModal(); // Close modal after successful update
      this.setState({
        notificationText: "Slot details updated successfully!",
        notificationType: "success",
        showNotification: true
      });
      // Refetch the schedule data to reflect the changes on the interface
      const { startDate, endDate, selectId } = this.state;
      await this.fetchScheduleData(startDate, endDate, selectId);
    } catch (error) {
      console.error("Error updating slot: ", error);
      this.setState({
        notificationText: "Failed to update slot. Please try again.",
        notificationType: "error",
        showNotification: true
      });
    }
  };



  handleChange = async (type, event) => {
    let { startDate, endDate, selectId } = this.state;

    const weekDatesDefault = this.getWeekStartEnd(this.state.selectedWeek);
    this.setState({ startDate: weekDatesDefault.startDate, endDate: weekDatesDefault.endDate });

    if (type === "class") {
      selectId = event.target.value;
      this.setState({ selectId });
      // Cập nhật URL với classId mới
      this.props.history.push({
        pathname: '/schedule', // Đặt tên đường dẫn hiện tại
        search: `?classId=${selectId}` // Thêm query parameter với classId mới
      });
    } else if (type === "week") {
      const selectedWeek = event.target.value;
      this.setState({ selectedWeek });
      const weekDates = this.getWeekStartEnd(selectedWeek);
      console.log(weekDates);

      startDate = weekDates.startDate;
      endDate = weekDates.endDate;
      this.setState({ startDate, endDate });
    }
    // Clear previous schedule data before fetching new data
    this.setState({
      scheduleData: [],    // Reset scheduleData
      scheduleDetails: [], // Reset scheduleDetails
    });
    console.log(startDate + "-" + endDate, selectId);
    // Call the separated API function
    await this.fetchScheduleData(startDate, endDate, selectId);
  };


  handleImportSchedule = async (event) => {
    // Ngăn chặn hành vi mặc định của form nếu bạn đang dùng trong một form
    event.preventDefault();
    const file = this.fileInput.files[0]; // Lấy file từ ref

    // Lấy classId từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const classId = urlParams.get('classId'); // Assumes classId is in query string

    if (!file) {
      alert("Please select a file to import!"); // Kiểm tra nếu không có file được chọn
      this.setState({
        notificationText: "Please select a file to import!",
        notificationType: "info",
        showNotification: true
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file); // Thêm file vào FormData

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/Schedule/Import/${classId}`, formData, {
        headers: {
          'accept': '*/*', // Chỉ để header này
        },
      });

      // Kiểm tra phản hồi từ API
      if (response.status === 200) {
        this.setState({
          notificationText: "Import successful!!",
          notificationType: "success",
          showNotification: true
        });
        // Có thể làm thêm các thao tác khác như refresh data...
        const { startDate, endDate, selectId } = this.state; // Lấy các giá trị cần thiết
        await this.fetchScheduleData(startDate, endDate, selectId); // Gọi lại hàm fetch dữ liệu
      }
    } catch (error) {
      console.error("Error importing schedule: ", error);
      this.setState({
        notificationText: "Failed to import schedule. Please try again.!!",
        notificationType: "error",
        showNotification: true
      });
    }
  };

  handleCreateSchedule = async (selectId) => {
    this.props.history.push(`/create-scheduledetail?classId=${selectId}`);
  }

  handleFileUpload = (e) => {
    const { scheduleDetails, daysOfWeek } = this.state;

    // Step 1: Group the data by timeSlotName and day
    const groupedData = scheduleDetails.reduce((acc, item) => {
      const slot = item.timeSlotName;

      // Initialize the entry for this slot if it doesn't exist yet
      if (!acc[slot]) {
        acc[slot] = { slot, ...daysOfWeek.reduce((days, day) => ({ ...days, [day]: "" }), {}) };
      }

      // Assign activity for the current day
      acc[slot][item.day] = `${item.activityName} - ${item.locationName}`;

      return acc;
    }, {});

    // Step 2: Convert grouped data into the required array format
    const dataExport = Object.values(groupedData);

    // Chuyển dữ liệu thành worksheet
    const ws = XLSX.utils.json_to_sheet(dataExport);


    // Tạo workbook từ worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Xuất file Excel
    XLSX.writeFile(wb, 'Schedule_data.xlsx');
  };

  handleDownload = () => {
    const link = document.createElement('a'); // Tạo thẻ a
    link.href = '/assets/excel/sample.xlsx';  // Đường dẫn đến file Excel
    link.download = 'sample.xlsx';             // Tên file khi tải về
    link.click();                             // Kích hoạt sự kiện click để tải file
  };



  renderTable = () => {
    const { scheduleData, daysOfWeek, timeslots, classData, selectId, scheduleDetails, selectedWeek } = this.state;
    const { showNotification, notificationText, notificationType } = this.state;

    const userData = (getSession("user")).user;
    const roleId = userData.roleId;

    console.log(scheduleDetails);
    // Lấy các ngày của tuần hiện tại
    const { weekDates } = this.getWeekStartEnd(selectedWeek);

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
              HeaderText="Schedule Detail"
              Breadcrumb={[{ name: "Schedule", navigate: "listschedule" },
              { name: "Schedule Detail", navigate: "" }
              ]}
            />
            <div className="row clearfix">
              <div className="col-lg-12 col-md-12">
                <div className="card planned_task">
                  <div className="header">
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center">
                      {/* Week and Class Select */}
                      <div className="d-flex flex-column flex-sm-row align-items-center mb-3 mb-sm-0">
                        <input
                          type="week"
                          value={this.state.selectedWeek}
                          onChange={(event) => this.handleChange("week", event)}
                          className="week-input"
                        />
                        <div className="ml-sm-4 mt-2 mt-sm-0">
                          <select
                            className="form-control"
                            value={selectId}
                            name="selectId"
                            required
                            onChange={(event) => this.handleChange("class", event)}
                          >
                            {classData.map((option) => (
                              <option key={option.classId} value={option.classId}>
                                {option.className}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Export and Import buttons */}
                      <div className="d-flex flex-column flex-sm-row align-items-center">
                        {roleId === 2 ? (
                          <a
                            onClick={this.handleFileUpload}
                            className="btn btn-success text-white mb-2 mb-sm-0"
                          >
                            <i className="icon-arrow-down mr-2"></i>Export Excel
                          </a>
                        ) : null}

                        {roleId === 3 ? (
                          <div className="d-flex flex-column flex-sm-row align-items-center">
                            <a
                              onClick={() => {
                                this.handleDownload();
                              }}
                              className="btn btn-success text-white mb-2 mb-sm-0 mr-sm-4"
                            >
                              <i className="icon-arrow-down mr-2"></i>Download Template
                            </a>
                            <a
                              onClick={() => this.fileInput.click()}
                              className="btn btn-primary text-white mb-2 mb-sm-0 mr-sm-4"
                            >
                              <i className="icon-arrow-up mr-2"></i>Import Excel
                            </a>
                            <input
                              type="file"
                              ref={(input) => (this.fileInput = input)}
                              style={{ display: 'none' }}
                              accept=".xlsx, .xls"
                              onChange={this.handleImportSchedule}
                            />

                            <a
                              onClick={() => {
                                this.handleCreateSchedule(selectId);
                              }}
                              className="btn btn-success text-white mb-2 mb-sm-0"
                            >
                              <i className="icon-plus mr-2"></i>Add Schedule Detail
                            </a>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div className="col-lg-12">
                <div className="card">
                  <div className="body project_report">
                    <div className="table-responsive">
                      {scheduleData[0]?.teacherName && (
                        <p className="pt-2 font-weight-bold">
                          <i className="icon-user m-1"></i> Homeroom Teacher:
                          {" " + scheduleData[0]?.teacherName}
                        </p>
                      )}
                      <table className="custom-table table table-bordered">
                        <thead className="thead-light schedule-head">
                          <tr>
                            <th style={{ width: '150px' }} className="text-center">Thời gian</th>
                            {/* Hiển thị các ngày tương ứng với thứ trong tuần */}
                            {daysOfWeek.map((day, index) => (
                              <th key={index}>
                                {day}  {"( " + weekDates[index] + " )"} {/* Ngày tương ứng với thứ */}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="schedule-head">
                          {timeslots.map((timeslot, timeslotIndex) => (
                            <tr key={timeslotIndex}>
                              {/* Display the time slot */}
                              <td className="thead-light sticky-col">
                                <strong>{timeslot}</strong>
                              </td>
                              {/* Loop through each day of the week */}
                              {daysOfWeek.map((day, dayIndex) => {
                                let result = scheduleDetails?.find(i => i.day === day && i.timeSlotName === timeslot)
                                return (
                                  <td key={dayIndex} onClick={() => this.handleSlotClick(result)}>
                                    {result ? (
                                      <div>
                                        <strong>{result?.activityName || 'No activity'}</strong>
                                        <div className="d-flex flex-column">
                                          {result?.locationName !== 'Trống' && (
                                            <span style={{ fontSize: 'smaller' }} className="pt-2">
                                              <i className="icon-layers m-1"></i>
                                              {result?.locationName}
                                            </span>
                                          )}

                                        </div>
                                      </div>
                                    ) : (
                                      <span>No activity</span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Modal để xem và cập nhật chi tiết */}
                      <Modal show={this.state.showModal} onHide={this.handleCloseModal}>
                        <Modal.Header closeButton>
                          <Modal.Title>Slot Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          {this.state.selectedSlot ? (
                            <div>
                              {/* Dropdown cho Activity Name */}
                              <label htmlFor="activityName">Activity Name:</label>
                              <select
                                id="activityName"
                                value={this.state.selectedSlot.activityName}
                                onChange={(e) =>
                                  this.setState({
                                    selectedSlot: {
                                      ...this.state.selectedSlot,
                                      activityName: e.target.value
                                    }
                                  })
                                }
                                className="form-control"
                              >
                                <option value="">Select an activity</option>
                                {this.state.activities.map((activity, index) => (
                                  <option key={index} value={activity?.activityName}>
                                    {activity?.activityName}
                                  </option>
                                ))}
                              </select>

                              {/* Dropdown cho Location */}
                              <label htmlFor="locationName" className="mt-3">Location:</label>
                              <select
                                id="locationName"
                                value={this.state.selectedSlot.locationName}
                                onChange={(e) =>
                                  this.setState({
                                    selectedSlot: {
                                      ...this.state.selectedSlot,
                                      locationName: e.target.value
                                    }
                                  })
                                }
                                className="form-control"
                              >
                                <option value="">Select a location</option>
                                {this.state.locations.map((location, index) => (
                                  <option key={index} value={location?.locationName}>
                                    {location?.locationName}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <p>No slot details available.</p>
                          )}
                        </Modal.Body>

                        <Modal.Footer>
                          <Button variant="secondary" onClick={this.handleCloseModal}>
                            Close
                          </Button>
                          <Button variant="primary" onClick={this.handleSaveSlotDetails}>
                            Save Changes
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12 col-md-12">
            <div className="table-container">
              {this.renderTable()}
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default (Schedule);
