import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { withRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

class ListPickUpPerson extends React.Component {
    state = {
        PickupPersonData: null, // Lưu thông tin người đón
        searchTerm: "",
        hoveredImageSrc: null,
        hoveredImagePosition: { top: 0, left: 0 },
    };

    componentDidMount() {
        window.scrollTo(0, 0);

        // Lấy parentID từ user trong session

        const user = JSON.parse(sessionStorage.getItem("user"));
        const parentId = user?.user?.userId;
        const apiUrl = process.env.REACT_APP_API_URL;

        if (parentId) {
            // Gọi API để lấy thông tin người đón
            fetch(`${process.env.REACT_APP_API_URL}/api/PickupPerson/GetPickupPersonInfoByParentId?parentId=${parentId}`)
                .then((response) => response.json())
                .then((data) => {
                    this.setState({ PickupPersonData: data });
                })
                .catch((error) => {
                    console.error("Error fetching pickup person data: ", error);
                });
        } else {
            console.error("Parent ID not found in session.");
        }
    }

    handleSearchChange = (event) => {
        this.setState({ searchTerm: event.target.value });
    };

    handleMouseEnter = (src, event) => {
        const rect = event.target.getBoundingClientRect();
        this.setState({
            hoveredImageSrc: src,
            hoveredImagePosition: {
                top: rect.top,
                left: rect.right + 10,
            },
        });
    };

    handleMouseLeave = () => {
        this.setState({ hoveredImageSrc: null });
    };

    render() {
        const { PickupPersonData, searchTerm, hoveredImageSrc, hoveredImagePosition } = this.state;

        if (!PickupPersonData) {
            return <div>Loading...</div>;
        }

        // Lọc danh sách học sinh theo từ khóa tìm kiếm
        const filteredStudents = PickupPersonData.students.filter((student) =>
            student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div
                style={{ flex: 1 }}
                onClick={() => {
                    document.body.classList.remove("offcanvas-active");
                }}
            >
                <div className="container-fluid">
                    <PageHeader
                        HeaderText="Pickup Person Management"
                        Breadcrumb={[
                            { name: "Pickup Person Management", navigate: "" },
                            { name: "View Pickup Person", navigate: "" },
                        ]}
                    />

                    <div className="row clearfix">
                        <div className="col-lg-12 col-md-12">
                            <div className="card">
                                <div className="body project_report">
                                    <h4>Pickup Person Information</h4>
                                    <div className="mb-4 d-flex align-items-center">
                                        <img
                                            src={PickupPersonData.imageUrl}
                                            alt="Pickup Person"
                                            className="img-fluid rounded-circle"
                                            style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                        />
                                        <div className="ml-3">
                                            <h5>{PickupPersonData.name}</h5>
                                            <p>Phone: {PickupPersonData.phoneNumber}</p>
                                        </div>
                                    </div>

                                    <input
                                        type="text"
                                        placeholder="Search student by name..."
                                        value={searchTerm}
                                        onChange={this.handleSearchChange}
                                        className="form-control mb-3"
                                    />

                                    <div className="table-responsive">
                                        <table className="table m-b-0 table-hover">
                                            <thead className="thead-light">
                                                <tr>
                                                    <th>Avatar</th>
                                                    <th>Full Name</th>
                                                    <th>Code</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredStudents.map((student, index) => (
                                                    <tr key={"student" + index}>
                                                        <td>
                                                            <img
                                                                src={
                                                                    student.avatar ||
                                                                    "https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"
                                                                }
                                                                alt="Avatar"
                                                                className="img-fluid rounded-circle"
                                                                style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                                                onMouseEnter={(e) =>
                                                                    this.handleMouseEnter(
                                                                        student.avatar ||
                                                                        "https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg",
                                                                        e
                                                                    )
                                                                }
                                                                onMouseLeave={this.handleMouseLeave}
                                                            />
                                                        </td>
                                                        <td>{student.fullName}</td>
                                                        <td>{student.code}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hiển thị ảnh lớn khi hover */}
                {hoveredImageSrc && (
                    <div
                        className="hovered-image-container"
                        style={{
                            position: "absolute",
                            top: hoveredImagePosition.top,
                            left: hoveredImagePosition.left,
                            zIndex: 1000,
                            backgroundColor: "#fff",
                            borderRadius: "10px",
                            padding: "10px",
                            boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                        }}
                    >
                        <img
                            src={hoveredImageSrc}
                            alt="Hovered Avatar"
                            className="img-fluid"
                            style={{
                                maxWidth: "150px",
                                borderRadius: "10px",
                            }}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export default withRouter(ListPickUpPerson);
