import React, {Component} from 'react';

import Navbar from '../Navbar/Navbar.jsx';
import LeftSideBar from '../partials/LeftSideBar.jsx';
import RightSideBar from '../partials/RightSideBar.jsx';
import SearchBar from '../partials/SearchBar.jsx';
import ReactAlert from '../partials/ReactAlert.jsx';
import TopRow from './TopRow.jsx';
import NewCourseReviewForm from './NewCourseReviewForm.jsx';
import CourseReviewRows from './CourseReviewRows.jsx';

class CourseReviewPage extends Component {
  constructor(props) {
    super(props);
    this.courseId = this.props.routeParams.course_id;
    this.reactAlert = new ReactAlert();
    this.state = {
      dataLoaded: false,
      pageError: false,
      courseInfo: {},
      courseReviews: [],
      profs: []
    };
    this.loadComponentData = this.loadComponentData.bind(this);
    this.conditionData = this.conditionData.bind(this);
    this.renderPageAfterData = this.renderPageAfterData.bind(this);
  }

  componentDidMount() {
    this.loadComponentData();
  }

  loadComponentData() {
    $.ajax({
      method: 'GET',
      url: `/api/courses/${this.courseId}/reviews`,
      dataType: 'JSON',
      success: response => this.conditionData(response)
    });
  }

  conditionData(response) {
    if (response) {
      response.dataLoaded = true;
      this.setState(response);
    } else {
      this.setState({ dataLoaded: true, pageError: true });
    }
  }

  renderPageAfterData() {
    if (this.state.dataLoaded && this.state.pageError) {
      return (
        <div className="main-container">
          <p className="page-msg">
            <i className="fa fa-exclamation-triangle" aria-hidden="true" />
            Error in loading up the page
          </p>
        </div>
      );
    } else if (this.state.dataLoaded) {
      return (
        <div className="main-container">
          <SearchBar />
          <TopRow courseInfo={this.state.courseInfo} courseReviews={this.state.courseReviews} />
          <NewCourseReviewForm courseId={this.state.courseInfo.id} profs={this.state.profs} reload={this.loadComponentData} />
          <CourseReviewRows courseReviews={this.state.courseReviews} />
        </div>
      );
    } else {
      return (
        <div className="main-container">
          <p className="page-msg">
            <i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
            <span className="sr-only">Loading...</span>
          </p>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="course-review-page">
        <Navbar />
        <LeftSideBar />
        { this.renderPageAfterData() }
        <RightSideBar />
        { this.reactAlert.container }
      </div>
    );
  }
}

export default CourseReviewPage;
