import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';

class NewDocForm extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.formLimits = {
      title: 60,
      revDesc: 250
    };
    this.state = {
      title: '',
      type: '',
      revDesc: 'New Upload',
      file: ''
    };
    this._handleChange = this._handleChange.bind(this);
    this._handleFileChange = this._handleFileChange.bind(this);
    this._validateForm = this._validateForm.bind(this);
    this._handleNewDocPost = this._handleNewDocPost.bind(this);
  }

  _handleChange(e) {
    let stateObj = {};
    stateObj[e.target.name] = e.target.value;
    this.setState(stateObj);
  }

  _handleFileChange(e) {
    const file = e.target.files[0];
    this.setState({ file });
  }

  _validateForm() {
    return this.state.title &&
           this.state.title.length <= this.formLimits.title &&
           this.state.revDesc &&
           this.state.revDesc.length <= this.formLimits.revDesc &&
           this.state.type &&
           this.state.file;
  }

  _handleNewDocPost() {
    let data = new FormData();
    data.append('file', this.state.file);
    data.append('title', this.state.title);
    data.append('type', this.state.type);
    data.append('revDesc', this.state.revDesc);

    fetch(`/api/courses/${this.props.courseId}/docs`, {
      method: 'POST',
      credentials: 'same-origin',
      body: data
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) {
        this.reactAlert.showAlert('New document saved', 'info');
        this.props.reload();
      } else {
        throw 'Server returned false';
      }
    })
    .catch(() => this.reactAlert.showAlert('Unable to upload document', 'error'))
    .then(this.props.toggleModal);
  }

  render() {
    return (
      <div className={this.props.showModal ? 'modal is-active' : 'modal'}>
        <div className='modal-background' onClick={this.props.toggleModal}></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>New Document</p>
            <button className='delete' onClick={this.props.toggleModal}></button>
          </header>
          <section className='modal-card-body'>
            <label className='label'>
              Document Title:
              { this.state.title.length > this.formLimits.title && <span className='char-limit'>too long!</span> }
            </label>
            <p className='control'>
              <input
                className='input'
                type='text'
                name='title'
                placeholder='Enter document title here'
                onChange={this._handleChange}
                style={{ borderColor: this.state.title.length > this.formLimits.title ? '#9D0600' : '' }} />
            </p>
            <label className='label'>Upload the Document:</label>
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
                  application/msword,
                  application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                  application/vnd.ms-excel.sheet.macroEnabled.12,
                  application/vnd.ms-excel,
                  application/vnd.openxmlformats-officedocument.presentationml.presentation,
                  application/vnd.ms-powerpoint.presentation.macroEnabled.12,
                  application/vnd.ms-powerpoint,
                  application/x-compressed,
                  application/x-zip-compressed,
                  application/zip,
                  multipart/x-zip,
                  application/x-gzip,
                  multipart/x-gzip'
                onChange={this._handleFileChange} />
            </p>
            <label className='label'>
              Revision Comment:
              { this.state.revDesc.length > this.formLimits.revDesc && <span className='char-limit'>too long!</span> }
            </label>
            <p className='control'>
              <textarea
                className='textarea'
                name='revDesc'
                placeholder='Enter revision comment here'
                defaultValue={this.state.revDesc}
                onChange={this._handleChange}
                style={{ borderColor: this.state.revDesc.length > this.formLimits.revDesc ? '#9D0600' : '' }} />
            </p>
            <label className='label'>Select Type of Document:</label>
            <p className='control'>
              <span className='select'>
                <select className='select' name='type' onChange={this._handleChange}>
                  <option value=''>-</option>
                  <option value='asg_report'>Assigntment / Report</option>
                  <option value='lecture_note'>Lecture Note</option>
                  <option value='sample_question'>Sample Question</option>
                </select>
              </span>
            </p>
          </section>
          <footer className='modal-card-foot'>
            <button className='button is-primary' disabled={!this._validateForm()} onClick={this._handleNewDocPost}>Submit</button>
            <button className='button' onClick={this.props.toggleModal}>Cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default NewDocForm;
