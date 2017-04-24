import React, {Component} from 'react';
import { Link } from 'react-router';
import NewDocForm from './NewDocForm.jsx';
import NewReAssistForm from '../partials/NewReqAssistForm.jsx';
import NewItemForm from './NewItemForm.jsx';

class TopRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNewDocForm: false,
      showNewReqAssistForm: false,
      showNewItemForm: false,
      subscriptionStatus: this.props.courseInfo.subscriptionStatus,
      tutorStatus: this.props.courseInfo.tutorStatus,
      assistReqOpen: this.props.courseInfo.assistReqOpen
    };
    this._handleUnsubscribe = this._handleUnsubscribe.bind(this);
    this._handleSubscribe = this._handleSubscribe.bind(this);
    this._handleTutorStatus = this._handleTutorStatus.bind(this);
    this._toggleFormModal = this._toggleFormModal.bind(this);
    this._createBtnDiv = this._createBtnDiv.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      subscriptionStatus: nextProps.courseInfo.subscriptionStatus,
      tutorStatus: nextProps.courseInfo.tutorStatus,
      assistReqOpen: nextProps.courseInfo.assistReqOpen
    });
  }

  _createBtnDiv(dfltClassName, truePhrase, trueCb, trueColor, validation, enable, falsePhrase, falseCb) {
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

  _toggleFormModal(stateName) {
    let newState = {};
    newState[stateName] = !this.state[stateName];
    this.setState(newState);
  }

  _handleUnsubscribe() {
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

  _handleSubscribe() {
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

  _handleTutorStatus() {
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
        <NewDocForm
          courseId={this.props.courseInfo.id}
          reload={this.props.reload}
          showModal={this.state.showNewDocForm}
          toggleModal={() => this._toggleFormModal('showNewDocForm')}
        />
        <NewReAssistForm
          courseInfo={this.props.courseInfo}
          reload={this.props.reload}
          showModal={this.state.showNewReqAssistForm}
          toggleModal={() => this._toggleFormModal('showNewReqAssistForm')}
        />
        <NewItemForm
          courseId={this.props.courseInfo.id}
          reload={this.props.reload}
          showModal={this.state.showNewItemForm}
          toggleModal={() => this._toggleFormModal('showNewItemForm')}
        />
        <h1 className='header'>
          <Link to={`/institutions/${this.props.courseInfo.inst_id}`}>{this.props.courseInfo.inst_display_name} </Link>
          > <span className='course-name'>{this.props.courseInfo.short_display_name} </span><span className='course-desc'>- {this.props.courseInfo.course_desc}</span>
        </h1>

        { this._createBtnDiv('fa fa-upload', <p>Upload<br/>Document</p>,
                            () => this._toggleFormModal('showNewDocForm'), 'inherit',
                            true, true) }

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

        { this._createBtnDiv('fa fa-check', <p>Unsubscribe<br/>From Course</p>,
                            this._handleUnsubscribe, 'green', this.state.subscriptionStatus,
                            true, <p>Subscribe<br/>To Course</p>, this._handleSubscribe) }

        { this._createBtnDiv('fa fa-slideshare', <p>Click to<br/>Untutor</p>,
                            this._handleTutorStatus, 'green', this.state.tutorStatus,
                            this.state.subscriptionStatus, <p>Click to<br/>Tutor</p>, this._handleTutorStatus) }

        { this._createBtnDiv('fa fa-bell', <p>Cancel<br/>Request</p>,
                            () => this._toggleFormModal('showNewReqAssistForm'), 'green', this.state.assistReqOpen,
                            this.state.subscriptionStatus, <p>Request<br/>Assistance</p>,
                            () => this._toggleFormModal('showNewReqAssistForm')) }

        { this._createBtnDiv('fa fa-book', <p>Sell/Trade<br/>Items</p>,
                            () => this._toggleFormModal('showNewItemForm'), 'inherit',
                            true, true) }

      </div>
    );
  }
}

export default TopRow;
