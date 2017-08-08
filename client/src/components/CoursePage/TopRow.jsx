import React, {Component} from 'react';
import { Link } from 'react-router';
import NewDocForm from './NewDocForm.jsx';
import NewReqAssistForm from '../partials/NewReqAssistForm.jsx';
import NewItemForm from './NewItemForm.jsx';

class TopRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      showNewDocForm: false,
      showNewReqAssistForm: false,
      showNewItemForm: false,
      courseInfo: {
        id: this.props.courseId
      }
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._handleSubscribe = this._handleSubscribe.bind(this);
    this._handleUnsubscribe = this._handleUnsubscribe.bind(this);
    this._handleTutorStatus = this._handleTutorStatus.bind(this);
    this._toggleFormModal = this._toggleFormModal.bind(this);
    this._createBtnDiv = this._createBtnDiv.bind(this);
    this._renderCompAfterData = this._renderCompAfterData.bind(this);
  }

  componentDidMount() {
    document.title = 'Course Panel';
    this._loadComponentData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.courseId !== this.state.courseInfo.id) {
      this._loadComponentData(nextProps.courseId);
    }
  }

  _loadComponentData(courseId) {
    fetch(`/api/courses/${courseId || this.state.courseInfo.id}/toprow`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  _conditionData(resJSON) {
    if (resJSON) {
      document.title = `${resJSON.courseInfo.short_display_name} Panel`;
      this.setState({ courseInfo: resJSON.courseInfo, dataLoaded: true });
    } else {
      document.title = 'Course Panel - Error';
      throw 'Server returned false';
    }
  }

  _handleSubscribe() {
    fetch(`/api/users/currentuser/courses/${this.state.courseInfo.id}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ courseId: this.state.courseInfo.id })
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) {
        this.setState({
          courseInfo: {
            ...this.state.courseInfo,
            subscriptionStatus: true
          }
        });
      }
      else { throw 'Server returned false'; }
    })
    .catch(err => console.error('Unable to subscribe - ', err));
  }

  _handleUnsubscribe() {
    fetch(`/api/users/currentuser/courses/${this.state.courseInfo.id}`, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/string',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) {
        this.setState({
          courseInfo: {
            ...this.state.courseInfo,
            subscriptionStatus: false,
            tutorStatus: false,
            assistReqOpen: false
          }
        });
      }
      else { throw 'Server returned false'; }
    })
    .catch(err => console.error('Unable to unsubscribe - ', err));
  }

  _handleTutorStatus() {
    const tutorStatus = !this.state.courseInfo.tutorStatus;
    fetch(`/api/users/currentuser/courses/${this.state.courseInfo.id}/tutor`, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tutorStatus })
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) {
        this.setState({
          courseInfo: {
            ...this.state.courseInfo,
            tutorStatus
          }
        });
      }
      else { throw 'Server returned false'; }
    })
    .catch(err => console.error('Unable to update tutor status - ', err));
  }

  _toggleFormModal(stateName) {
    let newState = {};
    newState[stateName] = !this.state[stateName];
    this.setState(newState);
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

  _renderCompAfterData() {
    if (this.state.dataLoaded && this.state.pageError) {
      return (
        <p className='page-msg'>
          <i className='fa fa-exclamation-triangle' aria-hidden='true' />
          Error in loading up control bar
        </p>
      );
    } else if (this.state.dataLoaded) {
      return (
        <div className='top-row'>
          <NewDocForm
            courseId={this.state.courseInfo.id}
            reload={this.props.updateCompState}
            showModal={this.state.showNewDocForm}
            toggleModal={() => this._toggleFormModal('showNewDocForm')}
          />
          <NewReqAssistForm
            courseInfo={this.state.courseInfo}
            reload={this._loadComponentData}
            showModal={this.state.showNewReqAssistForm}
            toggleModal={() => this._toggleFormModal('showNewReqAssistForm')}
          />
          <NewItemForm
            courseId={this.state.courseInfo.id}
            reload={this.props.updateCompState}
            showModal={this.state.showNewItemForm}
            toggleModal={() => this._toggleFormModal('showNewItemForm')}
          />
          <h1 className='header'>
            <Link to={`/institutions/${this.state.courseInfo.inst_id}`}>{this.state.courseInfo.inst_display_name} </Link>
            > <span className='course-name'>{this.state.courseInfo.short_display_name} </span><span className='course-desc'>- {this.state.courseInfo.course_desc}</span>
          </h1>

          { this._createBtnDiv('fa fa-upload', <p>Upload<br/>Document</p>,
                              () => this._toggleFormModal('showNewDocForm'), 'inherit',
                              true, true) }

          <div className='top-row-star'>
            <Link to={`/courses/${this.state.courseInfo.id}/reviews`}>
              <div className='outer'>
                <i className='fa fa-star-o' aria-hidden='true' />
                <div className='inner' style={{ width: `${this.state.courseInfo.avgRating}%` }}>
                  <i className='fa fa-star' aria-hidden='true' />
                </div>
              </div>
            </Link>
            <p>Course<br/>Reviews</p>
          </div>

          { this._createBtnDiv('fa fa-check', <p>Unsubscribe<br/>From Course</p>,
                              this._handleUnsubscribe, 'green', this.state.courseInfo.subscriptionStatus,
                              true, <p>Subscribe<br/>To Course</p>, this._handleSubscribe) }

          { this._createBtnDiv('fa fa-bell', <p>Cancel / Update<br/>Request</p>,
                              () => this._toggleFormModal('showNewReqAssistForm'), 'green', this.state.courseInfo.assistReqOpen,
                              this.state.courseInfo.subscriptionStatus, <p>Request<br/>Assistance</p>,
                              () => this._toggleFormModal('showNewReqAssistForm')) }

          { this._createBtnDiv('fa fa-book', <p>Sell/Trade<br/>Items</p>,
                              () => this._toggleFormModal('showNewItemForm'), 'inherit',
                              true, true) }
        </div>
      );
    } else {
      return (
        <p className='page-msg'>
          <i className='fa fa-spinner fa-spin fa-3x fa-fw'></i>
          <span className='sr-only'>Loading...</span>
        </p>
      );
    }
  }

  render() {
    return this._renderCompAfterData();
  }
}

export default TopRow;
