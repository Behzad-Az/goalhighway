import React, {Component} from 'react';
import ResumeCard from './ResumeCard.jsx';
import NewResumeForm from './NewResumeForm.jsx';
import HandleModal from '../partials/HandleModal.js';

class ResumesRow extends Component {
  constructor(props) {
    super(props);
    this._populateRow = this._populateRow.bind(this);
  }

  _populateRow() {
    return this.props.resumes[0] ?
      this.props.resumes.map(resume => <ResumeCard key={resume.id} resume={resume} reload={this.props.reload} /> ) :
      <p>No resumes uploaded yet.</p>
  }

  render() {
    return (
      <div className='row-container'>
        <NewResumeForm reload={this.props.reload} />
        <h1 className='header'>
          My Resumes:
          <button className='button' onClick={() => HandleModal('new-resume-form')}>New Resume</button>
        </h1>
        <div className='resumes-row'>
          { this._populateRow() }
        </div>
      </div>
    );
  }
}

export default ResumesRow;
