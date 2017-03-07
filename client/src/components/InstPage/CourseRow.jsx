import React, {Component} from 'react';
import { browserHistory, Link } from 'react-router';

import SingleSelect from '../partials/SingleSelect.jsx';
import ReactAlert from '../partials/ReactAlert.jsx';

class CourseRow extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.state = {
      userAlreadySubscribed: this.props.currUserCourseIds.includes(this.props.course.id)
    };
    this.handleRemoval = this.handleRemoval.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.toggleRemoveAdd = this.toggleRemoveAdd.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ userAlreadySubscribed: nextProps.currUserCourseIds.includes(nextProps.course.id) });
  }

  handleRemoval() {
    let course_id = this.props.course.id;
    let user_id = this.props.userId;
    $.ajax({
      method: 'DELETE',
      url: `/api/users/${user_id}/courses/${course_id}`,
      success: response => {
        response ? this.toggleRemoveAdd('remove') : this.reactAlert.showAlert("Server error - could not remove course", "error");
      }
    });
  }

  handleAddition() {
    let course_id = this.props.course.id;
    let user_id = this.props.userId;
    $.ajax({
      method: 'POST',
      url: `/api/users/${user_id}/courses/${course_id}`,
      data: { course_id },
      success: response => {
        response ? this.toggleRemoveAdd('add') : this.reactAlert.showAlert("could not add course", "error");
      }
    });
  }

  toggleRemoveAdd(removeOrAdd) {
    let userAlreadySubscribed = !this.state.userAlreadySubscribed;
    this.setState({userAlreadySubscribed});
    removeOrAdd === 'remove' ? this.reactAlert.showAlert("Unsubscribed from course", "info") : this.reactAlert.showAlert("Subscribed to course", "info");
  }

  render() {
    return (
      <div className="course-row">
        <Link to={`/courses/${this.props.course.id}`}>{this.props.course.short_display_name}</Link>
        <span> - </span>
        { this.state.userAlreadySubscribed ? <Link onClick={this.handleRemoval}>Remove from my courses</Link> : <Link onClick={this.handleAddition}>Add to my courses</Link> }
      </div>
    );
  }
}

export default CourseRow;
