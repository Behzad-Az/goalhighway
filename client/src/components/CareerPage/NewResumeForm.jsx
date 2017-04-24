import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';

class NewResumeForm extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.state = {
      title: '',
      intent: '',
      file: ''
    };
    this._handleChange = this._handleChange.bind(this);
    this._handleFileChange = this._handleFileChange.bind(this);
    this._validateForm = this._validateForm.bind(this);
    this._handleNewResumePost = this._handleNewResumePost.bind(this);
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

  _validateForm() {
    return this.state.title &&
           this.state.file;
  }

  _handleNewResumePost() {
    let data = new FormData();
    data.append('file', this.state.file);
    data.append('title', this.state.title);
    data.append('intent', this.state.intent);

    fetch('/api/users/currentuser/resumes', {
      method: 'POST',
      credentials: 'same-origin',
      body: data
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) {
        this.reactAlert.showAlert('New resume uploaded', 'info');
        this.props.reload();
      }
      else { throw 'Server returned false'; }
    })
    .catch(() => this.reactAlert.showAlert('Unable to upload resume', 'error'))
    .then(this.props.toggleModal);
  }

  render() {
    return (
      <div className={this.props.showModal ? 'modal is-active' : 'modal'}>
        <div className='modal-background' onClick={this.props.toggleModal}></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>New Resume</p>
            <button className='delete' onClick={this.props.toggleModal}></button>
          </header>
          <section className='modal-card-body'>
            <label className='label'>Resume Title:</label>
            <p className='control'>
              <input className='input' type='text' name='title' placeholder='Enter resume title here' defaultValue={this.state.title} onChange={this._handleChange} />
            </p>
            <label className='label'>Upload new resume:</label>
            <p className='control'>
              <input className='upload' type='file' onChange={this._handleFileChange} />
            </p>
            <label className='label'>Resume Intent (Optional):</label>
            <p className='control'>
              <textarea className='textarea' name='intent' placeholder='Example: I intend to use this resume for junior level mechanical engineering jobs' onChange={this._handleChange} />
            </p>
          </section>
          <footer className='modal-card-foot'>
            <button className='button is-primary' disabled={!this._validateForm()} onClick={this._handleNewResumePost}>Submit</button>
            <button className='button' onClick={this.props.toggleModal}>Cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default NewResumeForm;
