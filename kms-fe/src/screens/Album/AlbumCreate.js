import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import axios from "axios";
import { getSession } from "../../components/Auth/Auth";
import Notification from "../../components/Notification";

class AlbumCreate extends React.Component {
    state = {
        title: "",
        description: "",
        classId: '1',
        className: 'Violet',
        timepost: '',
        createAt: new Date().toLocaleDateString(),
        createBy: 'Teacher 1',
        modifyBy: 'Staff',
        status: 0,

        classData: [],
        classId: null, // Initialize classId state

        showNotification: false, // State to control notification visibility
        notificationText: "", // Text for the notification
        notificationType: "success" // Type of notification (success or error)
    };

    componentDidMount() {
        window.scrollTo(0, 0);
        const userData = getSession('user')?.user;
        const roleId = userData?.roleId;

        const fetchData = async () => {
            try {
                const classResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/Class/GetClassesByTeacherId/${userData?.userId}`);
                const classData = classResponse.data;

                if (classData.length > 0) {
                    this.setState({
                        classData: classData,
                        classId: classData[0].classId // Set the first classId as default
                    });
                }
            } catch (error) {
                console.error('Error fetching class data:', error);
            }
        };

        fetchData();
    }

    handleSelectChange = (event) => {
        this.setState({ classId: event.target.value }); // Update classId with selected option value
    };


    handleCreateRequest = async (e) => {
        e.preventDefault(); // Prevent default form submission
        const { classId, description, createBy, title, reason } = this.state;

        let userId = getSession('user')?.user?.userId
        console.log(userId);

        const newRequest = {
            classId,
            createBy: userId,
            albumName: title,
            description,
        };
        console.log(newRequest);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/Album/CreateAlbum`, newRequest);

            console.log("Album created successfully:", response.data);
            this.setState({
                notificationText: "Album created successfully!",
                notificationType: "success",
                showNotification: true
            });
            
            // Set timeout để chuyển hướng sau 2 giây
            setTimeout(() => {
                this.props.history.push('/album');
            }, 2000);
        } catch (error) {
            console.error("Error creating Album:", error);
            this.setState({
                notificationText: "Error creating Album!",
                notificationType: "error",
                showNotification: true
            });
        }
    };

    render() {
        const { title, description, classData, classId } = this.state;
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
                        HeaderText="New Album"
                        Breadcrumb={[
                            { name: "Album List", navigate: "album" },
                            { name: "New Album", navigate: "" },
                        ]}
                    />
                    <div className="row clearfix">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="header text-center">
                                    <h4>Create New Album</h4>
                                </div>
                                <div className="body">
                                    <form onSubmit={this.handleCreateRequest}>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label>Class</label>
                                                <select
                                                    className="form-control"
                                                    value={classId}
                                                    name="classId"
                                                    disabled='true'
                                                    onChange={this.handleSelectChange}

                                                >
                                                    <option value="">Choose Class</option>
                                                    {classData.map((option) => (
                                                        <option key={option.classId} value={option.classId}>
                                                            {option.className}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <div className="form-group d-flex flex-column">
                                                    <label>Tilte</label>
                                                    <input
                                                        style={{ height: '38px' }}
                                                        className="form"
                                                        value={title}
                                                        name="title"
                                                        onChange={(e) => this.setState({ title: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="form-group col-md-12 d-flex flex-column">
                                                <label>Description</label>
                                                <textarea
                                                    className="form"
                                                    rows="6"
                                                    value={description}
                                                    name="description"
                                                    onChange={(e) => this.setState({ description: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <br />
                                        <div className="text-center">
                                            <button type="submit" className="btn btn-success">
                                                Create Album
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

const mapStateToProps = ({ ioTReducer }) => ({
    isSecuritySystem: ioTReducer.isSecuritySystem,
});

export default connect(mapStateToProps, {})(AlbumCreate);
