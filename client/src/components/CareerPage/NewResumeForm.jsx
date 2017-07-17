import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';
import InvalidCharChecker from '../partials/InvalidCharChecker.jsx';

class NewResumeForm extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.formLimits = {
      title: { min: 3, max: 60 },
      intent: { min: 3, max: 250 }
    };
    this.state = {
      title: '',
      intent: 'Generic resume - no specific intent.',
      file: '',
      editCardErro: ''
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
    return this.state.title.length >= this.formLimits.title.min &&
           !InvalidCharChecker(this.state.title, this.formLimits.title.max, 'resumeTitle') &&
           this.state.intent.length >= this.formLimits.intent.min &&
           !InvalidCharChecker(this.state.intent, this.formLimits.intent.max, 'resumeIntent') &&
           this.state.file;
  }

  _handleNewResumePost() {
    let data = new FormData();
    data.set('file', this.state.file);
    data.set('title', this.state.title);
    data.set('intent', this.state.intent);

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
            <label className='label'>
              Resume Title:
              { InvalidCharChecker(this.state.title, this.formLimits.title.max, 'resumeTitle') && <span className='char-limit'>Invalid</span> }
            </label>
            <p className='control'>
              <input
                className='input'
                type='text'
                name='title'
                placeholder='Enter resume title here'
                onChange={this._handleChange}
                style={{ borderColor: InvalidCharChecker(this.state.title, this.formLimits.title.max, 'resumeTitle') ? '#9D0600' : '' }} />
            </p>
            <label className='label'>Upload new resume:</label>
            <p className='control'>
              <input
                className='upload'
                type='file'
                accept='
                  image/png,
                  image/jpeg,
                  image/pjpeg,
                  application/pdf,
                  application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                  application/vnd.ms-word.document.macroEnabled.12,
                  application/msword'
                onChange={this._handleFileChange} />
            </p>
            <label className='label'>
              Resume Intent:
              { InvalidCharChecker(this.state.intent, this.formLimits.intent.max, 'resumeIntent') && <span className='char-limit'>Invalid</span> }
            </label>
            <p className='control'>
              <textarea
                className='textarea'
                name='intent'
                placeholder='Example: I intend to use this resume for junior level mechanical engineering jobs'
                defaultValue={this.state.intent}
                onChange={this._handleChange}
                style={{ borderColor: InvalidCharChecker(this.state.intent, this.formLimits.intent.max, 'resumeIntent') ? '#9D0600' : '' }} />
            </p>
          </section>
          <footer className='modal-card-foot'>
            <button className='button is-primary' onClick={this._handleNewResumePost}>Submit</button>
            <button className='button' onClick={this.props.toggleModal}>Cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default NewResumeForm;
