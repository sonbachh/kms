import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
// import { withRouter } from 'react-router-dom';
import axios from "axios";
import { getSession } from "../../components/Auth/Auth";
import { Modal, Button, Form } from "react-bootstrap";
import Notification from "../../components/Notification";
import Resizer from 'react-image-file-resizer'; // Import thư viện nén ảnh
import { Bars } from 'react-loader-spinner';


class AlbumDetail extends React.Component {
  state = {
    albumId: 1,
    title: 'Thực đơn hàng ngày',
    description: 'Thực đơn ngày 20/10/2024',
    timepost: '',
    classId: '1',
    className: 'Violet',
    createBy: 'Teacher 1',
    modifyBy: 'Staff',
    status: '0',

    imageData: [],
    teacherListData: [],

    showModal: false, // Để quản lý hiển thị của modal
    caption: "", // Title mới cho album
    newImages: [], // Mảng để chứa hình ảnh được chọn từ máy

    showImageModal: false, // Modal visibility for the clicked image
    selectedImage: null,   // Store the clicked image
    isEditMode: false,  // Quản lý chế độ sửa album
    isUploading: false,  // Biến để theo dõi trạng thái upload


    showNotification: false, // State to control notification visibility
    notificationText: "", // Text for the notification
    notificationType: "success" // Type of notification (success or error)
  };

