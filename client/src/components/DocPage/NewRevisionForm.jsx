import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';
import InvalidCharChecker from '../partials/InvalidCharChecker.jsx';

class NewRevisionForm extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.formLimits = {
      title: { min: 3, max: 60 },
      revDesc: { min: 3, max: 250 }
    };
    this.state = {
      title: this.props.docInfo.title,
      type: this.props.docInfo.type,
      revDesc: '',
      file: ''
    };
    this._handleChange = this._handleChange.bind(this);
    this._handleFileChange = this._handleFileChange.bind(this);
    this._validateForm = this._validateForm.bind(this);
    this._handleNewDocPost = this._handleNewDocPost.bind(this);
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
           !InvalidCharChecker(this.state.title, this.formLimits.title.max, 'revTitle') &&
           this.state.revDesc.length >= this.formLimits.revDesc.min &&
           !InvalidCharChecker(this.state.revDesc, this.formLimits.revDesc.max, 'revDesc') &&
           this.state.type &&
           this.props.docInfo.course_id &&
           this.props.docInfo.id;
  }

  _handleNewDocPost() {
    let data = new FormData();
    data.set('file', this.state.file);
    data.set('title', this.state.title);
    data.set('type', this.state.type);
    data.set('revDesc', this.state.revDesc);

    fetch(`/api/courses/${this.props.docInfo.course_id}/docs/${this.props.docInfo.id}`, {
      method: 'POST',
      credentials: 'same-origin',
      body: data
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) {
        this.reactAlert.showAlert('New revision uploaded', 'info');
        this.props.reload();
      }
      else { throw 'Server returned false'; }
    })
    .catch(() => this.reactAlert.showAlert('Unable to post revision', 'error'))
    .then(() => this.props.toggleModal('showNewRevForm'));
  }

  render() {
    return (
      <div className={this.props.showModal ? 'modal is-active' : 'modal'}>
        <div className='modal-background' onClick={() => this.props.toggleModal('showNewRevForm')}></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>New Revision</p>
            <button className='delete' onClick={() => this.props.toggleModal('showNewRevForm')}></button>
          </header>
          <section className='modal-card-body'>
            <label className='label'>
              Document Title (you may revise this):
              { InvalidCharChecker(this.state.title, this.formLimits.title.max, 'revTitle') && <span className='char-limit'>Invalid</span> }
            </label>
            <p className='control'>
              <input
                className='input'
                type='text'
                name='title'
                placeholder='Enter document title here'
                defaultValue={this.state.title}
                onChange={this._handleChange}
                style={{ borderColor: InvalidCharChecker(this.state.title, this.formLimits.title.max, 'revTitle') ? '#9D0600' : '' }} />
            </p>
            <label className='label'>Upload the new revision (optional):</label>
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
              Revision Comment (mandatory):
              { InvalidCharChecker(this.state.revDesc, this.formLimits.revDesc.max, 'revTitle') && <span className='char-limit'>Invalid</span> }
            </label>
            <p className='control'>
              <textarea
                className='textarea'
                name='revDesc'
                placeholder='Enter revision comment here'
                onChange={this._handleChange}
                style={{ borderColor: InvalidCharChecker(this.state.revDesc, this.formLimits.revDesc.max, 'revTitle') ? '#9D0600' : '' }} />
            </p>
            <label className='label'>Select Type of Document (you may revise this):</label>
            <p className='control'>
              <span className='select'>
                <select className='select' name='type' onChange={this._handleChange} defaultValue={this.state.type}>
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
            <button className='button' onClick={() => this.props.toggleModal('showNewRevForm')}>Cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default NewRevisionForm;
