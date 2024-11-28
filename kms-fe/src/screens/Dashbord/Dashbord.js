import React from "react";
import { connect } from "react-redux";
import ReactEcharts from "echarts-for-react";
import "echarts-gl";
import echarts from "echarts";
import LogoiCON from "../../assets/images/logo-icon.svg";
import AwsomeImage from "../../assets/images/blog/blog-page-4.jpg";
import AwsomeImageOt from "../../assets/images/blog/blog-page-2.jpg";
import { Dropdown } from "react-bootstrap";
import ReferralsCard from "../../components/Dashboard/ReferralsCard";
import ResentChat from "../../components/Dashboard/ResentChat";
import TwitterFeedCard from "../../components/Dashboard/TwitterFeedCard";
import FeedCards from "../../components/Dashboard/FeedsCard";
import PageHeader from "../../components/PageHeader";
import {
  topProductOption,
  topRevenueOption,
  topRevenueMonthlyOption,
  saleGaugeOption,
  dataManagetOption,
  sparkleCardData,
} from "../../Data/DashbordData";
import {
  toggleMenuArrow,
  onPressTopProductDropDown,
  loadSparcleCard,
  onPressReferralsDropDown,
  onPressRecentChatDropDown,
  onPressDataManagedDropDown,
  facebookProgressBar,
  twitterProgressBar,
  affiliatesProgressBar,
  searchProgressBar,
} from "../../actions";
import SparkleCard from "../../components/SparkleCard";