  fetchAlbumImages = async () => {
    const { albumId } = this.state;

    try {
      const imageResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/Images/listAllImageByAlbumId/${albumId}`);
      this.setState({ imageData: imageResponse.data }); // Cập nhật lại danh sách ảnh
    } catch (error) {
      console.error("Lỗi khi tải danh sách ảnh:", error);
    }
  };

  async componentDidMount() {
    window.scrollTo(0, 0);
    const { albumId } = this.props.match.params;
    this.setState({ albumId: parseInt(albumId) });

    try {
      // Fetch request details
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/Album/GetAlbumById/${albumId}`);
      const data = response.data;

      // Update state with request details
      this.setState({
        title: data.albumName,
        description: data.description,
        createBy: data.createBy,
        modifiBy: data.modifiBy,
        timePost: data.timePost ? new Date(data.timePost).toISOString().slice(0, 10) : "",
        status: data.status,
        studentId: data.isActive,
        ReasonReject: data.reason || "",
      });

      await this.fetchAlbumImages(); // Tải ảnh lúc load trang

      axios.get(`${process.env.REACT_APP_API_URL}/api/Teacher/GetAllTeachers`)
        .then((response) => {
          this.setState({ teacherListData: response.data });
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        });

    } catch (error) {
      console.error("Error fetching data: ", error);
      this.setState({
        notificationText: "Failed to fetch data.!",
        notificationType: "error",
        showNotification: true
      });
    }
  }



  // Đóng modal
  handleClose = () => {
    this.setState({ showModal: false, caption: "", newImages: [] });
  };

  // Mở modal
  handleShow = () => {
    this.setState({ showModal: true });
  };

  // Xử lý khi người dùng chọn file ảnh
  handleImageChange = (event) => {
    this.setState({ newImages: [...event.target.files] });
  };

  handleSaveAlbum = async () => {
    const { albumId, newImages, caption } = this.state;
    this.setState({ isUploading: true });  // Bật loading khi bắt đầu upload

    // Mảng chứa các ảnh đã được nén
    const resizedImages = [];

    try {
      // Nén từng ảnh trước khi upload
      for (let i = 0; i < newImages.length; i++) {
        const image = newImages[i];

        // Sử dụng thư viện Resizer để nén ảnh
        const resizedImage = await new Promise((resolve, reject) => {
          Resizer.imageFileResizer(
            image,  // File ảnh gốc
            800,    // Chiều rộng ảnh sau khi nén
            600,    // Chiều cao ảnh sau khi nén
            'JPEG', // Định dạng ảnh (có thể là 'JPEG', 'PNG', 'WEBP'...)
            80,     // Chất lượng ảnh (0-100)
            0,      // Rotate, nếu cần xoay ảnh (0: không xoay)
            (uri) => resolve(uri),  // Callback trả về ảnh đã nén
            'base64', // Loại dữ liệu trả về (base64)
          );
        });

        // Chuyển base64 về dạng Blob hoặc File nếu cần (ví dụ: base64 -> Blob)
        const resizedBlob = await fetch(resizedImage).then(res => res.blob());
        const resizedFile = new File([resizedBlob], image.name, { type: image.type });

        resizedImages.push(resizedFile);  // Thêm ảnh đã nén vào mảng
      }

      // Chuẩn bị FormData để upload
      const formData = new FormData();
      formData.append("albumId", albumId); // Thêm albumId vào FormData
      formData.append("caption", caption); // Thêm caption vào FormData

      // Thêm tất cả ảnh đã nén vào FormData
      resizedImages.forEach((image) => {
        formData.append("images", image); // API nhận `images` là một field với nhiều file
      });

      // Gửi request upload ảnh
      await axios.post(`${process.env.REACT_APP_API_URL}/api/Images/CreateImages`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      this.handleClose(); // Đóng modal sau khi tải lên thành công
      this.setState({
        notificationText: "Images Upload Successfully!",
        notificationType: "success",
        showNotification: true,
      });

      setTimeout(async () => {
        await this.fetchAlbumImages(); // Fetch lại danh sách ảnh sau khi upload
      }, 2000);

    } catch (error) {
      console.error("Lỗi khi tải lên ảnh:", error);
      this.setState({
        notificationText: "Images Upload Error!",
        notificationType: "error",
        showNotification: true,
      });
    } finally {
      this.setState({ isUploading: false });  // Tắt loader sau khi tải lên xong
    }

  };



  formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day} - ${month} - ${year}`;
  };

  formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes} ${day}-${month}-${year}`;
  };

  groupImagesByPostedAt(images) {
    return images.reduce((groups, image) => {
      // Lấy giờ và phút từ postedAt để làm id
      const date = new Date(image.postedAt);
      const timeKey = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (!groups[timeKey]) {
        groups[timeKey] = [];
      }
      groups[timeKey].push(image);
      return groups;
    }, {});
  }

  formatTime(date) {
    return new Date(date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
  }

  scrollToTime(id) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.error(`Element with id ${id} not found`);
    }
  }

  handleImageClick = (imageUrl) => {
    this.setState({ selectedImage: imageUrl, showImageModal: true });
  };

  handleImageModalClose = () => {
    this.setState({ showImageModal: false, selectedImage: null });
  };


  toggleEditMode = () => {
    this.setState((prevState) => ({
      isEditMode: !prevState.isEditMode,
    }));
  };

  handleDeleteImage = async (imageId) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/Images/DeleteImage/${imageId}`);

      if (response.status === 200) {

        // Hiển thị thông báo ngay lập tức
        this.setState({
          notificationText: "Image deleted successfully!",
          notificationType: "success",
          showNotification: true,
        });

        // Đặt một khoảng delay 2 giờ (7200 giây) trước khi fetch lại dữ liệu
        setTimeout(async () => {
          await this.fetchAlbumImages();
        }, 2000);
      } else {
        throw new Error("Failed to delete image from server.");
      }
    } catch (error) {
      console.error("Lỗi khi xóa ảnh:", error);

      this.setState({
        notificationText: "Failed to delete image!",
        notificationType: "error",
        showNotification: true,
      });
    } finally {
      // Tắt loader sau khi tải lên xong
      this.setState({ isUploading: false });
    }
  };


  render() {
    const { title, description, imageData, timePost, teacherListData, createBy, showModal, caption, showImageModal, selectedImage } = this.state;
    const { showNotification, notificationText, notificationType } = this.state;

    const userData = getSession('user')?.user;
    const roleId = userData?.roleId;
    const groupedImages = this.groupImagesByPostedAt(imageData);
    const timeKeys = Object.keys(groupedImages);

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
        {/* Hiển thị loader khi đang tải ảnh */}
        {this.state.isUploading && (
          <div className="loading-overlay">
            <Bars color="#00BFFF" height={100} width={100} />
          </div>
        )}

        <div className="container-fluid">
          <PageHeader
            HeaderText="Album Management"
            Breadcrumb={[
              { name: "Album List", navigate: "album" },
              { name: "Album Detail", navigate: "" },
            ]}
          />
          <div className="row clearfix">
            <div className="col-md-12">
              <div className="card">
                <div className="body">
                  <form className="update-teacher-form">
                    <div className="row justify-content-between">
                      <div className="form-group col-md-6">
                        <div>
                          <strong className="font-weight-bold" style={{ fontSize: '20px' }}>{title}</strong>
                          <p>{description}</p>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <p>Số ảnh: </p> <span className="font-weight-bold">{imageData && imageData.length || 0}</span>
                          </div>
                          <div className="col-md-6">
                            <p>Ngày đăng: </p> <span className="font-weight-bold">{this.formatDate(timePost)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="form-group col-md-6 d-flex justify-content-end align-items-start">
                        {roleId === 5 && (
                          <>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                this.toggleEditMode(); // Toggle chế độ sửa
                              }}
                              className="btn btn-warning text-white mr-4 "
                            >
                              Sửa Album
                            </button>
                            <button onClick={(e) => { e.preventDefault(); this.handleShow(); }} className="btn btn-success text-white">Đăng Album Ảnh</button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* List of time links */}
                    <ul className="list-inline">
                      <span className="pr-3">Timeline:</span>
                      {timeKeys.map((time) => (
                        <li key={time} className="list-inline-item">
                          <button
                            className="btn btn-outline-primary"
                            onClick={(e) => {
                              e.preventDefault(); // Ngăn hành động mặc định
                              this.scrollToTime(time);
                            }}
                          >
                            {time}
                          </button>
                        </li>
                      ))}
                    </ul>

                    <div className="container">
                      {(!imageData || imageData.length === 0) ? (
                        <div>
                          <strong className="font-weight-bold pl-3" style={{ fontSize: '20px' }}>Album hiện đang chưa có ảnh</strong>
                        </div>
                      ) : (
                        Object.entries(groupedImages).map(([postedAt, imagesAtPostedTime]) => (
                          <div key={postedAt} id={postedAt.split(' ')[0]} className="timeline-item" date-is={postedAt + ' - ' + imagesAtPostedTime[0].caption}>
                            <div className=" d-flex align-items-center mb-3"></div>
                            <div className="row">
                              {imagesAtPostedTime.map((image) => (
                                <div key={image.id} className="col-md-3 mb-4">
                                  <div className="card shadow-sm position-relative">
                                    <img
                                      src={image.imgUrl}
                                      alt={`Image ${image.caption}`}
                                      className="card-img-top"
                                      style={{ cursor: 'pointer' }}
                                      onClick={() => this.handleImageClick(image.imgUrl)} // On click, open the modal
                                    />

                                    {/* Nếu đang ở chế độ sửa album, hiển thị nút "X" để xóa ảnh */}
                                    {this.state.isEditMode && (
                                      <button
                                        className="btn btn-danger btn-sm position-absolute"
                                        style={{ top: '10px', right: '10px' }}
                                        onClick={(e) => {
                                          e.stopPropagation(); // Ngừng sự kiện click lan truyền
                                          this.handleDeleteImage(image.imageId); // Xóa ảnh
                                        }}
                                      >
                                        X
                                      </button>
                                    )}

                                    <div className="card-body text-center">
                                      <p className="card-text">
                                        Đã thêm bởi: {(() => {
                                          const teacher = teacherListData?.find(item => item.teacherId === createBy);
                                          return teacher ? `${teacher.firstname} ${teacher.lastName}` : '';
                                        })()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <br />
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Modal for showing enlarged image */}
          {showImageModal && (
            <Modal show={showImageModal} onHide={this.handleImageModalClose} size="lg">
              <Modal.Header closeButton>
                <Modal.Title>Enlarged Image</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <img src={selectedImage} alt="Enlarged" style={{ width: '100%', height: 'auto' }} />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleImageModalClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          )}

          {/* Modal for adding new album */}
          <Modal show={showModal} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Thêm Album Image Mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formTitle">
                  <Form.Label>Mô tả</Form.Label>
                  <Form.Control
                    type="text"
                    value={caption}
                    onChange={(e) => this.setState({ caption: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formImages">
                  <Form.Label>Hình ảnh</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    onChange={this.handleImageChange}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Hủy
              </Button>
              <Button variant="primary" onClick={this.handleSaveAlbum}>
                Lưu Album Image
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }

}

const mapStateToProps = ({ ioTReducer }) => ({
  isSecuritySystem: ioTReducer.isSecuritySystem,
});

export default connect(mapStateToProps)((AlbumDetail));
