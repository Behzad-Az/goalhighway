import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';
import HandleModal from '../partials/HandleModal.js';

class NewDocForm extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.state = {
      title: this.props.docInfo.title,
      type: this.props.docInfo.type,
      revDesc: '',
      filePath: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleNewDocPost = this.handleNewDocPost.bind(this);
  }

  handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  };

  validateForm() {
    return this.state.title &&
           this.state.revDesc &&
           this.state.type;
  }

  handleNewDocPost() {
    const successFcn = () => {
      this.reactAlert.showAlert("new revision uploaded", "info");
      this.props.reload();
    };
    let data = {
      title: this.state.title,
      type: this.state.type,
      revDesc: this.state.revDesc,
      filePath: this.state.filePath
    };
    $.ajax({
      method: 'POST',
      url: `/api/courses/${this.props.docInfo.course_id}/docs/${this.props.docInfo.id}`,
      data: this.state,
      success: response => {
        response ? successFcn() : this.reactAlert.showAlert("could not save revision", "error");
      }
    }).always(() => HandleModal('new-revision-form'));
  }

  render() {
    return (
      <div id="new-revision-form" className="modal">
        <div className="modal-background" onClick={() => HandleModal('new-revision-form')}></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">New Revision</p>
            <button className="delete" onClick={() => HandleModal('new-revision-form')}></button>
          </header>
          <section className="modal-card-body">
            <label className="label">Document Title (you may revise this):</label>
            <p className="control">
              <input className="input" type="text" name="title" placeholder="Enter document title here" defaultValue={this.state.title} onChange={this.handleChange} />
            </p>
            <label className="label">Upload the new revision (optional):</label>
            <p className="control">
              <input className="upload" type="file" name="filePath" onChange={this.handleChange} />
            </p>
            <label className="label">Revision Comment (mandatory):</label>
            <p className="control">
              <input className="input" type="text" name="revDesc" placeholder="Enter revision comment here" onChange={this.handleChange} />
            </p>
            <label className="label">Select Type of Document (you may revise this):</label>
            <p className="control">
              <span className="select">
                <select className="select" name="type" onChange={this.handleChange} defaultValue={this.state.type}>
                  <option value="">-</option>
                  <option value="asg_report">Assigntment / Report</option>
                  <option value="lecture_note">Lecture Note</option>
                  <option value="sample_question">Sample Question</option>
                </select>
              </span>
            </p>
          </section>
          <footer className="modal-card-foot">
            <button className="button is-primary" disabled={!this.validateForm()} onClick={this.handleNewDocPost}>Submit</button>
            <button className="button" onClick={() => HandleModal('new-revision-form')}>Cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default NewDocForm;
