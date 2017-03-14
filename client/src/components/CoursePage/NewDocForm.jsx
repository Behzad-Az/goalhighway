import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';
import HandleModal from '../partials/HandleModal.js';

class NewDocForm extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.state = {
      title: '',
      type: '',
      revDesc: 'New Upload',
      filePath: '',
      file: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleNewDocPost = this.handleNewDocPost.bind(this);
  }

  handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  handleFileChange(e) {
    const file = e.target.files[0];
    this.setState({ file });
  }

  validateForm() {
    // return this.state.title &&
    //        this.state.revDesc &&
    //        this.state.file &&
    //        this.state.type;
    return true;
  }

  handleNewDocPost() {
    // let data = {
    //   title: this.state.title,
    //   type: this.state.type,
    //   revDesc: this.state.revDesc,
    //   filePath: 'test.balls',
    //   file: this.state.file
    // };

    let data = new FormData();
    data.append('file', this.state.file);
    data.append('title', this.state.title);
    data.append('type', this.state.type);
    data.append('revDesc', this.state.revDesc);
    data.append('filePath', 'default file path');

    fetch(`/api/courses/${this.props.courseId}/docs`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        // 'Content-Type': 'application/json'
      },
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
    .then(() => HandleModal('new-doc-form'));
  }

  render() {
    return (
      <div id='new-doc-form' className='modal'>
        <div className='modal-background' onClick={() => HandleModal('new-doc-form')}></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>New Document</p>
            <button className='delete' onClick={() => HandleModal('new-doc-form')}></button>
          </header>
          <section className='modal-card-body'>
            <label className='label'>Document Title:</label>
            <p className='control'>
              <input className='input' type='text' name='title' placeholder='Enter document title here' onChange={this.handleChange} />
            </p>
            <label className='label'>Upload the Document:</label>


            <p className='control'>
              <input className='upload'
                type='file'
                placeholder='select file'
                onChange={this.handleFileChange} />
            </p>


            <label className='label'>Revision Comment:</label>
            <p className='control'>
              <input className='input' type='text' name='revDesc' placeholder='Enter revision comment here' defaultValue={this.state.revDesc} onChange={this.handleChange} />
            </p>
            <label className='label'>Select Type of Document:</label>
            <p className='control'>
              <span className='select'>
                <select className='select' name='type' onChange={this.handleChange}>
                  <option value=''>-</option>
                  <option value='asg_report'>Assigntment / Report</option>
                  <option value='lecture_note'>Lecture Note</option>
                  <option value='sample_question'>Sample Question</option>
                </select>
              </span>
            </p>
          </section>
          <footer className='modal-card-foot'>
            <button className='button is-primary' disabled={!this.validateForm()} onClick={this.handleNewDocPost}>Submit</button>
            <button className='button' onClick={() => HandleModal('new-doc-form')}>Cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default NewDocForm;
