import React, { Children } from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { withRouter } from 'react-router-dom';
import axios from "axios";
import { getSession } from "../../components/Auth/Auth";
import { Modal, Button, Alert } from "react-bootstrap"; // Thêm modal từ react-bootstrap

class PaymentList extends React.Component {
  state = {
    UserListData: [],
    tuition: {},
    ServiceListData: [],
    showServices: false,
    parentId: null,
    Children: [],
    Class: [],
    Payment: [],
    ChildrenPayment: [],
    selectedChild: null, // Lưu trữ ID của child đã được chọn

    Dicounts: [],

    quantityOptions: [
      1, 3, 6
    ],

    selectedTuition: false, // Thêm trạng thái cho tuition checkbox
    selectedServices: [], // Lưu trữ các dịch vụ được chọn
    totalPayment: 0,
    selectedQuantity: 1,

    showModal: false, // State để kiểm soát hiển thị modal

  };


  componentDidMount() {
    window.scrollTo(0, 0);
    const userData = getSession('user')?.user;
    const parentId = userData?.userId; // Giá trị thực tế của parentId

    // Lấy năm và tháng hiện tại
    const currentDate = new Date();
    const year = currentDate.getFullYear(); // Lấy năm hiện tại
    const month = currentDate.getMonth() + 1; // Lấy tháng hiện tại (tháng trả về từ 0 -> 11, cộng 1 để có tháng đúng)

    // Cập nhật paymentName động dựa trên tháng và năm
    const paymentName = `Tuition fee ${month < 10 ? `0${month}` : month}/${year}`;

    // Cập nhật lại state với paymentName mới
    this.setState({
      tuition: {
        paymentName: paymentName,  // Cập nhật paymentName
      },
    });

    // Gọi API và cập nhật state bằng axios
    axios.get(`${process.env.REACT_APP_API_URL}/api/Tuition/parent/${parentId}`)
      .then((response) => {
        this.setState({ Payment: response.data });
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });

    axios.get(`${process.env.REACT_APP_API_URL}/api/Children/GetAllChildren`)
      .then((response) => {
        const data = response.data;
        const myChildren = data?.filter(i => i.parentId === parentId);
        this.setState({ Children: myChildren?.filter(i => i.status === 1) }, () => {
          // Gọi hàm getClassByStudentId cho tất cả các Children sau khi dữ liệu đã được cập nhật
          myChildren.forEach(child => {
            this.getClassByStudentId(child.studentId, parentId);  // Gọi hàm lấy lớp học
          });
        });
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });

    axios.get(`${process.env.REACT_APP_API_URL}/api/Payment/getAllDiscount`)
      .then((response) => {
        this.setState({ Dicounts: response.data });
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }

  getClassByStudentId = (studentId, parentId) => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/Class/GetClassesByStudentId/${studentId}`)
      .then((response) => {
        const data = response.data;
        const updatedChildren = this.state.Children.map(child => {
          if (child.studentId === studentId) {
            return { ...child, className: data[0]?.className }; // Cập nhật tên lớp cho child
          }
          return child;
        });

        this.setState({ Children: updatedChildren });
      })
      .catch((error) => {
        console.error("Error fetching class data: ", error);
      });
  }



  handleShowModal = () => {
    this.setState({ showModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  handlePaymentHistory = () => {
    this.props.history.push(`/payment-history`);
  };

  // Hàm xử lý ẩn/hiện các hàng dịch vụ
  toggleServices = () => {
    this.setState((prevState) => ({
      showServices: !prevState.showServices
    }));
  };

  handleCardClick = async (id, Payment) => {
    const myPayment = Payment.find(i => i.studentId === id)
    // Fetch class name by studentId

    this.setState({
      selectedChild: id,
      PaymentBySelectChild: myPayment,
      ServiceListData: myPayment?.servicesUsed || [],

      tuition: {
        ...this.state.tuition,
        quantity: 1,
        price: myPayment?.tuition[0]?.tuitionFee,
      },
      ChildrenPayment: myPayment,


      // clear state
      selectedTuition: false,
      selectedServices: [],
      totalPayment: 0,
      selectedQuantity: 1,
      selectedDiscount: 0,
    }); // Cập nhật state khi click vào thẻ


    console.log(myPayment);
  };

  handleQuantityChange = (quantity) => {
    this.setState((prevState) => {
      const basePrice = prevState.tuition.basePrice || prevState.tuition.price;

      // Tìm discount phù hợp dựa trên quantity
      const selectedDiscount = prevState.Dicounts.find(discount => discount.number == quantity);
      const discountPrice = selectedDiscount
        ? (basePrice * (1 - selectedDiscount.discount1 / 100))
        : basePrice;

      const newTuitionTotal = quantity * discountPrice;

      // Tính toán lại tổng thanh toán cho dịch vụ đã chọn
      const totalServicesCost = prevState.selectedServices.reduce((total, service) => {
        return total + (service.quantity * service.price);
      }, 0);

      // Nếu học phí được chọn thì cộng học phí vào tổng thanh toán
      const totalPayment = (prevState.selectedTuition ? newTuitionTotal : 0) + totalServicesCost;

      return {
        tuition: {
          ...prevState.tuition,
          quantity: quantity,
          price: discountPrice,
          basePrice: basePrice,
        },
        totalPayment, // Cập nhật lại tổng thanh toán
        selectedQuantity: quantity,
        selectedDiscount: selectedDiscount,
      };
    });
  };




  handleCheckboxChange = (type, value) => {
    let updatedState = { ...this.state };

    switch (type) {
      case "tuition":
        updatedState.selectedTuition = value;
        break;
      case "serviceAll":
        updatedState.selectedServices = value.checked ? this.state.ServiceListData : [];
        break;
      case "service":
        const selectedServices = value.checked
          ? [...updatedState.selectedServices, value.service]
          : updatedState.selectedServices.filter(service => service.service !== value.service.service);
        updatedState.selectedServices = selectedServices;
        break;
      default:
        break;
    }

    // Tính toán lại tổng thanh toán
    const tuitionTotal = updatedState.selectedTuition ? this.state.tuition.quantity * this.state.tuition.price : 0;
    const totalServicesCost = updatedState.selectedServices.reduce((total, service) => {
      return total + (service.quantity * service.price);
    }, 0);

    updatedState.totalPayment = tuitionTotal + totalServicesCost;

    this.setState(updatedState);
  };


  // Hàm gọi API thanh toán
  handlePayment = () => {
    const { selectedChild, selectedTuition, tuition, selectedServices, totalPayment, ChildrenPayment, selectedDiscount } = this.state;

    // Lấy năm và tháng hiện tại
    const currentDate = new Date();
    const year = currentDate.getFullYear(); // Lấy năm hiện tại
    const month = currentDate.getMonth() + 1; // Lấy tháng hiện tại (tháng trả về từ 0 -> 11, cộng 1 để có tháng đúng)

    const paymentData = {
      amount: totalPayment,
      childId: selectedChild,
      tuitionId: selectedTuition ? ChildrenPayment?.tuition[0]?.tuitionId : null,
      serviceId: selectedServices ? selectedServices.map(service => (service.service)) : [],

      paymentName: (selectedTuition && selectedServices && selectedServices.length > 0)
        ? `Tuiton and services ${month < 10 ? `0${month}` : month}/${year}` // Nếu cả 2 được chọn
        : selectedTuition
          ? `Tuition fee ${month < 10 ? `0${month}` : month}/${year}` // Nếu chỉ có selectedTuition
          : (selectedServices && selectedServices.length > 0)
            ? `Service fee ${month < 10 ? `0${month}` : month}/${year}` // Nếu chỉ có selectedServices
            : `Tuiton and services ${month < 10 ? `0${month}` : month}/${year}`, // Nếu không có gì

      tuitionAmount: ChildrenPayment?.tuition[0]?.tuitionFee || 0,
      month: selectedDiscount?.number - 1 || 0,
      discount: selectedDiscount?.discountId || 1,
    };

    console.log(paymentData);
    if (totalPayment === 0) {
      alert("You need to choose Payment");
    }
    else {
      // Gọi API thanh toán
      axios.post(`${process.env.REACT_APP_API_URL}/api/Payment/create-payment-url`, paymentData)
        .then(response => {
          if (response.data.url) {
            // Điều hướng người dùng đến URL của VNPAY sandbox
            window.location.href = response.data.url;

          } else {
            alert("Failed to get payment URL. Please try again.");
          }
          // Cập nhật lại UI nếu cần
        })
        .catch(error => {
          console.error("Payment failed", error);
          alert("Payment failed. Please try again.");
        });
    }

  };


  render() {
    const { ServiceListData, UserListData, tuition, showServices, Children, Class, selectedChild, Payment, ChildrenPayment } = this.state;
    const userData = getSession('user').user

    const roleId = userData.roleId
    const parentId = userData?.userId;


    // Tính tổng chi phí của tất cả các dịch vụ
    const totalServicesCost = ServiceListData && ServiceListData.reduce((total, item) => {
      return total + (item.quantity * item.price);
    }, 0);

    // Lấy năm và tháng hiện tại
    const currentDate = new Date();
    const year = currentDate.getFullYear(); // Lấy năm hiện tại
    const month = currentDate.getMonth() + 1; // Lấy tháng hiện tại (tháng trả về từ 0 -> 11, cộng 1 để có tháng đúng)


    return (
      <div
        style={{ flex: 1 }}
        onClick={() => {
          document.body.classList.remove("offcanvas-active");
        }}
      >
        <div>
          <div className="container-fluid">
            <PageHeader
              HeaderText="Payment Management"
              Breadcrumb={[
                { name: "Payment", navigate: "payment" },
              ]}
            />
            <div className="row clearfix">

              <div className="col-lg-12 col-md-12">
                <div className="card planned_task">
                  <div className="header d-flex justify-content-between">
                    <h2>Payment</h2>
                    {roleId === 2 ? (
                      <a onClick={() => this.handlePaymentHistory()} class="btn btn-success text-white">History Payment</a>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="card">
                  <div className="body project_report">
                    <div className="row pt-2">
                      <div className="col-md-3">
                        <h4 className="pb-4">Your Children</h4>
                        {Children && Children.map(i => (
                          <div
                            key={i.studentId} // Sử dụng một giá trị duy nhất cho key
                            className={`border mb-3 border-dark rounded ${selectedChild === i.studentId ? 'selected' : ''}`}
                            style={{
                              backgroundColor: selectedChild === i.studentId ? '#c6e5ff' : 'transparent',
                              cursor: 'pointer',
                            }}
                            onClick={() => this.handleCardClick(i.studentId, Payment)} // Gọi hàm handleCardClick khi click vào thẻ
                          >
                            <div className="card-body text-dark">
                              <h5 className="card-title">{i?.fullName}</h5>
                              <p className="card-text">StudentCode: {i?.code}</p>
                              <p className="card-text">Class: {i?.className || 'Loading...'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {selectedChild === null
                        ? <div className="col-md-9 d-flex align-items-center">
                          <div>
                            <h4>Please select your child who wants to pay tuition for.    {month} / {year}</h4>
                            <p className="text-danger">Tuition fees will need to be paid between the 1st and 5th of each month.</p>
                          </div>
                        </div>
                        :
                        <div className="col-md-9">
                          <h4 className="pb-4"> Tuiton Fee Payable</h4>
                          {!(ChildrenPayment && (ChildrenPayment?.tuition?.length > 0 || ChildrenPayment?.servicesUsed?.length > 0)) ?
                            <h5>No payment required yet</h5> :
                            <div className="table-responsive">
                              <table className="table m-b-0 table-hover">
                                <thead className="">
                                  <tr className="theme-color">
                                    <th>#</th>
                                    <th>Payment Name</th>
                                    <th>Quantity
                                      <i className="icon-info m-2" data-toggle="tooltip" title="You can change the number of months you want to pay to receive a discount." />
                                    </th>
                                    <th>Discount</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                    ChildrenPayment?.tuition.length !== 0 && <tr>
                                      <td>
                                        <input type="checkbox"
                                          checked={this.state.selectedTuition}
                                          onChange={(e) => this.handleCheckboxChange("tuition", e.target.checked)} />
                                      </td>
                                      <td>{tuition?.paymentName}</td>
                                      {/* <td className="text-truncate" style={{ maxWidth: "150px" }}>{request?.description}</td> */}
                                      <td>
                                        <select
                                          style={{ width: '70%' }}
                                          className="form-control"
                                          value={this.state.selectedQuantity} // Giá trị đã chọn
                                          onChange={(e) => this.handleQuantityChange(e.target.value)} // Khi thay đổi giá trị trong dropdown
                                        >
                                          {this.state.quantityOptions.map((quantity) => (
                                            <option key={quantity} value={quantity}>
                                              {quantity} Month
                                            </option>
                                          ))}
                                        </select>
                                      </td>
                                      {/* Hiển thị phần trăm discount */}
                                      <td>{this.state.selectedDiscount ? `${this.state.selectedDiscount.discount1} %` : '0%'}</td>
                                      <td>{tuition?.price?.toLocaleString('vi-VN')}</td>
                                      <td className="text-danger">{(tuition?.quantity * tuition?.price)?.toLocaleString('vi-VN')} VNĐ</td>
                                    </tr>
                                  }

                                  {ServiceListData.length !== 0 && (
                                    <React.Fragment>
                                      <tr>
                                        <td>
                                          <input
                                            type="checkbox"
                                            checked={this.state.selectedServices.length === ServiceListData.length} // Kiểm tra nếu số lượng dịch vụ đã chọn bằng số dịch vụ tổng thì đánh dấu chọn
                                            onChange={(e) => this.handleCheckboxChange("serviceAll", { checked: e.target.checked })}
                                          />
                                        </td>
                                        <td>Services Month</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                          <span className="text-danger">
                                            {totalServicesCost?.toLocaleString('vi-VN')} VNĐ
                                          </span>
                                          <span onClick={this.toggleServices} style={{ cursor: 'pointer' }} className="ml-4">
                                            {this.state.showServices ? (
                                              <i className="icon-arrow-up"></i> // Biểu tượng khi danh sách dịch vụ đang hiển thị
                                            ) : (
                                              <i className="icon-arrow-down"></i> // Biểu tượng khi danh sách dịch vụ bị ẩn
                                            )}
                                          </span>
                                        </td>
                                      </tr>
                                      {this.state.showServices && ServiceListData.map((item, index) => (
                                        <tr key={"service" + index}>
                                          <td></td>
                                          <td>
                                            <input
                                              className="mr-2"
                                              type="checkbox"
                                              checked={this.state.selectedServices.some(service => service.serviceName === item.serviceName)} // Kiểm tra xem dịch vụ này đã được chọn chưa
                                              onChange={(e) => this.handleCheckboxChange("service", { checked: e.target.checked, service: item })}
                                            />
                                            {item?.serviceName}
                                          </td>
                                          <td>{item?.quantity}</td>
                                          <td></td>
                                          <td>{item?.price?.toLocaleString('vi-VN')}</td>
                                          <td className="text-danger">{(item?.quantity * item?.price)?.toLocaleString('vi-VN')} VNĐ</td>
                                        </tr>
                                      ))}
                                    </React.Fragment>
                                  )}


                                </tbody>
                              </table>
                            </div>
                          }
                          <hr></hr>


                          {!(ChildrenPayment && (ChildrenPayment?.tuition?.length > 0 || ChildrenPayment?.servicesUsed?.length > 0)) ?
                            <></> :
                            <div className="d-flex justify-content-end">
                              <h4 className="py-4 "> Total Payment: </h4>
                              <h4 className="text-danger p-4 " >{this.state.totalPayment?.toLocaleString('vi-VN')} VNĐ</h4>
                              <div className="py-4">
                                <button type="button " onClick={this.handlePayment} class="btn btn-primary btn-lg">Payment</button>
                              </div>
                            </div>
                          }

                        </div>}

                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Modal */}
        {/* <Modal show={this.state.showModal} onHide={this.handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            This is the information related to the quantity.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseModal}>Close</Button>
          </Modal.Footer>
        </Modal> */}
      </div >
    );
  }
}

export default withRouter(PaymentList);

