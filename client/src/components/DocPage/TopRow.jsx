import React, {Component} from 'react';
import { Link } from 'react-router';
import NewReAssistForm from '../partials/NewReqAssistForm.jsx';
import NewRevisionForm from './NewRevisionForm.jsx';

class TopRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      showNewRevForm: false,
      showNewReqAssistForm: false,
      courseInfo: {
        id: this.props.courseId
      },
      docInfo: {
        id: this.props.docId
      }
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._handleSubscribe = this._handleSubscribe.bind(this);
    this._handleUnsubscribe = this._handleUnsubscribe.bind(this);
    this._handleTutorStatus = this._handleTutorStatus.bind(this);
    this._toggleFormModal = this._toggleFormModal.bind(this);
    this._createBtnDiv = this._createBtnDiv.bind(this);
    this._reloadPage = this._reloadPage.bind(this);
    this._renderCompAfterData = this._renderCompAfterData.bind(this);
  }

  componentDidMount() {
    document.title = 'GoalHwy - Document Page';
    this._loadComponentData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.courseId !== this.state.courseInfo.id || nextProps.docId !== this.state.docInfo.id) {
      this._loadComponentData(nextProps.courseId, nextProps.docId);
    }
  }

  _loadComponentData(courseId, docId) {
    fetch(`/api/courses/${courseId || this.state.courseInfo.id}/docs/${docId || this.state.docInfo.id}/toprow`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  _conditionData(resJSON) {
    if (resJSON) {
      document.title = `GoalHwy - ${resJSON.docInfo.title}`;
      this.setState({
        courseInfo: resJSON.courseInfo,
        docInfo: resJSON.docInfo,
        dataLoaded: true
      });
    } else {
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
    let tutorStatus = !this.state.courseInfo.tutorStatus;
    fetch(`/api/users/currentuser/courses/${this.state.courseInfo.id}/tutor`, {
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

  _reloadPage() {
    this._loadComponentData();
    this.props.updateCompState();
  }

  _renderCompAfterData() {
    if (this.state.dataLoaded && this.state.pageError) {
      return (
        <p className='page-msg'>
          <i className='fa fa-exclamation-triangle' aria-hidden='true' />
          Error in loading up the page
        </p>
      );
    } else if (this.state.dataLoaded) {
      return (
        <div className='top-row'>
          <NewRevisionForm
            docInfo={this.state.docInfo}
            reload={this._reloadPage}
            showModal={this.state.showNewRevForm}
            toggleModal={() => this._toggleFormModal('showNewRevForm')}
          />
          <NewReAssistForm
            courseInfo={this.state.courseInfo}
            reload={this._loadComponentData}
            showModal={this.state.showNewReqAssistForm}
            toggleModal={() => this._toggleFormModal('showNewReqAssistForm')}
          />
          <h1 className='header'>
            <Link to={`/institutions/${this.state.courseInfo.inst_id}`}>{this.state.courseInfo.inst_display_name} </Link>
            > <Link to={`/courses/${this.state.courseInfo.id}`}>{this.state.courseInfo.short_display_name} </Link>
            > <span>{this.state.docInfo.title}</span>
          </h1>

          { this._createBtnDiv('fa fa-upload', <p>New<br/>Revision</p>,
                              () => this._toggleFormModal('showNewRevForm'), 'inherit',
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

          { this._createBtnDiv('fa fa-slideshare', <p>Click to<br/>Untutor</p>,
                              this._handleTutorStatus, 'green', this.state.courseInfo.tutorStatus,
                              this.state.courseInfo.subscriptionStatus, <p>Click to<br/>Tutor</p>, this._handleTutorStatus) }

          { this._createBtnDiv('fa fa-bell', <p>Cancel<br/>Request</p>,
                              () => this._toggleFormModal('showNewReqAssistForm'), 'green', this.state.courseInfo.assistReqOpen,
                              this.state.courseInfo.subscriptionStatus, <p>Request<br/>Assistance</p>,
                              () => this._toggleFormModal('showNewReqAssistForm')) }

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
