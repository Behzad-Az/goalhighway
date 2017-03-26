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
    this._handleRemoval = this._handleRemoval.bind(this);
    this._handleAddition = this._handleAddition.bind(this);
    this._toggleRemoveAdd = this._toggleRemoveAdd.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ userAlreadySubscribed: nextProps.currUserCourseIds.includes(nextProps.course.id) });
  }

  _handleRemoval() {
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
      if (resJSON) { this._toggleRemoveAdd('remove'); }
      else { throw 'Server returned false'; }
    })
    .catch(() => this.reactAlert.showAlert('Unable to remove course', 'error'));
  }

  _handleAddition() {
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
      if (resJSON) { this._toggleRemoveAdd('add'); }
      else { throw 'Server returned false'; }
    })
    .catch(() => this.reactAlert.showAlert('Unable to add course', 'error'));
  }

  _toggleRemoveAdd(removeOrAdd) {
    let userAlreadySubscribed = !this.state.userAlreadySubscribed;
    this.setState({userAlreadySubscribed});
    removeOrAdd === 'remove' ? this.reactAlert.showAlert('Unsubscribed from course', 'info') : this.reactAlert.showAlert('Subscribed to course', 'info');
  }

  render() {
    return (
      <div className='course-row'>
        <Link to={`/courses/${this.props.course.id}`}>{this.props.course.short_display_name}</Link>
        <span> - </span>
        { this.state.userAlreadySubscribed ? <Link onClick={this._handleRemoval}>Remove from my courses</Link> : <Link onClick={this._handleAddition}>Add to my courses</Link> }
      </div>
    );
  }
}

export default CourseRow;
