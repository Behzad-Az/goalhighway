import React, {Component} from 'react';
import ResumeCard from './ResumeCard.jsx';
import NewResumeForm from './NewResumeForm.jsx';
import HandleModal from '../partials/HandleModal.js';

class ResumesContainer extends Component {
  render() {
    return (
      <div className='resumes-container'>
        <NewResumeForm reload={this.props.reload} />
        <h1 className='header'>
          My Resumes:
          <button className='button' onClick={() => HandleModal('new-resume-form')}>New Resume</button>
        </h1>
        <div className='resumes-row'>
          { this.props.resumes.map(resume => <ResumeCard key={resume.id} resume={resume} reload={this.props.reload} /> ) }
          { !this.props.resumes[0] && <p>No resumes uploaded yet.</p> }
        </div>
      </div>
    );
  }
}

export default ResumesContainer;
