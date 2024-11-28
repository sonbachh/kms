import React from "react";
import axios from "axios";
import ReactEcharts from "echarts-for-react";
import PageHeader from "../../components/PageHeader";

class DashboardPrincipal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classSummaryData: {},
      enrollmentData: {},
      teacherPieData: {},
      teacherBarData: {},
      originalTeacherData: [],
      originalEnrollmentData: [], // Dữ liệu gốc cho biểu đồ nhập học
      financialData: {}, // Biểu đồ đường doanh thu
      selectedYear: new Date().getFullYear(), // Năm mặc định là năm hiện tại
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadClassSummaryData();
    this.loadEnrollmentData();
    this.loadTeacherData();
    this.loadFinancialData(this.state.selectedYear); // Load dữ liệu doanh thu

  }
  handleYearChange = (event) => {
    const year = event.target.value;
    this.setState({ selectedYear: year });
    this.loadFinancialData(year); // Load dữ liệu mới khi chọn năm
  };


  // loadFinancialData = async (year) => {
  //   try {
  //     const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/Dashboard/GetFinancialSummaryForYear/${year}`);
  //     const data = response.data;

  //     // Lấy dữ liệu các tháng
  //     const months = data.financialSummaryByMonth.map((item) => item.month);
  //     const tuitionRevenues = data.financialSummaryByMonth.map((item) => item.tuitionRevenue);
  //     const serviceRevenues = data.financialSummaryByMonth.map((item) => item.serviceRevenue);
  //     const totalRevenues = data.financialSummaryByMonth.map((item) => item.totalRevenue);

  //     // Thiết lập cấu hình biểu đồ
  //     this.setState({
  //       financialData: {
  //         xAxis: {
  //           type: "category",
  //           data: months,
  //           axisLabel: {
  //             rotate: 45,
  //           },
  //         },
  //         yAxis: {
  //           type: "value",
  //           name: "Doanh thu (VND)",
  //         },
  //         series: [
  //           {
  //             name: "Doanh thu học phí",
  //             type: "line",
  //             data: tuitionRevenues,
  //             smooth: true,
  //             itemStyle: { color: "#4CAF50" },
  //           },
  //           {
  //             name: "Doanh thu dịch vụ",
  //             type: "line",
  //             data: serviceRevenues,
  //             smooth: true,
  //             itemStyle: { color: "#FF5722" },
  //           },
  //           {
  //             name: "Tổng doanh thu",
  //             type: "line",
  //             data: totalRevenues,
  //             smooth: true,
  //             itemStyle: { color: "#3b82f6" }, // Màu xanh dương
  //             lineStyle: {
  //               width: 2, // Đường tổng nổi bật hơn
  //             },
  //           },
  //         ],
  //         tooltip: {
  //           trigger: "axis",
  //           formatter: (params) => {
  //             let content = `${params[0].axisValue}<br/>`;
  //             params.forEach((item) => {
  //               content += `${item.marker} ${item.seriesName}: ${item.data.toLocaleString()} VND<br/>`;
  //             });
  //             return content;
  //           },
  //         },
  //         legend: {
  //           data: ["Doanh thu học phí", "Doanh thu dịch vụ", "Tổng doanh thu"],
  //           top: "10%",
  //         },
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Error fetching financial data: ", error);
  //   }
  // };

  loadFinancialData = (year) => {
    // Dữ liệu mẫu
    const data = {
      year: 2024,
      totalRevenue: 120000000,
      financialSummaryByMonth: [
        { month: "January", tuitionRevenue: 10000000, serviceRevenue: 2000000, totalRevenue: 12000000 },
        { month: "February", tuitionRevenue: 8000000, serviceRevenue: 1500000, totalRevenue: 9500000 },
        { month: "March", tuitionRevenue: 11000000, serviceRevenue: 2500000, totalRevenue: 13500000 },
        { month: "April", tuitionRevenue: 10500000, serviceRevenue: 1800000, totalRevenue: 12300000 },
        { month: "May", tuitionRevenue: 9500000, serviceRevenue: 2200000, totalRevenue: 11700000 },
        { month: "June", tuitionRevenue: 12000000, serviceRevenue: 3000000, totalRevenue: 15000000 },
        { month: "July", tuitionRevenue: 11500000, serviceRevenue: 2800000, totalRevenue: 14300000 },
        { month: "August", tuitionRevenue: 12500000, serviceRevenue: 3200000, totalRevenue: 15700000 },
        { month: "September", tuitionRevenue: 10000000, serviceRevenue: 2400000, totalRevenue: 12400000 },
        { month: "October", tuitionRevenue: 11000000, serviceRevenue: 2600000, totalRevenue: 13600000 },
        { month: "November", tuitionRevenue: 10500000, serviceRevenue: 2000000, totalRevenue: 12500000 },
        { month: "December", tuitionRevenue: 13000000, serviceRevenue: 3500000, totalRevenue: 16500000 },
      ],
    };

    const months = data.financialSummaryByMonth.map((item) => item.month);
    const tuitionRevenues = data.financialSummaryByMonth.map((item) => item.tuitionRevenue);
    const serviceRevenues = data.financialSummaryByMonth.map((item) => item.serviceRevenue);
    const totalRevenues = data.financialSummaryByMonth.map((item) => item.totalRevenue);

    this.setState({
      financialData: {
        xAxis: {
          type: "category",
          data: months,
          axisLabel: {
            rotate: 45,
          },
        },
        yAxis: {
          type: "value",
          name: "Doanh thu (VND)",
        },
        series: [
          {
            name: "Doanh thu học phí",
            type: "line",
            data: tuitionRevenues,
            smooth: true,
            itemStyle: { color: "#4CAF50" },
          },
          {
            name: "Doanh thu dịch vụ",
            type: "line",
            data: serviceRevenues,
            smooth: true,
            itemStyle: { color: "#FF5722" },
          },
          {
            name: "Tổng doanh thu",
            type: "line",
            data: totalRevenues,
            smooth: true,
            itemStyle: { color: "#3b82f6" },
            lineStyle: {
              width: 2,
            },
          },
        ],
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            let content = `${params[0].axisValue}<br/>`;
            params.forEach((item) => {
              content += `${item.marker} ${item.seriesName}: ${item.data.toLocaleString()} VND<br/>`;
            });
            return content;
          },
        },
        legend: {
          data: ["Doanh thu học phí", "Doanh thu dịch vụ", "Tổng doanh thu"],
          top: "10%",
        },
      },
    });
  };

  loadClassSummaryData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/Dashboard/GetDashboardSummary`);
      const data = response.data;

      const classNames = data.classSummaries.map((cls) => cls.classId);
      const maleData = data.classSummaries.map((cls) => cls.male);
      const femaleData = data.classSummaries.map((cls) => cls.female);

      this.setState({
        classSummaryData: {
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            data: classNames,
            axisLabel: {
              rotate: 45,
              interval: 0,
            },
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              name: 'Male',
              type: 'bar',
              data: maleData,
              itemStyle: { color: '#4CAF50' },
            },
            {
              name: 'Female',
              type: 'bar',
              data: femaleData,
              itemStyle: { color: '#FF5722' },
            },
          ],
          legend: {
            data: ['Male', 'Female'],
          },
          tooltip: {
            trigger: 'axis',
          },
          dataZoom: [
            {
              type: 'slider',
              show: true,
              xAxisIndex: 0,
              start: 0,
              end: Math.min(100, (800 / classNames.length) * 100),
            },
          ],
        },
      });
    } catch (error) {
      console.error("Error fetching class summary data: ", error);
    }
  };

  loadEnrollmentData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/Dashboard/GetEnrollmentStatistics`);
      const data = response.data;

      const months = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);
      const newStudents = Array.from({ length: 12 }, (_, i) => {
        const monthIndex = i + 1;
        const enrollment = data.monthlyEnrollments.find((e) => e.month === monthIndex);
        return enrollment ? enrollment.newStudents : 0;
      });

      this.setState({
        enrollmentData: {
          xAxis: {
            type: 'category',
            data: months,
            axisLabel: {
              rotate: 45,
            },
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              name: 'New Students',
              type: 'bar',
              data: newStudents,
              itemStyle: { color: '#3b82f6' },
            },
          ],
          tooltip: {
            trigger: 'axis',
          },
        },
      });
    } catch (error) {
      console.error("Error fetching enrollment data: ", error);
    }
  };

  loadTeacherData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/Dashboard/GetTeacherWithTotal`);
      const data = response.data;

      this.setState({ originalTeacherData: data.teachers }, () => {
        this.generateTeacherPieData();
        this.generateTeacherBarData();
      });
    } catch (error) {
      console.error("Error fetching teacher data: ", error);
    }
  };

  generateTeacherPieData = () => {
    const { originalTeacherData } = this.state;

    const totalTeachers = originalTeacherData.length;
    const teachersWithClasses = originalTeacherData.filter((teacher) => teacher.classes.length > 0).length;
    const teachersWithoutClasses = totalTeachers - teachersWithClasses;

    this.setState({
      teacherPieData: {
        series: [
          {
            name: 'Tỷ lệ giáo viên',
            type: 'pie',
            radius: '50%',
            data: [
              { value: teachersWithClasses, name: 'Có lớp dạy' },
              { value: teachersWithoutClasses, name: 'Không có lớp dạy' },
            ],
            itemStyle: {
              color: function (params) {
                return params.name === 'Có lớp dạy' ? '#4CAF50' : '#FF5722';
              },
            },
          },
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['Có lớp dạy', 'Không có lớp dạy'],
        },
      },
    });
  };

  generateTeacherBarData = () => {
    const { originalTeacherData } = this.state;

    const classCounts = originalTeacherData.map((teacher) => teacher.classes.length);
    const countMap = classCounts.reduce((acc, count) => {
      acc[count] = (acc[count] || 0) + 1;
      return acc;
    }, {});

    const classCountKeys = Object.keys(countMap).map((key) => `Dạy ${key} lớp`);
    const classCountValues = Object.values(countMap);

    this.setState({
      teacherBarData: {
        xAxis: {
          type: 'category',
          data: classCountKeys,
          axisLabel: {
            rotate: 45,
          },
        },
        yAxis: {
          type: 'value',
          name: 'Số lượng giáo viên',
        },
        series: [
          {
            name: 'Số lượng giáo viên',
            type: 'bar',
            data: classCountValues,
            itemStyle: { color: '#2196F3' },
          },
        ],
        tooltip: {
          trigger: 'axis',
          formatter: '{b}: {c} giáo viên',
        },
      },
    });
  };

  render() {
    const { classSummaryData, enrollmentData, teacherPieData, teacherBarData, selectedYear, financialData } = this.state;

    return (
      <div
        onClick={() => {
          document.body.classList.remove("offcanvas-active");
        }}
      >
        <div className="container-fluid">
          <PageHeader HeaderText="Dashboard" Breadcrumb={[{ name: "Dashboard" }]} />

          {/* Biểu đồ Class Gender Distribution */}
          <div className="row clearfix">
            <div className="col-lg-4">
              <div className="card">
                <div className="header">
                  <h2>Teacher Class Distribution (Pie Chart)</h2>
                </div>
                <div className="body" style={{ overflowX: 'auto' }}>
                  <ReactEcharts option={teacherPieData} style={{ height: '400px' }} opts={{ renderer: "svg" }} />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card">
                <div className="header">
                  <h2>Teacher Classification by Class Count (Bar Chart)</h2>
                </div>
                <div className="body" style={{ overflowX: 'auto' }}>
                  <ReactEcharts option={teacherBarData} style={{ height: '400px' }} opts={{ renderer: "svg" }} />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card">
                <div className="header">
                  <h2>Monthly Enrollment Statistics</h2>
                </div>
                <div className="body" style={{ overflowX: 'auto' }}>
                  <ReactEcharts option={enrollmentData} style={{ height: '400px' }} opts={{ renderer: "svg" }} />
                </div>
              </div>
            </div>
          </div>

        

          {/* Biểu đồ hình tròn - Tỷ lệ giáo viên có và không có lớp */}
          {/* <div className="row clearfix">
            <div className="col-lg-6">
              <div className="card">
                <div className="header">
                  <h2>Teacher Class Distribution (Pie Chart)</h2>
                </div>
                <div className="body" style={{ overflowX: 'auto' }}>
                  <ReactEcharts option={teacherPieData} style={{ height: '400px' }} opts={{ renderer: "svg" }} />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card">
                <div className="header">
                  <h2>Teacher Classification by Class Count (Bar Chart)</h2>
                </div>
                <div className="body" style={{ overflowX: 'auto' }}>
                  <ReactEcharts option={teacherBarData} style={{ height: '400px' }} opts={{ renderer: "svg" }} />
                </div>
              </div>
            </div>
          </div> */}
          <div className="row clearfix">


            <div className="col-lg-12">
              <div className="card">
                <div className="header">
                  <h2>Doanh thu theo tháng ({selectedYear})</h2>
                </div>
                <div className="header">
                  <h2>Chọn năm</h2>
                </div>
                <div className="body">
                  <select
                    value={selectedYear}
                    onChange={this.handleYearChange}
                    className="form-control"
                  >
                    {[2023, 2024, 2025].map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="body" style={{ overflowX: "auto" }}>
                  <ReactEcharts option={financialData} style={{ height: "400px" }} opts={{ renderer: "svg" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Biểu đồ cột - Phân loại giáo viên theo số lượng lớp */}
          <div className="row clearfix">

          </div>

          {/* Khung giao diện khác giữ lại */}
          <div className="row clearfix">
            <div className="col-lg-4 col-md-12">
              {/* Thẻ giữ chỗ hoặc phần có thể bổ sung thêm */}
            </div>
            <div className="col-lg-4 col-md-12">
              {/* Thẻ giữ chỗ hoặc phần có thể bổ sung thêm */}
            </div>
            <div className="col-lg-4 col-md-12">
              {/* Thẻ giữ chỗ hoặc phần có thể bổ sung thêm */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardPrincipal;
