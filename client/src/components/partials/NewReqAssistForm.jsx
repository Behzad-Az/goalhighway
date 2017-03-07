import React, {Component} from 'react';
import ReactAlert from './ReactAlert.jsx';
import HandleModal from './HandleModal.js';

class NewReqAssistForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      issue_desc: this.props.courseInfo.latestAssistRequest,
      assistReqOpen: this.props.courseInfo.assistReqOpen,
      closureReason: ''
    };
    this.reactAlert = new ReactAlert();
    this.handleChange = this.handleChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.formFooterOptions = this.formFooterOptions.bind(this);
    this.updateParentState = this.updateParentState.bind(this);
    this.handleUpdateRequestAssist = this.handleUpdateRequestAssist.bind(this);
    this.handleNewRequestAssist = this.handleNewRequestAssist.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    nextProps.courseInfo.latestAssistRequest !== this.state.issue_desc ? this.setState({ issue_desc: nextProps.courseInfo.latestAssistRequest }) : '';
    nextProps.courseInfo.assistReqOpen !== this.state.assistReqOpen ? this.setState({ assistReqOpen: nextProps.courseInfo.assistReqOpen }) : '';
  }

  handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  };

  validateForm() {
    return this.state.issue_desc &&
           this.state.issue_desc.length <= 400
  }

  formFooterOptions() {
    if (this.state.assistReqOpen) {
      return (
        <footer className="modal-card-foot">
          <p className="control">
            <button className="button is-primary" disabled={!this.validateForm()} onClick={() => this.handleUpdateRequestAssist('update')}>Update</button>
            <span className="select">
              <select name="closureReason" onChange={this.handleChange}>
                <option value="">-</option>
                <option value="Resolved on my own">Resolved on my own</option>
                <option value="Resolved with tutor">Resolved with tutor</option>
                <option value="No longer needed">No longer needed</option>
                <option value="Other">Other</option>
              </select>
            </span>
            <button className="button" onClick={() => this.handleUpdateRequestAssist('close')} disabled={!this.state.closureReason}>Close Request</button>
          </p>
        </footer>
      );
    } else {
      return (
        <footer className="modal-card-foot">
          <button className="button is-primary" disabled={!this.validateForm()} onClick={this.handleNewRequestAssist}>Submit</button>
          <button className="button" onClick={() => HandleModal('new-request-assist-form')}>Cancel</button>
        </footer>
      );
    }
  }

  updateParentState(action) {
    let courseInfo = {
      ...this.props.courseInfo,
      subscriptionStatus: true,
      assistReqOpen: action === 'close' ? false : true,
      latestAssistRequest: this.state.issue_desc
    };
    this.props.updateParentState({ courseInfo });
    HandleModal('new-request-assist-form');
  };

  handleUpdateRequestAssist(action) {
    let data = {
      action: action,
      issue_desc: this.state.issue_desc,
      closure_reason: this.state.closureReason
    };

    $.ajax({
      method: 'POST',
      url: `/api/users/currentuser/courses/${this.props.courseInfo.id}/tutorlog/update`,
      data: data,
      success: response => {
        response ? this.updateParentState(action) : console.error("Error in serve 0: ", response);
        this.setState({ closureReason: '' });
      }
    });
  }

  handleNewRequestAssist() {
    $.ajax({
      method: 'POST',
      url: `/api/users/currentuser/courses/${this.props.courseInfo.id}/tutorlog`,
      data: this.state,
      success: response => {
        response ? this.updateParentState('new') : console.error("Error in server - 0: ", response);
      }
    });
  }

  render() {
    return (
      <div id="new-request-assist-form" className="modal">
        <div className="modal-background" onClick={() => HandleModal('new-request-assist-form')}></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Request Assistance</p>
            <button className="delete" onClick={() => HandleModal('new-request-assist-form')}></button>
          </header>
          <section className="modal-card-body">
            <p className="control">
              <textarea className="textarea" name="issue_desc" placeholder="How may one of our tutors assist you?" value={this.state.issue_desc} onChange={this.handleChange} />
            </p>
          </section>
          { this.formFooterOptions() }
        </div>
      </div>
    );
  }
}

export default NewReqAssistForm;
