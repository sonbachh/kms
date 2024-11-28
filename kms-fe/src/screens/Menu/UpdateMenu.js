import React from "react";
import { withRouter } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import PageHeader from "../../components/PageHeader";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap"; // Import Modal and other components from React Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

class UpdateMenu extends React.Component {
    state = {
        selectedWeek: {
            startOfWeek: new Date(),
            endOfWeek: new Date(),
        },
        menuData: {
            "0-3": [],
        },
        daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        showModal: false,
        structuredMenuData: null,
        selectedMenuItem: null,
    };

    componentDidMount() {
        const { gradeId, startDate, endDate } = this.props.location.state;
        const { startOfWeek, endOfWeek } = this.getWeekRange(new Date());

        this.setState({ selectedWeek: { startOfWeek, endOfWeek } }, () => {
            this.fetchMenuData(startDate, endDate, gradeId);
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

    fetchMenuData = async (startOfWeek, endOfWeek, gradeId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/Menu/GetMenuByDate`, {
                params: { startDate: startOfWeek, endDate: endOfWeek, gradeId },
            });

            const menuData = response.data[0];
            if (menuData) {
                const structuredMenuData = this.structureMenuData(menuData);
                this.setState({
                    structuredMenuData,
                    menuData: { "0-3": structuredMenuData.menuDetails },
                });
            }
        } catch (error) {
            console.error("Error fetching menu data:", error);
        }
    };

    structureMenuData = (menuData) => {
        const { menuID, startDate, endDate, gradeID, status, menuDetails } = menuData;
        return {
            menuID,
            startDate,
            endDate,
            gradeID,
            status,
            menuDetails: menuDetails.map(detail => ({
                menuDetailId: detail.menuDetailId,
                mealCode: detail.mealCode,
                dayOfWeek: detail.dayOfWeek,
                foodName: detail.foodName,
            })),
        };
    };

    toggleModal = (menuItem) => {
        this.setState(prevState => ({
            showModal: !prevState.showModal,
            selectedMenuItem: menuItem,
        }));
    };

    formatDate = (date) => {
        return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
    };

    handleSave = async () => {
        const { selectedMenuItem, selectedWeek, structuredMenuData } = this.state;
        const requestBody = this.createRequestBody(selectedMenuItem, selectedWeek, structuredMenuData);

        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/Menu/UpdateMenu`, requestBody);
            this.setState({ showModal: false });
            this.fetchMenuData(selectedWeek.startOfWeek, selectedWeek.endOfWeek, this.props.location.state.gradeId);
        } catch (error) {
            console.error("Error updating menu item:", error);
        }
    };

    createRequestBody = (selectedMenuItem, selectedWeek, structuredMenuData) => {
        return {
            menuID: structuredMenuData.menuID,
            startDate: this.formatDate(selectedWeek.startOfWeek),
            endDate: this.formatDate(selectedWeek.endOfWeek),
            gradeID: this.props.location.state.gradeId,
            status: structuredMenuData.status || 0,
            menuDetails: [
                {
                    menuDetailId: selectedMenuItem.menuDetailId,
                    mealCode: selectedMenuItem.mealCode,
                    dayOfWeek: selectedMenuItem.dayOfWeek,
                    foodName: selectedMenuItem.foodName,
                },
            ],
        };
    };

    renderTable = (ageGroup) => {
        const { menuData, daysOfWeek } = this.state;

        return (
            <div className="table-wrapper">
                <table className="custom-table table table-striped table-bordered">
                    <thead className="thead-light">
                        <tr>
                            <th></th>
                            {daysOfWeek.map((day, index) => (
                                <th key={index} className="text-center">{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {["BS", "BT", "BC"].map(mealCode => (
                            <tr key={mealCode}>
                                <td className="sticky-col text-bold"><strong>{this.getMealLabel(mealCode)}</strong></td>
                                {this.renderMeals(ageGroup, mealCode)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    renderMeals = (ageGroup, mealCode) => {
        const { menuData, daysOfWeek } = this.state;

        return daysOfWeek.map((day, index) => {
            const menuItems = menuData[ageGroup].filter(menu => menu.mealCode === mealCode && this.mapDayToEnglish(menu.dayOfWeek) === day);
            return (
                <td key={index} className="text-center">
                    {menuItems.length > 0 ? (
                        <ul className="list-unstyled" style={{ paddingLeft: '0' }}>
                            {menuItems.map((menuItem, itemIndex) => (
                                <li key={`${menuItem.foodName}-${day}-${itemIndex}`} style={{ textAlign: 'left', margin: 0, listStyleType: 'disc', marginLeft: '20px' }}>
                                    <span
                                        className="menu-item text-info"
                                        onClick={() => this.toggleModal(menuItem)}
                                        style={{ cursor: 'pointer', }}
                                    >
                                        {menuItem.foodName}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <span className="text-muted">No data available</span>
                    )}
                </td>
            );
        });
    };

    getMealLabel = (mealCode) => {
        const mealLabels = {
            BS: "Breakfast",
            BT: "Lunch",
            BC: "Snack",
        };
        return mealLabels[mealCode];
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
        const { selectedWeek, showModal, selectedMenuItem } = this.state;

        return (
            <div className="container-fluid">
                <PageHeader
                    HeaderText="Food Management"
                    Breadcrumb={[{ name: "Food Management", navigate: "" }, { name: "View Menu", navigate: "" }]}
                />
                <div className="row">
                    <div className="col-lg-12 col-md-12">
                        <h2>Menu</h2>
                        <div className="week-selector">
                            Selected Week: {selectedWeek.startOfWeek.toLocaleDateString("en-US")} - {selectedWeek.endOfWeek.toLocaleDateString("en-US")}
                        </div>
                        <h4 className="menu-title">All: 0-3</h4>
                        <div className="table-container">{this.renderTable("0-3")}</div>

                        {/* Modal for editing menu item */}
                        <Modal show={showModal} onHide={this.toggleModal} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Edit Menu Item</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group controlId="foodName">
                                        <Form.Label>Food Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={selectedMenuItem ? selectedMenuItem.foodName : ''}
                                            onChange={(e) => this.setState({ selectedMenuItem: { ...selectedMenuItem, foodName: e.target.value } })}
                                        />
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.toggleModal}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={this.handleSave}>
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(UpdateMenu);
