import React from "react";
import { withRouter } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./ViewMenu.css";
import PageHeader from "../../components/PageHeader";
import axios from "axios";
import Notification from "../../components/Notification";
class ViewMenu extends React.Component {
  state = {
    selectedWeek: {
      startOfWeek: new Date(),
      endOfWeek: new Date(),
    },
    menuData: {
      "0-3": [],
      "3-6": [],
    },
    daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    showCalendar: false,
    selectedFile: null,
    showNotification: false, // State to control notification visibility
    notificationText: "", // Text for the notification
    notificationType: "success" // Type of notification (success or error)
  };

  componentDidMount() {
    const { startOfWeek, endOfWeek } = this.getWeekRange(new Date());
    this.setState({ selectedWeek: { startOfWeek, endOfWeek } }, () => {
      this.fetchMenuData(startOfWeek, endOfWeek); // Fetch menu data
    });
  }

  getWeekRange = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = day === 0 ? 6 : day - 1;
    startOfWeek.setDate(startOfWeek.getDate() - diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return { startOfWeek, endOfWeek };
  };

  handleWeekSelect = (date) => {
    const { startOfWeek, endOfWeek } = this.getWeekRange(date);
    this.setState({ selectedWeek: { startOfWeek, endOfWeek }, showCalendar: false }, () => {
      this.fetchMenuData(startOfWeek, endOfWeek);
    });
  };

  formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  fetchMenuData = async (startOfWeek, endOfWeek) => {
    const startDate = this.formatDate(startOfWeek);
    const endDate = this.formatDate(endOfWeek);

    try {
      const response1 = await fetch(`${process.env.REACT_APP_API_URL}/api/Menu/GetMenuByDate?startDate=${startDate}&endDate=${endDate}&gradeId=1`);
      const response2 = await fetch(`${process.env.REACT_APP_API_URL}/api/Menu/GetMenuByDate?startDate=${startDate}&endDate=${endDate}&gradeId=2`);

      const menuData1 = await response1.json();
      const menuData2 = await response2.json();

      this.setState({
        menuData: {
          "0-3": menuData1[0]?.menuDetails || [],
          "3-6": menuData2[0]?.menuDetails || [],
        },
      });
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  };

  handleUpdate = (ageGroup) => {
    const { selectedWeek } = this.state;
    const startDate = this.formatDate(selectedWeek.startOfWeek);
    const endDate = this.formatDate(selectedWeek.endOfWeek);
    const gradeId = ageGroup === "0-3" ? 1 : 2;

    // Navigate to `/updatemenu` with gradeId, startDate, and endDate parameters
    this.props.history.push({
      pathname: "/updatemenu",
      state: {
        gradeId: gradeId,
        startDate: startDate,
        endDate: endDate,
      },
    });
  };
  handleDownload = () => {
    const link = document.createElement('a'); // Tạo thẻ a
    link.href = '/assets/excel/MenuSample.xlsx';  // Đường dẫn đến file Excel
    link.download = 'menusample.xlsx';             // Tên file khi tải về
    link.click();                             // Kích hoạt sự kiện click để tải file
  };

  handleFileChange = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  handleUpload = async () => {
    const { selectedFile } = this.state;
    if (!selectedFile) {
      // alert("Please select a file first!");
      this.setState({
        notificationText: "Please select a file first!",
        notificationType: "error",
        showNotification: true
      });  
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/Menu/ImportMenuExcel`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // alert("File uploaded successfully!");
      this.setState({
        notificationText: "File uploaded successfully!",
        notificationType: "success",
        showNotification: true
      }); 
      this.fetchMenuData(new Date());
    } catch (error) {
      console.error("Error uploading file:", error);
      // alert("Error uploading file.");
      this.setState({
        notificationText: "Error uploading file.",
        notificationType: "success",
        showNotification: true
      }); 
    }
  };

  toggleCalendar = () => {
    this.setState((prevState) => ({ showCalendar: !prevState.showCalendar }));
  };

  renderTable = (ageGroup) => {
    const { menuData, daysOfWeek } = this.state;

    return (
      <div className="table-wrapper">
        <table className="custom-table table table-bordered">
          <thead className="thead-light">
            <tr>
              <th></th>
              {daysOfWeek.map((day, index) => (
                <th key={index}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="sticky-col"><strong>Breakfast</strong></td>
              {daysOfWeek.map((day, index) => {
                const menuItems = menuData[ageGroup].filter(menu => menu.mealCode === "BS" && this.mapDayToEnglish(menu.dayOfWeek) === day);
                return (
                  <td key={index}>
                    {menuItems.length > 0 ? (
                      <ul>
                        {menuItems.map((menuItem, itemIndex) => (
                          <li key={`${menuItem.foodName}-${day}-${itemIndex}`}>{menuItem.foodName}</li>
                        ))}
                      </ul>
                    ) : (
                      "No data available"
                    )}
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="sticky-col"><strong>Lunch</strong></td>
              {daysOfWeek.map((day, index) => {
                const menuItems = menuData[ageGroup].filter(menu => menu.mealCode === "BT" && this.mapDayToEnglish(menu.dayOfWeek) === day);
                return (
                  <td key={index}>
                    {menuItems.length > 0 ? (
                      <ul>
                        {menuItems.map((menuItem, itemIndex) => (
                          <li key={`${menuItem.foodName}-${day}-${itemIndex}`}>{menuItem.foodName}</li>
                        ))}
                      </ul>
                    ) : (
                      "No data available"
                    )}
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="sticky-col"><strong>Snack</strong></td>
              {daysOfWeek.map((day, index) => {
                const menuItems = menuData[ageGroup].filter(menu => menu.mealCode === "BC" && this.mapDayToEnglish(menu.dayOfWeek) === day);
                return (
                  <td key={index}>
                    {menuItems.length > 0 ? (
                      <ul>
                        {menuItems.map((menuItem, itemIndex) => (
                          <li key={`${menuItem.foodName}-${day}-${itemIndex}`}>{menuItem.foodName}</li>
                        ))}
                      </ul>
                    ) : (
                      "No data available"
                    )}
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="sticky-col" colSpan={daysOfWeek.length + 1}>
                <button type="button" onClick={() => this.handleUpdate(ageGroup)} className="btn btn-primary mr-1">
                  <span>Update {ageGroup === "0-3" ? "0-3" : "3-6"}</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  mapDayToEnglish = (day) => {
    const dayMap = {
      Monday: "Monday",
      Tuesday: "Tuesday",
      Wednesday: "Wednesday",
      Thursday: "Thursday",
      Friday: "Friday",
      Saturday: "Saturday",
      Sunday: "Sunday",
    };
    return dayMap[day] || day;
  };

  render() {
    const { selectedWeek, showCalendar, showNotification, // State to control notification visibility
      notificationText, // Text for the notification
      notificationType } = this.state;

    return (
      <div className="container-fluid">
        <PageHeader
          HeaderText="Food Management"
          Breadcrumb={[
            { name: "Food Management", navigate: "" },
            { name: "View Menu", navigate: "" },
          ]}
        />
        {showNotification && (
              <Notification
                type={notificationType}
                position="top-right"
                dialogText={notificationText}
                show={showNotification}
                onClose={() => this.setState({ showNotification: false })}
              />
            )}
        <div className="row">
          <div className="col-lg-12 col-md-12">
            <h2>Menu</h2>

            <div className="row align-items-center justify-content-between mb-3">
              <div className="week-selector col-lg-3" onClick={this.toggleCalendar}>
                Selected week: {selectedWeek.startOfWeek.toLocaleDateString("en-US")} - {selectedWeek.endOfWeek.toLocaleDateString("en-US")}
              </div>
              <div>

              </div>

              <div className="upload-section d-flex align-items-center">
                <a
                  onClick={() => {
                    this.handleDownload()
                  }}
                  className="btn btn-success text-white mr-4"
                >
                  <i className="icon-arrow-down mr-2"></i>Dowload Template
                </a>
                <input type="file" onChange={this.handleFileChange} className="mr-2" />
                <button onClick={this.handleUpload}> <i className="wi wi-cloud-up">Upload</i></button>
              </div>
            </div>

            {showCalendar && (
              <div className="calendar-dropdown">
                <Calendar
                  onChange={this.handleWeekSelect}
                  value={selectedWeek.startOfWeek}
                  locale="en-US"
                  showWeekNumbers={true}
                />
              </div>
            )}

            <h4 className="menu-title">All: 0-3</h4>
            <div className="table-container">{this.renderTable("0-3")}</div>

            <h4 className="menu-title">All: 3-6</h4>
            <div className="table-container">{this.renderTable("3-6")}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ViewMenu);
