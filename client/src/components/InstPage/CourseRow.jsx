import React, {Component} from 'react';
import { Link } from 'react-router';

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
    fetch(`/api/users/currentuser/courses/${this.props.course.id}`, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/string',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) { this.toggleRemoveAdd('remove'); }
      else { throw 'Server returned false'; }
    })
    .catch(() => this.reactAlert.showAlert('Unable to remove course', 'error'));
  }

  handleAddition() {
    let courseId = this.props.course.id;
    fetch(`/api/users/currentuser/courses/${courseId}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ courseId })
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) { this.toggleRemoveAdd('add'); }
      else { throw 'Server returned false'; }
    })
    .catch(() => this.reactAlert.showAlert('Unable to add course', 'error'));
  }

  toggleRemoveAdd(removeOrAdd) {
    let userAlreadySubscribed = !this.state.userAlreadySubscribed;
    this.setState({userAlreadySubscribed});
    removeOrAdd === 'remove' ? this.reactAlert.showAlert('Unsubscribed from course', 'info') : this.reactAlert.showAlert('Subscribed to course', 'info');
  }

  render() {
    return (
      <div className='course-row'>
        <Link to={`/courses/${this.props.course.id}`}>{this.props.course.short_display_name}</Link>
        <span> - </span>
        { this.state.userAlreadySubscribed ? <Link onClick={this.handleRemoval}>Remove from my courses</Link> : <Link onClick={this.handleAddition}>Add to my courses</Link> }
      </div>
    );
  }
}

export default CourseRow;
