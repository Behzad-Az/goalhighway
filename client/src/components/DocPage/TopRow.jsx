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
    nextProps.courseInfo.subscriptionStatus !== this.state.subscriptionStatus ? this.setState({ subscriptionStatus: nextProps.courseInfo.subscriptionStatus }) : '';
    nextProps.courseInfo.tutorStatus !== this.state.tutorStatus ? this.setState({ tutorStatus: nextProps.courseInfo.tutorStatus }) : '';
    nextProps.courseInfo.assistReqOpen !== this.state.assistReqOpen ? this.setState({ assistReqOpen: nextProps.courseInfo.assistReqOpen }) : '';
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
    $.ajax({
      method: 'DELETE',
      url: `/api/users/currentuser/courses/${this.props.courseInfo.id}`,
      success: response => {
        response ? this.setState({ subscriptionStatus: false, tutorStatus: false, assistReqOpen: false }) : console.error('Error in server - 0: ', response);
      }
    });
  }

  handleSubscribe() {
    $.ajax({
      method: 'POST',
      url: `/api/users/currentuser/courses/${this.props.courseInfo.id}`,
      data: { courseId: this.props.courseInfo.id },
      success: response => {
        response ? this.setState({ subscriptionStatus: true }) : console.error('Error in server - 0: ', response);
      }
    });
  }

  handleTutorStatus() {
    let tutorStatus = !this.state.tutorStatus;
    $.ajax({
      method: 'POST',
      url: `/api/users/currentuser/courses/${this.props.courseInfo.id}/tutor`,
      data: { tutorStatus },
      success: response => {
        response ? this.setState({ tutorStatus }) : console.error('Error in server - 0: ', response);
      }
    });
  }

  render() {
    return (
      <div className='top-row'>
        <h1 className='header'>
          <Link to={`/institutions/${this.props.courseInfo.inst_id}`}>{this.props.courseInfo.inst_display_name} </Link>
          > <Link to={`/courses/${this.props.courseInfo.id}`}>{this.props.courseInfo.short_display_name} </Link>
          > <span>{this.props.docInfo.title}</span>
          <button className='button'>Edit Course</button>
        </h1>
        <div className='row-container'>
          { this.createBtnDiv('fa fa-upload', <p>New<br/>Revision</p>, () => HandleModal('new-revision-form'), 'inherit', true, true) }

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

        </div>
      </div>
    );
  }
}

export default TopRow;
