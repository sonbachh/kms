
import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import axios from 'axios';
import ProjectsListTable from '../../components/Pages/ProjectsListTable';

class Category extends React.Component {
  state = {
    categories: [],
  };
  componentDidMount() {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/CategoryService/GetAllCategoryService`);
        const data = response.data;
        this.setState({ categories: data });
        console.log(data);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }

  handleCreateCategory = () => {
    // Chuyển hướng đến cap nhat category
    this.props.history.push(`/create-category`);
  };

  render() {

    const { categories } = this.state;

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
              HeaderText="Category Service"
              Breadcrumb={[
                { name: "Category", navigate: "" },
                { name: "Category Service", navigate: "" },
              ]}
            />
            <div className="row clearfix">
              <div className="col-lg-12 col-md-12">
                <div className="card planned_task">
                  <div className="header d-flex justify-content-between">
                    <h2>Category Services Manager</h2>
                    <a onClick={() => this.handleCreateCategory()} class="btn btn-success text-white">Create New Category</a>
                  </div>
                </div>
              </div>
              <ProjectsListTable categories={categories} history={this.props.history}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ categoryReducer }) => ({

});

export default connect(mapStateToProps, {})(Category);