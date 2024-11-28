import React from "react";
// import { withRouter } from "react-router-dom";
import "./Schedule.css"; // Tạo file CSS riêng cho các style
import PageHeader from "../../components/PageHeader";
import axios from "axios";
import Modal from "react-bootstrap/Modal"; // Import Bootstrap Modal
import Button from "react-bootstrap/Button";
import Notification from "../../components/Notification";

class ScheduleCreate extends React.Component {

  state = {
    semesterData: [],
    classData: [],
    semesterId: null,
    classId: null,
    semesterName: '',

    showNotification: false, // State to control notification visibility
    notificationText: "", // Text for the notification
    notificationType: "success" // Type of notification (success or error)
  };


  componentDidMount() {
    window.scrollTo(0, 0);

    // Gọi hàm fetchData
    this.fetchData();
  }

  async fetchData() {
    try {
      const [classResponse, semesterResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/Class/GetAllClass`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/Semester/GetAllSemester`)
      ]);

      this.setState({
        classData: classResponse.data,
        semesterData: semesterResponse.data,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }


  handleCreateSchedule = async (event) => {
    event.preventDefault(); // Prevent form from reloading the page
    // Prepare the schedule data to send
    const { startdate, enddate, classId, semesterId } = this.state;
    const scheduleData = {
      semesterId: parseInt(semesterId),
      status: 0,
      classId: parseInt(classId),
      teacherName: '',
    };

    try {
      // Make POST request to create the new schedule
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/Schedule/AddSchedule`, scheduleData);
      console.log('Schedule created successfully:', response.data);

      this.setState({
        notificationText: "Schedule Create successfully!",
        notificationType: "success",
        showNotification: true
      });

      // Set timeout để chuyển hướng sau 2 giây
      setTimeout(() => {
        this.props.history.push('/listschedule');
      }, 2000);

    } catch (error) {
      console.log(error);
      let errorMessage = "Failed to import schedule";
      if (error.response && error.response.data && error.response.data.details) {
        errorMessage = error.response.data.details; // Lấy thông báo từ trường details
      }

      this.setState({
        notificationText: errorMessage,
        notificationType: "error",
        showNotification: true
      });
    }
  };

  handleChooseClass = (event) => {
    const selectedClassId = event.target.value;
    this.setState({ classId: selectedClassId }, () => {
      const classchoose = this.state.classData.find((i) => i.classId === parseInt(this.state.classId));

      if (classchoose) {
        const relatedSemester = this.state.semesterData.filter((i) => i.semesterId === classchoose.semesterId);
        console.log(relatedSemester);

        this.setState({
          semesterId: relatedSemester[0]?.semesterId,
          semesterName: relatedSemester[0]?.name,
        })
      }

    });
  };



  render() {
    const { showNotification, notificationText, notificationType } = this.state;

    return (
      <div style={{ flex: 1 }} onClick={() => document.body.classList.remove("offcanvas-active")}>
        {showNotification && (
          <Notification
            type={notificationType}
            position="top-right"
            dialogText={notificationText}
            show={showNotification}
            onClose={() => this.setState({ showNotification: false })}
          />
        )}
        <div className="container-fluid">
          <PageHeader
            HeaderText="New Schedule"
            Breadcrumb={[
              { name: "Schedule List", navigate: "listschedule" },
              { name: "Schedule Create", navigate: "" },
            ]}
          />
          <div className="row clearfix">
            <div className="col-md-12">
              <div className="card">
                <div className="header text-center">
                  <h4>Create New Schedule</h4>
                </div>
                <div className="body">
                  <form onSubmit={this.handleCreateSchedule}>
                    <div className="row">
                      <div className="form-group col-md-12 d-flex flex-column">
                        <label>Class</label>
                        <select
                          className="form-control"
                          value={this.state.classId}
                          name="classname"
                          required
                          onChange={this.handleChooseClass}
                        >
                          <option value="">Choose Class</option>
                          {this.state.classData?.map((option) => (
                            <option key={option.classId} value={option.classId}>
                              {option.className}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col-md-12">
                        <label>Semeter</label>
                        <input
                          className="form-control"
                          value={this.state.semesterName}
                          name="semesterName"
                          readOnly
                          type="text"
                        />
                      </div>
                    </div>
                    <br />
                    <div className="text-center">
                      <button type="submit" className="btn btn-success">
                        Create Schedule
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default (ScheduleCreate);
