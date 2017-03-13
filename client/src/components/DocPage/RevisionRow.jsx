import React, {Component} from 'react';
import { browserHistory } from 'react-router';

class RevisionRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flagRequest: false,
      flagReason: ''
    };
    this.handleRevisionRequest = this.handleRevisionRequest.bind(this);
    this.handleDeletionRequest = this.handleDeletionRequest.bind(this);
    this.handleFlagClick = this.handleFlagClick.bind(this);
    this.handleFlagSubmit = this.handleFlagSubmit.bind(this);
    this.renderFlagSelect = this.renderFlagSelect.bind(this);
  }

  handleRevisionRequest() {
    fetch(`/api/courses/${this.props.docInfo.course_id}/docs/${this.props.docInfo.id}/revisions/${this.props.rev.id}`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => resJSON[0] ? console.log('printing revision resJSON 0: ', resJSON) : console.error('Error while fetching file: Server returned false'))
    .catch(err => console.error('Error while fetching file: ', err));
  }

  handleDeletionRequest() {
    fetch(`/api/courses/${this.props.docInfo.course_id}/docs/${this.props.docInfo.id}/revisions/${this.props.rev.id}`, {
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
        resJSON.url === this.props.currentUrl ? this.props.reload(this.props.docInfo.course_id, this.props.docInfo.id) : browserHistory.push(resJSON.url);
      } else {
        throw 'Server returned false';
      }
    })
    .catch(err => console.error('Unable to delete revision - ', err));
  }

  handleFlagClick() {
    let flagRequest = !this.state.flagRequest;
    this.setState({ flagRequest });
  }

  handleFlagSubmit(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    fetch(`/api/flags/revisions/${this.props.rev.id}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(state)
    })
    .then(response => response.json())
    .then(resJSON => { if (!resJSON) throw 'Server returned false' })
    .catch(err => console.error('Unable to post flag - ', err))
    .then(() => this.setState(state));
  }

  renderFlagSelect() {
    return (
      <p className='control flag-submission'>
        <span className='select is-small'>
          <select name='flagReason' onChange={this.handleFlagSubmit}>
            <option value=''>select reason</option>
            <option value='inappropriate content'>Inappropriate content</option>
            <option value='does not belong to this course'>Doesn't belong to this course</option>
            <option value='corrupted file or unreadable'>Corrupted file / unreadable</option>
            <option value='other'>Other</option>
          </select>
        </span>
      </p>
    );
  }

  render() {
    return (
      <div className='revision-row columns'>
        <div className='column is-3'>Date:<br/>{this.props.rev.rev_created_at.slice(0, 10)}</div>
        <div className='column is-6'>Description:<br/>{this.props.rev.rev_desc}</div>
        <div className='column is-3 buttons'>
          <figure className='image is-48x48'>
            <img src='../../../../../public/images/pdf.png' alt='' onClick={this.handleRevisionRequest} />
          </figure>
          {this.props.rev.deleteable && <i onClick={this.handleDeletionRequest} className='fa fa-trash' aria-hidden='true' />}
          <i className='fa fa-flag' aria-hidden='true' onClick={this.handleFlagClick} style={{ color: this.state.flagRequest ? '#9D0600' : 'inherit' }} />
          {this.state.flagRequest && this.renderFlagSelect()}
        </div>
      </div>
    );
  }
}

export default RevisionRow;
