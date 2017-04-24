import React, {Component} from 'react';
import { Link } from 'react-router';
import ReactAlert from '../partials/ReactAlert.jsx';
import NewResumeReviewForm from './NewResumeReviewForm.jsx';

const download = require('../../download.js');

class ResumeCard extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.images = ['pdf.png', 'docx.png', 'xlsx.png', 'zip.png', 'default.png'];
    this.state = {
      showNewResumeReviewForm: false,
      editCard: false,
      title: this.props.resume.title,
      intent: this.props.resume.intent,
      file: '',
      reviewReqStatus: this.props.resume.review_requested_at ? true : false
    };
    this._findImageLink = this._findImageLink.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._handleFileChange = this._handleFileChange.bind(this);
    this._toggleNewResumeReviewForm = this._toggleNewResumeReviewForm.bind(this);
    this._handleEdit = this._handleEdit.bind(this);
    this._handleDelete = this._handleDelete.bind(this);
    this._toggleView = this._toggleView.bind(this);
    this._editCardView = this._editCardView.bind(this);
    this._showCardView = this._showCardView.bind(this);
    this._handleDownload = this._handleDownload.bind(this);
    this._handleCancelReviewRequest = this._handleCancelReviewRequest.bind(this);
  }

  _findImageLink() {
    let fileName = this.props.resume.file_name;
    let directoryPath = '../../images/';
    let extension = fileName.substr(fileName.lastIndexOf('.') + 1) + '.png';
    return this.images.includes(extension) ? `${directoryPath}${extension}` : `${directoryPath}default.png`;
  }

  _handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  _handleFileChange(e) {
    const file = e.target.files[0];
    this.setState({ file });
  }

  _toggleNewResumeReviewForm() {
    this.setState({ showNewResumeReviewForm: !this.state.showNewResumeReviewForm });
  }

  _handleEdit() {
    let data = new FormData();
    if (this.state.file) { data.append('file', this.state.file); }
    data.append('title', this.state.title);
    data.append('intent', this.state.intent);

    fetch(`/api/users/currentuser/resumes/${this.props.resume.id}`, {
      method: 'POST',
      credentials: 'same-origin',
      body: data
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) {
        this.reactAlert.showAlert('Resume updated', 'info');
        this.props.reload();
      } else {
        throw 'Server returned false';
      }
    })
    .catch(() => this.reactAlert.showAlert('Unable to update resume', 'error'))
    .then(this._toggleView);
  }

  _handleDelete() {
    fetch(`/api/users/currentuser/resumes/${this.props.resume.id}`, {
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
        this.reactAlert.showAlert('Resume deleted', 'info');
        this.props.reload();
      }
      else { throw 'Server returned false'; }
    })
    .catch(() => this.reactAlert.showAlert('Unable to delete resume', 'error'));
  }

  _handleDownload() {
    fetch(`/api/users/currentuser/resumes/${this.props.resume.id}`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => {
      if (response.status === 200) { return response.blob(); }
      else { throw 'Server returned false.'; }
    })
    .then(blob => download(blob, `Resume_${this.props.resume.title}`))
    .catch(err => console.error('Unable to download file: - ', err));
  }

  _handleCancelReviewRequest() {
    fetch(`/api/feed/resumes/${this.props.resume.id}`, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/string',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) { this.setState({ reviewReqStatus: false }); }
      else { throw 'Server returned false'; }
    })
    .catch(() => this.reactAlert.showAlert('Unable to cancel review request', 'error'));
  }

  _toggleView() {
    this.setState({ editCard: !this.state.editCard });
  }

  _editCardView() {
    return (
      <div className='resume-index card'>
        <div className='card-content'>
          <label className='label'>Resume Title:</label>
          <p className='control'>
            <input className='input' type='text' name='title' placeholder='Enter resume title here' defaultValue={this.state.title} onChange={this._handleChange} />
          </p>
          <label className='label'>Resume Intent (Optional):</label>
          <p className='control'>
            <textarea className='textarea' name='intent' placeholder='Example: I intend to use this resume for junior level mechanical engineering jobs' defaultValue={this.state.intent} onChange={this._handleChange} />
          </p>
          <label className='label'>Upload new resume:</label>
          <p className='control'>
            <input className='upload' type='file' onChange={this._handleFileChange} />
          </p>
        </div>
        <footer className='card-footer'>
          <Link className='card-footer-item' onClick={this._handleEdit}>Save</Link>
          <Link className='card-footer-item' onClick={this._toggleView}>Cancel</Link>
          <Link className='card-footer-item' onClick={this._handleDelete}>Delete</Link>
        </footer>
      </div>
    );
  }

  _showCardView() {
    return (
      <div className='resume-index card'>
        <NewResumeReviewForm
          resume={this.props.resume}
          updateState={() => this.setState({ reviewReqStatus: true })}
          showModal={this.state.showNewResumeReviewForm}
          toggleModal={this._toggleNewResumeReviewForm}
        />
        <div className='card-content'>
          <div className='card-image'>
            <button className='button is-info' onClick={this._toggleView}>Edit</button>
            <figure className='image is-64x64' onClick={this._handleDownload}>
              <img src={this._findImageLink()} alt='picture' />
            </figure>
          </div>
          <div className='card-text'>
            <p className='name title is-6'>{this.props.resume.title}</p>
            <p className='description title is-6'>'{this.props.resume.intent}'</p>
            <p className='date title is-6'>Upload Date: {this.props.resume.created_at.slice(0, 10)}</p>
          </div>
          <p className='card-foot title is-6'>
            { this.state.reviewReqStatus ?
                <Link onClick={this._handleCancelReviewRequest}>Cancel Review Request</Link> :
                <Link onClick={this._toggleNewResumeReviewForm}>Request Review</Link>
            }
          </p>
        </div>
      </div>
    );
  }

  render() {
    return this.state.editCard ? this._editCardView() : this._showCardView();
  }
}

export default ResumeCard;
