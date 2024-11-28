import React from "react";
// import { withRouter } from "react-router-dom";
import "./Schedule.css"; // Tạo file CSS riêng cho các style
import PageHeader from "../../components/PageHeader";
import axios from "axios";
import Modal from "react-bootstrap/Modal"; // Import Bootstrap Modal
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { getSession } from "../../components/Auth/Auth";
import Notification from "../../components/Notification";


class ScheduleDetailCreate extends React.Component {

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
    scheduleId: 0,
    scheduleDetails: [],

    classData: [],
    daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    timeslots: ['07:00 - 08:00', '08:00 - 08:30', '08:30 - 10:30',
      '10:30 - 11:30', '11:30 - 12:00', '12:00 - 14:00', '14:00 - 14:30',
      '14:30 - 15:00', '15:00 - 15:30', '15:30 - 16:00', '16:00 - 17:00'],
    startWeek: '',
    endWeek: '',
    selectId: '',
    startDate: '',  // Corrected here
    endDate: '',      // Corrected here
    className: '',

    selectedSlot: null, // Để lưu thông tin của slot được chọn
    activities: [],
    locations: [],
    activity: '',
    slotDetails: [],
    weekdate: '',

    showLocation: false,

    showNotification: false, // State to control notification visibility
    notificationText: "", // Text for the notification
    notificationType: "success" // Type of notification (success or error)
  };


  componentDidMount() {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/Class/GetAllClass`);
        const data = response.data;

        const urlParams = new URLSearchParams(this.props.location.search);
        const defaultClassId = urlParams.get('classId') || '';

        const activityrespone = await axios.get(`${process.env.REACT_APP_API_URL}/api/LocationActivity/GetAllActivities`);
        const activitydata = activityrespone.data;

        const locationrespone = await axios.get(`${process.env.REACT_APP_API_URL}/api/LocationActivity/GetAllLocations`);
        const locationdata = locationrespone.data;


        console.log(activitydata);
        
        // Update state with the default class and then fetch schedule data
        this.setState({
          classData: data,
          selectId: defaultClassId,
          activities: activitydata?.filter(i=>i.status == 1),
          locations: locationdata?.filter(i=>i.status == 1),
        }, async () => {
          // Fetch schedule data only after state update
          const { selectId } = this.state;
          const Scheduleresponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/Schedule/GetSchedulesByClassId?classId=${selectId}`);
          const scheduleData = Scheduleresponse.data
          console.log(scheduleData);

          this.setState({
            scheduleData
          })
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }

  handleChange = async (type, event) => {
    let { selectId, scheduleId } = this.state;

    if (type === "class") {
      selectId = event.target.value;
      this.setState({ selectId });
      this.props.history.push({
        pathname: '/create-scheduledetail', // Đặt tên đường dẫn hiện tại
        search: `?classId=${selectId}` // Thêm query parameter với classId mới
      });
      try {
        // Khi thay đổi class, lấy lại scheduleId từ API
        const Scheduleresponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/Schedule/GetSchedulesByClassId?classId=${selectId}`);
        const scheduleData = Scheduleresponse.data;
        scheduleId = scheduleData[0]?.scheduleId || 0;

        this.setState({ scheduleData, scheduleId });

      } catch (error) {
        console.error("Error fetching schedule data:", error);
      }
    }
  };


  handleShowLocation = () => {
    this.setState({ showLocation: true });
  };

  handleCloselocation = () => {
    this.setState({ showLocation: false });
  };


  handleSlotChange = (slotKey, field, value) => {
    const [day, timeSlotName] = slotKey.split('/');
    const timeSlotId = this.state.timeslots.indexOf(timeSlotName) + 1;

    this.setState(prevState => {
      // Tạo bản sao của slotDetails và cập nhật phần tử tương ứng
      const updatedSlotDetails = {
        ...prevState.slotDetails,
        [slotKey]: {
          ...prevState.slotDetails[slotKey],
          [field]: value,
          timeSlotId: timeSlotId,
          timeSlotName: timeSlotName,
          day,
          weekdate: this.state.weekdate
        }
      };

      // Tạo mảng các key đã được sắp xếp theo thứ tự của `timeSlotId` trước và tăng dần theo `timeSlotName`
      const sortedKeys = Object.keys(updatedSlotDetails).sort((a, b) => {
        const [, timeSlotA] = a.split('/');
        const [, timeSlotB] = b.split('/');
        const timeSlotIdA = this.state.timeslots.indexOf(timeSlotA) + 1;
        const timeSlotIdB = this.state.timeslots.indexOf(timeSlotB) + 1;

        if (timeSlotIdA === 1 && timeSlotIdB !== 1) {
          return -1; // Đưa phần tử có `timeSlotId = 1` lên trước
        }
        if (timeSlotIdA !== 1 && timeSlotIdB === 1) {
          return 1; // Đưa phần tử có `timeSlotId = 1` lên trước
        }

        return timeSlotIdA - timeSlotIdB; // Sắp xếp theo thứ tự tăng dần của `timeSlotId`
      });

      // Tạo đối tượng `sortedSlotDetails` dựa trên `sortedKeys`
      const sortedSlotDetails = {};
      sortedKeys.forEach(key => {
        sortedSlotDetails[key] = updatedSlotDetails[key];
      });

      return { slotDetails: sortedSlotDetails };
    });
  };

  handleSaveSchedule = async () => {
    const { slotDetails, daysOfWeek, timeslots, scheduleData, startWeek, endWeek } = this.state;

    // Kiểm tra xem người dùng đã chọn startWeek và endWeek chưa
    if (!startWeek || !endWeek) {
      this.setState({
        notificationText: "Please select both the start week and end week.!",
        notificationType: "info",
        showNotification: true
      });
      return;
    }

    // Tạo danh sách tất cả các slotKeys để kiểm tra
    const allSlotKeys = [];
    for (let day of daysOfWeek) {
      for (let timeslot of timeslots) {
        const slotKey = `${day}/${timeslot}`;
        allSlotKeys.push(slotKey);
      }
    }

    // Kiểm tra xem tất cả các slotDetails có đầy đủ dữ liệu không
    const incompleteSlots = allSlotKeys.filter(slotKey => {
      const slot = slotDetails[slotKey];
      return !slot || !slot.activity || !slot.location;
    });

    if (incompleteSlots.length > 0) {
      this.setState({
        notificationText: "Please ensure all activity and location fields are filled out for all weekslots before saving.!",
        notificationType: "info",
        showNotification: true
      });
      return; // Dừng thực hiện nếu có bản ghi chưa điền đủ
    }

    // Parse start and end week
    const [startYear, startWeekNumber] = startWeek.split('-W');
    const [endYear, endWeekNumber] = endWeek.split('-W');

    // Kiểm tra nếu `endWeek` nhỏ hơn `startWeek`
    if (parseInt(startYear) > parseInt(endYear) || (startYear === endYear && parseInt(startWeekNumber) > parseInt(endWeekNumber))) {
      alert('Invalid week range! End week should be after or equal to the start week.');
      return;
    }

    // Convert start and end weeks to numbers for iteration
    const startWeekInt = parseInt(startWeekNumber);
    const endWeekInt = parseInt(endWeekNumber);
    const yearInt = parseInt(startYear);

    // Check if the input weeks are valid
    if (startWeekInt > endWeekInt) {
      alert('Invalid week range! Start week should be before end week.');
      return;
    }

    // Loop through each week and duplicate schedule
    for (let week = startWeekInt; week <= endWeekInt; week++) {
      const weekString = `${yearInt}-W${week.toString().padStart(2, '0')}`;
      const weekDates = this.getWeekStartEnd(weekString);

      const formattedDetails = Object.keys(slotDetails).map(slotKey => ({
        timeSlotId: slotDetails[slotKey].timeSlotId || 0,
        activityId: this.state.activities.find(act => act.activityName === slotDetails[slotKey].activity)?.activityId || 0,
        locationId: this.state.locations.find(loc => loc.locationName === slotDetails[slotKey].location)?.locationId || 0,
        note: slotDetails[slotKey].note || "",
        day: slotDetails[slotKey].day || "",
        scheduleId: scheduleData[0]?.scheduleId || 0,
        weekdate: weekDates.startDate + '-' + weekDates.endDate, // Set the week date
        timeSlotName: slotDetails[slotKey].timeSlotName || "",
        activityName: slotDetails[slotKey].activity || "",
        locationName: slotDetails[slotKey].location || ""
      }));

      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/ScheduleDetail/AddListScheduleDetails`, formattedDetails);
        console.log(`Schedule for week ${weekString} saved successfully!`, response.data);

      } catch (error) {
        this.setState({
          notificationText: "Failed to save schedule. Please try again !",
          notificationType: "error",
          showNotification: true
        });
      }
    }
    this.setState({
      notificationText: "Save and Duplicate Schedule successfully!",
      notificationType: "success",
      showNotification: true
    });
  };


  handleCreateLocation = () => {
    const { newLocationName } = this.state;
    if (!newLocationName.trim()) {
      this.setState({
        notificationText: "Please enter a location name.",
        notificationType: "info",
        showNotification: true
      });
      return;
    }

    axios.post(`${process.env.REACT_APP_API_URL}/api/LocationActivity/AddLocation`, {
      locationName: newLocationName,
    })
      .then((response) => {
        this.setState({
          notificationText: "Location added successfully!",
          notificationType: "success",
          showNotification: true
        });
        // Gọi lại API để lấy danh sách mới nhất
        axios.get(`${process.env.REACT_APP_API_URL}/api/LocationActivity/GetAllLocations`)
          .then((response) => {
            this.setState({
              locations: response.data, // Cập nhật lại LocationListData từ API
              newLocationName: "", // Reset lại tên địa điểm
              showModalLocation: false, // Đóng modal sau khi thêm thành công
            });
          })
          .catch((error) => {
            console.error("Error fetching updated locations: ", error);
          });
      })
      .catch((error) => {
        console.error("Error adding location: ", error);
        this.setState({
          notificationText: "Failed to add location. Please try again.!",
          notificationType: "error",
          showNotification: true
        });
      });
  };

  handleShowModalLocation = () => {
    this.setState({ showModalLocation: true });
  };

  handleCloseModalLocation = () => {
    this.setState({ showModalLocation: false, newLocationName: "" });
  };

  handleInputChangeLocation = (event) => {
    this.setState({ newLocationName: event.target.value });
  };


  handleCreateActivity = () => {
    const { newActivityName } = this.state;
    if (!newActivityName.trim()) {
      this.setState({
        notificationText: "Please enter a Activity name!",
        notificationType: "info",
        showNotification: true
      });
      return;
    }

    axios.post(`${process.env.REACT_APP_API_URL}/api/LocationActivity/AddActivity`, {
      activityName: newActivityName,
    })
      .then((response) => {
        this.setState({
          notificationText: "Activity added successfully!",
          notificationType: "success",
          showNotification: true
        });
        // Gọi lại API để lấy danh sách mới nhất
        axios.get(`${process.env.REACT_APP_API_URL}/api/LocationActivity/GetAllActivities`)
          .then((response) => {
            this.setState({
              activities: response.data, // Cập nhật lại LocationListData từ API
              newActivityName: "", // Reset lại tên địa điểm
              showModalActivity: false, // Đóng modal sau khi thêm thành công
            });
          })
          .catch((error) => {
            console.error("Error fetching updated locations: ", error);
          });
      })
      .catch((error) => {
        console.error("Error adding activity: ", error);
        this.setState({
          notificationText: "Failed to add activity. Please try again.!",
          notificationType: "error",
          showNotification: true
        });
      });
  };

  handleShowModalActivity = () => {
    this.setState({ showModalActivity: true });
  };

  handleCloseModalActivity = () => {
    this.setState({ showModalActivity: false, newActivityName: "" });
  };

  handleInputChangeActivity = (event) => {
    this.setState({ newActivityName: event.target.value });
  };


  renderTable = () => {
    const { scheduleData, daysOfWeek, timeslots, classData, selectId, scheduleDetails, activity } = this.state;
    const { newLocationName, showModalLocation, newActivityName, showModalActivity } = this.state;
    const { showNotification, notificationText, notificationType } = this.state;

    console.log(this.state.activities);
    

    const userData = (getSession("user")).user;
    const roleId = userData.roleId;

    const queryParams = new URLSearchParams(this.props.location.search);
    const classIdBack = queryParams.get('classId');

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
              HeaderText="Schedule Detail Create"
              Breadcrumb={[{ name: "Schedule", navigate: "listschedule" },
              { name: "Schedule Detail", navigate: `schedule?classId=${classIdBack}` },
              { name: "Schedule Detail Create", navigate: "" }
              ]}
            />
            <div className="row clearfix">
              <div className="col-lg-12 col-md-12">
                <div className="card planned_task">
                  <div className="header d-flex flex-column flex-md-row justify-content-between">
                    <div className="d-flex flex-column flex-md-row mb-4 w-100">
                      <div className="form-group col-md-4 mb-3 mb-md-0">
                        <label htmlFor="startWeek">Start Week:</label>
                        <input
                          type="week"
                          id="startWeek"
                          value={this.state.startWeek}
                          onChange={(e) => this.setState({ startWeek: e.target.value })}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group col-md-4 mb-3 mb-md-0">
                        <label htmlFor="endWeek">End Week:</label>
                        <input
                          type="week"
                          id="endWeek"
                          value={this.state.endWeek}
                          onChange={(e) => this.setState({ endWeek: e.target.value })}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group col-md-4 mb-3 mb-md-0">
                        <label htmlFor="selectClass">Choose Class:</label>
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

                    {roleId === 3 ? (
                      <div className="d-flex flex-wrap justify-content-end">
                        <a
                          onClick={() => this.handleShowModalActivity()}
                          className="btn btn-success text-white mb-2"
                        >
                          <i className="icon-plus mr-2"></i>Add Activity
                        </a>
                        <a
                          onClick={() => this.handleShowModalLocation()}
                          className="btn btn-primary text-white mb-2"
                        >
                          <i className="icon-plus mr-2"></i>Add Location
                        </a>

                      </div>
                    ) : null}
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
                              <th key={index} className="text-center">
                                {day}
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
                                const slotKey = `${day}/${timeslot}`; // Tạo key duy nhất cho mỗi slot
                                let result = scheduleDetails?.find(i => i.day === day && i.timeSlotName === timeslot)
                                return (
                                  <td key={dayIndex}>
                                    <div className="row m-1">
                                      <div className="d-inline-flex align-items-center">
                                        <span>Activity: </span>
                                        <select
                                          id={`activity-${slotKey}`}
                                          value={this.state.slotDetails[slotKey]?.activity || ''}
                                          onChange={(e) => this.handleSlotChange(slotKey, 'activity', e.target.value)}
                                          className="form-control"
                                          required
                                        >
                                          <option value="">Select an activity</option>
                                          {this.state.activities.map((activity, index) => (
                                            <option key={index} value={activity?.activityName}>
                                              {activity?.activityName}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                      <div className="d-inline-flex align-items-center">
                                        <span>Location: </span>
                                        <select
                                          id={`location-${slotKey}`}
                                          value={this.state.slotDetails[slotKey]?.location || ''}
                                          onChange={(e) => this.handleSlotChange(slotKey, 'location', e.target.value)}
                                          className="form-control"
                                          required
                                        >
                                          <option value="">Select an activity</option>
                                          {this.state.locations.map((location, index) => (
                                            <option key={index} value={location?.locationName}>
                                              {location?.locationName}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>

                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Modal để tạo địa điểm */}
                      <Modal show={showModalLocation} onHide={this.handleCloseModalLocation}>
                        <Modal.Header closeButton>
                          <Modal.Title>Create New Location</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Form>
                            <Form.Group controlId="formLocationName">
                              <Form.Label>Location Name</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter location name"
                                value={newLocationName}
                                onChange={this.handleInputChangeLocation}
                              />
                            </Form.Group>
                          </Form>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={this.handleCloseModalLocation}>
                            Close
                          </Button>
                          <Button variant="primary" onClick={this.handleCreateLocation}>
                            Save
                          </Button>
                        </Modal.Footer>
                      </Modal>
                      {/* Modal để tạo hoạt động */}
                      <Modal show={showModalActivity} onHide={this.handleCloseModalActivity}>
                        <Modal.Header closeButton>
                          <Modal.Title>Create New Activity</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Form>
                            <Form.Group controlId="formActivityName">
                              <Form.Label>Activity Name</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter Activity name"
                                value={newActivityName}
                                onChange={this.handleInputChangeActivity}
                              />
                            </Form.Group>
                          </Form>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={this.handleCloseModalActivity}>
                            Close
                          </Button>
                          <Button variant="primary" onClick={this.handleCreateActivity}>
                            Save
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                    <div>
                      <button className="btn btn-lg btn-success" onClick={this.handleSaveSchedule}>Save Schedule</button>
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

export default (ScheduleDetailCreate);
