import React, {Component} from 'react';
import { Link } from 'react-router';
import HandleModal from '../partials/HandleModal.js';

class TopRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subscriptionStatus: this.props.courseInfo.subscriptionStatus,
      tutorStatus: this.props.courseInfo.tutorStatus,
      assistReqOpen: this.props.courseInfo.assistReqOpen
    };
    this.handleUnsubscribe = this.handleUnsubscribe.bind(this);
    this.handleSubscribe = this.handleSubscribe.bind(this);
    this.handleTutorStatus = this.handleTutorStatus.bind(this);
    this.createBtnDiv = this.createBtnDiv.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      subscriptionStatus: nextProps.courseInfo.subscriptionStatus,
      tutorStatus: nextProps.courseInfo.tutorStatus,
      assistReqOpen: nextProps.courseInfo.assistReqOpen
    });
  }

  createBtnDiv(dfltClassName, truePhrase, trueCb, trueColor, validation, enable, falsePhrase, falseCb) {
    let className = enable ? dfltClassName : dfltClassName + ' disabled';
    if (validation) {
      return (
        <div className='top-row-button'>
          <i onClick={trueCb} className={className} aria-hidden='true' style={{ color: trueColor }} />
          {truePhrase}
        </div>
      );
    } else {
      return (
        <div className='top-row-button'>
          <i onClick={falseCb} className={className} aria-hidden='true' />
          {falsePhrase}
        </div>
      );
    }
  }

  handleUnsubscribe() {
    fetch(`/api/users/currentuser/courses/${this.props.courseInfo.id}`, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/string',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) { this.setState({ subscriptionStatus: false, tutorStatus: false, assistReqOpen: false }); }
      else { throw 'Server returned false'; }
    })
    .catch(err => console.error('Unable to unsubscribe - ', err));
  }

  handleSubscribe() {
    fetch(`/api/users/currentuser/courses/${this.props.courseInfo.id}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ courseId: this.props.courseInfo.id })
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) { this.setState({ subscriptionStatus: true }); }
      else { throw 'Server returned false'; }
    })
    .catch(err => console.error('Unable to subscribe - ', err));
  }

  handleTutorStatus() {
    let tutorStatus = !this.state.tutorStatus;
    fetch(`/api/users/currentuser/courses/${this.props.courseInfo.id}/tutor`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tutorStatus })
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) { this.setState({ tutorStatus }); }
      else { throw 'Server returned false'; }
    })
    .catch(err => console.error('Unable to update tutor status - ', err));
  }

  render() {
    return (
      <div className='top-row'>
        <h1 className='header'>
          <Link to={`/institutions/${this.props.courseInfo.inst_id}`}>{this.props.courseInfo.inst_display_name} </Link>
          > <span className='course-name'>{this.props.courseInfo.short_display_name} </span><span className='course-desc'>- {this.props.courseInfo.course_desc}</span>
          <button className='button'>Edit Course</button>
        </h1>
        <div className='row-container'>
          { this.createBtnDiv('fa fa-upload', <p>Upload<br/>Document</p>, () => HandleModal('new-doc-form'), 'inherit', true, true) }
          <div className='top-row-star'>
            <Link to={`/courses/${this.props.courseInfo.id}/reviews`}>
              <div className='outer'>
                <i className='fa fa-star-o' aria-hidden='true' />
                <div className='inner' style={{ width: `${this.props.courseInfo.avgRating}%` }}>
                  <i className='fa fa-star' aria-hidden='true' />
                </div>
              </div>
            </Link>
            <p>Course<br/>Reviews</p>
          </div>

          { this.createBtnDiv('fa fa-check', <p>Unsubscribe<br/>From Course</p>,
                              this.handleUnsubscribe, 'green', this.state.subscriptionStatus,
                              true, <p>Subscribe<br/>To Course</p>, this.handleSubscribe) }

          { this.createBtnDiv('fa fa-slideshare', <p>Click to<br/>Untutor</p>,
                              this.handleTutorStatus, 'green', this.state.tutorStatus,
                              this.state.subscriptionStatus, <p>Click to<br/>Tutor</p>, this.handleTutorStatus) }

          { this.createBtnDiv('fa fa-bell', <p>Cancel<br/>Request</p>,
                              () => HandleModal('new-request-assist-form'), 'green', this.state.assistReqOpen,
                              this.state.subscriptionStatus, <p>Request<br/>Assistance</p>, () => HandleModal('new-request-assist-form')) }

          { this.createBtnDiv('fa fa-book', <p>Sell/Trade<br/>Items</p>, () => HandleModal('new-item-form'), 'inherit', true, true) }

        </div>
      </div>
    );
  }
}

export default TopRow;
