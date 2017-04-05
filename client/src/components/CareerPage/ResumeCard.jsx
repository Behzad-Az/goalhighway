import React, {Component} from 'react';
import { Link } from 'react-router';
import ReactAlert from '../partials/ReactAlert.jsx';

class ResumeCard extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.state = {
      editCard: false,
      title: this.props.resume.title,
      intent: this.props.resume.intent,
      photoPath: '',
      deleted: false
    };
    this._handleChange = this._handleChange.bind(this);
    this._handleEdit = this._handleEdit.bind(this);
    this._handleDelete = this._handleDelete.bind(this);
    this._toggleView = this._toggleView.bind(this);
    this._editCardView = this._editCardView.bind(this);
    this._showCardView = this._showCardView.bind(this);
  }

  _handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  _handleEdit() {
    let data = {
      photoPath: this.state.photoPath,
      intent: this.state.intent,
      title: this.state.title,
      deleted: this.state.deleted
    };

    fetch(`/api/users/currentuser/resumes/${this.props.resume.id}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) {
        let msg = this.state.deleted ? 'Resume deleted' : 'Resume updated';
        this.reactAlert.showAlert(msg, 'info');
        this.props.reload();
      } else {
        throw 'Server returned false';
      }
    })
    .catch(() => this.reactAlert.showAlert('Unable to update resume', 'error'))
    .then(this._toggleView);
  }

  _handleDelete() {
    this.state.deleted = true;
    this._handleEdit();
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
            <input className='upload' type='file' onChange={this._handleChange} />
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
        <div className='card-content'>
          <div className='card-image'>
            <button className='button is-info' onClick={this._toggleView}>Edit</button>
            <figure className='image is-96x96'>
              <img src='../../images/camera-logo.png' alt='picture' />
            </figure>
          </div>
          <div className='card-text'>
            <p className='name title is-6'>{this.props.resume.title}</p>
            <p className='description title is-6'>'{this.props.resume.intent}'</p>
            <p className='date title is-6'>Upload Date: {this.props.resume.resume_created_at.slice(0, 10)}</p>
          </div>
          <p className='card-foot title is-6'>
            <span className='text-link'>
              <Link>Request Review</Link>
            </span>
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
