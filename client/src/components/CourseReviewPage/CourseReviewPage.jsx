import React, {Component} from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import LeftSideBar from '../partials/LeftSideBar.jsx';
import RightSideBar from '../RightSideBar/RightSideBar.jsx';
import SearchBar from '../partials/SearchBar.jsx';
import ReactAlert from '../partials/ReactAlert.jsx';
import TopRow from './TopRow.jsx';
import CourseReviewsContainer from './CourseReviewsContainer.jsx';

class CourseReviewPage extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.state = {
      reviewsState: 0
    };
  }

  render() {
    return (
      <div className='course-review-page'>
        <Navbar />
        <LeftSideBar />
        <div className='main-container'>
          <SearchBar />
          <TopRow courseId={this.props.routeParams.course_id} updateCompState={() => this.setState({ reviewsState: this.state.reviewsState + 1 })} />
          <CourseReviewsContainer courseId={this.props.routeParams.course_id} parentState={this.state.reviewsState} />
        </div>
        <RightSideBar />
        { this.reactAlert.container }
      </div>
    );
  }
}

export default CourseReviewPage;