var timer = null;
class Dashbord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardData: [],
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadDataCard();
    this.setState({
      cardData: [...sparkleCardData],
    });

    this.chartPlace();
  }

  chartPlace = () => {
    var chartDom = document.getElementById("topsaleDonut");
    var myChart = echarts.init(chartDom);
    var option;
    option = saleGaugeOption;

    option && myChart.setOption(option);
  };
  async loadDataCard() {
    const { cardData } = this.state;
    var allCardData = cardData;
    cardData.map((data, i) => {
      var uData = [];
      data.sparklineData.data.map((d, j) => {
        uData[j] = Math.floor(Math.random() * 10) + 1;
      });
      allCardData[i].sparklineData.data = [...uData];
    });
    this.setState({ cardData: [...allCardData] });
  }

  render() {
    const { loadingPage } = this.props;
    const { cardData } = this.state;
    if (loadingPage) {
      return (
        <div className="page-loader-wrapper">
          <div className="loader">
            <div className="m-t-30">
              <img src={LogoiCON} width="48" height="48" alt="Lucid" />
            </div>
            <p>Please wait...</p>
          </div>
        </div>
      );
    }
    return (
      <div
        onClick={() => {
          document.body.classList.remove("offcanvas-active");
        }}
      >
        <div>
          <div className="container-fluid">
            <PageHeader
              HeaderText="Dashboard"
              Breadcrumb={[{ name: "Dashboard" }]}
            />
            <div className="row clearfix">
              {cardData.map((data, i) => (
                <SparkleCard
                  index={i}
                  key={data.heading}
                  Heading={data.heading}
                  Money={data.money}
                  PerText={data.perText}
                  isRandomUpdate={true}
                  // Data={data.sparklineData}
                  mainData={data.sparklineData.data}
                  chartColor={data.sparklineData.areaStyle.color}
                  ContainerClass="col-lg-3 col-md-6 col-sm-6"
                />
              ))}
            </div>

            <div className="row clearfix">
              <div className="col-lg-6 col-md-12">
                <div className="card">
                  <div className="header">
                    <h2>Top Products</h2>
                    <Dropdown as="ul" className="header-dropdown">
                      <Dropdown.Toggle
                        variant="success"
                        as="li"
                        id="dropdown-basic"
                      >
                        <Dropdown.Menu
                          as="ul"
                          className="dropdown-menu dropdown-menu-right"
                        >
                          <li>
                            <a>Action</a>
                          </li>
                          <li>
                            <a>Another Action</a>
                          </li>
                          <li>
                            <a>Something else</a>
                          </li>
                        </Dropdown.Menu>
                      </Dropdown.Toggle>
                    </Dropdown>
                  </div>
                  <div className="body">
                    <ReactEcharts
                      option={topProductOption}
                      opts={{ renderer: "svg" }} // use svg to render the chart.
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <ReferralsCard />
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card">
                  <div className="header">
                    <h2>Total Revenue</h2>
                    <Dropdown as="ul" className="header-dropdown">
                      <Dropdown.Toggle
                        variant="success"
                        as="li"
                        id="dropdown-basic"
                      >
                        <Dropdown.Menu
                          as="ul"
                          className="dropdown-menu dropdown-menu-right"
                        >
                          <li>
                            <a>Action</a>
                          </li>
                          <li>
                            <a>Another Action</a>
                          </li>
                          <li>
                            <a>Something else</a>
                          </li>
                        </Dropdown.Menu>
                      </Dropdown.Toggle>
                    </Dropdown>
                  </div>
                  <div className="body text-center">
                    <h4 className="margin-0">Total Sale</h4>
                    <div
                      id="topsaleDonut"
                      style={{ height: 125, width: "100%" }}
                    ></div>
                    <ReactEcharts
                      option={topRevenueOption}
                      opts={{ renderer: "svg" }}
                      style={{
                        height: "35px",
                        marginLeft: "35%",
                        marginRight: "35%",
                        bottom: 0,
                        top: 0,
                      }} // use svg to render the chart.
                    />
                    <h6 className="p-b-15">Weekly Earnings</h6>
                    <div className="sparkline">
                      <ReactEcharts
                        option={topRevenueMonthlyOption}
                        opts={{ renderer: "svg" }} // use svg to render the chart.
                        style={{
                          height: "35px",
                          marginLeft: "25%",
                          marginRight: "25%",
                          bottom: 0,
                          top: 0,
                        }}
                      />
                    </div>
                    <h6>Monthly Earnings</h6>
                  </div>
                </div>
              </div>
            </div>

            <div className="row clearfix">
              <div className="col-lg-4 col-md-12">
                <ResentChat />
              </div>
              <div className="col-lg-8 col-md-12">
                <div className="card">
                  <div className="header">
                    <h2>Data Managed</h2>
                    <Dropdown as="ul" className="header-dropdown">
                      <Dropdown.Toggle
                        variant="success"
                        as="li"
                        id="dropdown-basic"
                      >
                        <Dropdown.Menu
                          as="ul"
                          className="dropdown-menu dropdown-menu-right"
                        >
                          <li>
                            <a>Action</a>
                          </li>
                          <li>
                            <a>Another Action</a>
                          </li>
                          <li>
                            <a>Something else</a>
                          </li>
                        </Dropdown.Menu>
                      </Dropdown.Toggle>
                    </Dropdown>
                  </div>
                  <div className="body">
                    <div className="row">
                      <div className="col-md-6">
                        <h2>1,523</h2>
                        <p>External Records</p>
                      </div>
                      <div className="col-md-6">
                        <div className="sparkline m-b-20">
                          <ReactEcharts
                            option={dataManagetOption}
                            opts={{ renderer: "svg" }}
                            style={{
                              height: "70px",
                              width: "180px",
                              marginLeft: "30%",
                              bottom: 0,
                            }} // use svg to render the chart.
                          />
                        </div>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-hover m-b-0">
                        <tbody>
                          <tr>
                            <th>
                              <i className="fa fa-circle text-success"></i>
                            </th>
                            <td>Twitter</td>
                            <td>
                              <span>862 Records</span>
                            </td>
                            <td>
                              35% <i className="fa fa-caret-up "></i>
                            </td>
                          </tr>
                          <tr>
                            <th>
                              <i className="fa fa-circle text-info"></i>
                            </th>
                            <td>Facebook</td>
                            <td>
                              <span>451 Records</span>
                            </td>
                            <td>
                              15% <i className="fa fa-caret-up "></i>
                            </td>
                          </tr>
                          <tr>
                            <th>
                              <i className="fa fa-circle text-warning"></i>
                            </th>
                            <td>Mailchimp</td>
                            <td>
                              <span>502 Records</span>
                            </td>
                            <td>
                              20% <i className="fa fa-caret-down"></i>
                            </td>
                          </tr>
                          <tr>
                            <th>
                              <i className="fa fa-circle text-danger"></i>
                            </th>
                            <td>Google</td>
                            <td>
                              <span>502 Records</span>
                            </td>
                            <td>
                              20% <i className="fa fa-caret-up "></i>
                            </td>
                          </tr>
                          <tr>
                            <th>
                              <i className="fa fa-circle "></i>
                            </th>
                            <td>Other</td>
                            <td>
                              <span>237 Records</span>
                            </td>
                            <td>
                              10% <i className="fa fa-caret-down"></i>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row clearfix">
              <div className="col-lg-4 col-md-12">
                <FeedCards />
              </div>
              <div className="col-lg-4 col-md-12">
                <TwitterFeedCard />
              </div>
              <div className="col-lg-4 col-md-12">
                <div className="card overflowhidden">
                  <div className="body top_counter bg-success">
                    <div className="icon bg-transparent">
                      <img
                        src={require("../../assets/images/xs/avatar2.jpg")}
                        className="rounded-circle"
                        alt=""
                      />
                    </div>
                    <div className="content text-light">
                      <div>Team Leader</div>
                      <h6>Maryam Amiri</h6>
                    </div>
                  </div>
                  <div className="body">
                    <div className="list-group list-widget">
                      <a className="list-group-item">
                        <span className="badge badge-success">654</span>
                        <i className="fa fa-envelope text-muted"></i>Inbox
                      </a>
                      <a className="list-group-item">
                        <span className="badge badge-info">364</span>
                        <i className="fa fa-eye text-muted"></i> Profile visits
                      </a>
                      <a className="list-group-item">
                        <span className="badge badge-warning">19</span>
                        <i className="fa fa-bookmark text-muted"></i> Bookmarks
                      </a>
                      <a className="list-group-item">
                        <span className="badge badge-warning">12</span>
                        <i className="fa fa-phone text-muted"></i> Call
                      </a>
                      <a className="list-group-item">
                        <span className="badge badge-danger">54</span>
                        <i className="fa fa-comments-o text-muted"></i> Messages
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row clearfix">
              <div className="col-lg-12">
                <div className="card">
                  <div className="header">
                    <h2>Lucid Activities</h2>
                  </div>
                  <div className="body">
                    <div
                      className="timeline-item green"
                      date-is="20-04-2018 - Today"
                    >
                      <h5>
                        Hello, 'Im a single div responsive timeline without
                        media Queries!
                      </h5>
                      <span>
                        <a>Elisse Joson</a> San Francisco, CA
                      </span>
                      <div className="msg">
                        <p>
                          I'm speaking with myself, number one, because I have a
                          very good brain and I've said a lot of things. I write
                          the best placeholder text, and I'm the biggest
                          developer on the web card she has is the Lorem card.
                        </p>
                        <a className="m-r-20">
                          <i className="icon-heart"></i> Like
                        </a>
                        <a
                          role="button"
                          data-toggle="collapse"
                          aria-expanded="false"
                          aria-controls="collapseExample"
                        >
                          <i className="icon-bubbles"></i> Comment
                        </a>
                        <div className="collapse m-t-10" id="collapseExample">
                          <div className="well">
                            <form>
                              <div className="form-group">
                                <textarea
                                  rows="2"
                                  className="form-control no-resize"
                                  placeholder="Enter here for tweet..."
                                ></textarea>
                              </div>
                              <button className="btn btn-primary">
                                Submit
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="timeline-item blue"
                      date-is="19-04-2018 - Yesterday"
                    >
                      <h5>Oeehhh, that's awesome.. Me too!</h5>
                      <span>
                        <a title="">Katherine Lumaad</a> Oakland, CA
                      </span>
                      <div className="msg">
                        <p>
                          I'm speaking with myself, number one, because I have a
                          very good brain and I've said a lot of things. on the
                          web by far... While that's mock-ups and this is
                          politics, are they really so different? I think the
                          only card she has is the Lorem card.
                        </p>
                        <div className="timeline_img m-b-20">
                          <img
                            className="w-25"
                            src={AwsomeImage}
                            alt="Awesome Image"
                          />
                          <img
                            className="w-25"
                            src={AwsomeImageOt}
                            alt="Awesome Image"
                          />
                        </div>
                        <a className="m-r-20">
                          <i className="icon-heart"></i> Like
                        </a>
                        <a
                          role="button"
                          data-toggle="collapse"
                          aria-expanded="false"
                          aria-controls="collapseExample1"
                        >
                          <i className="icon-bubbles"></i> Comment
                        </a>
                        <div className="collapse m-t-10" id="collapseExample1">
                          <div className="well">
                            <form>
                              <div className="form-group">
                                <textarea
                                  rows="2"
                                  className="form-control no-resize"
                                  placeholder="Enter here for tweet..."
                                ></textarea>
                              </div>
                              <button className="btn btn-primary">
                                Submit
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="timeline-item warning" date-is="21-02-2018">
                      <h5>
                        An Engineer Explains Why You Should Always Order the
                        Larger Pizza
                      </h5>
                      <span>
                        <a title="">Gary Camara</a> San Francisco, CA
                      </span>
                      <div className="msg">
                        <p>
                          I'm speaking with myself, number one, because I have a
                          very good brain and I've said a lot of things. I write
                          the best placeholder text, and I'm the biggest
                          developer on the web by far... While that's mock-ups
                          and this is politics, is the Lorem card.
                        </p>
                        <a className="m-r-20">
                          <i className="icon-heart"></i> Like
                        </a>
                        <a
                          role="button"
                          data-toggle="collapse"
                          aria-expanded="false"
                          aria-controls="collapseExample2"
                        >
                          <i className="icon-bubbles"></i> Comment
                        </a>
                        <div className="collapse m-t-10" id="collapseExample2">
                          <div className="well">
                            <form>
                              <div className="form-group">
                                <textarea
                                  rows="2"
                                  className="form-control no-resize"
                                  placeholder="Enter here for tweet..."
                                ></textarea>
                              </div>
                              <button className="btn btn-primary">
                                Submit
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  loginReducer,
  navigationReducer,
  analyticalReducer,
}) => ({
  email: loginReducer.email,
  menuArrowToggle: navigationReducer.menuArrowToggle,
  sparkleCardData: analyticalReducer.sparkleCardData,
  topProductDropDown: analyticalReducer.topProductDropDown,
  referralsDropDown: analyticalReducer.referralsDropDown,
  recentChatDropDown: analyticalReducer.recentChatDropDown,
  facebookShowProgressBar: analyticalReducer.facebookShowProgressBar,
  twitterShowProgressBar: analyticalReducer.twitterShowProgressBar,
  affiliatesShowProgressBar: analyticalReducer.affiliatesShowProgressBar,
  searchShowProgressBar: analyticalReducer.searchShowProgressBar,
  loadingPage: analyticalReducer.loadingPage,
});

export default connect(mapStateToProps, {
  toggleMenuArrow,
  loadSparcleCard,
  onPressTopProductDropDown,
  onPressReferralsDropDown,
  onPressRecentChatDropDown,
  onPressDataManagedDropDown,
  facebookProgressBar,
  twitterProgressBar,
  affiliatesProgressBar,
  searchProgressBar,
})(Dashbord);
