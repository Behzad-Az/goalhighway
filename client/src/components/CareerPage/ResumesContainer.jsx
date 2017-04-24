import React, {Component} from 'react';
import ResumeCard from './ResumeCard.jsx';
import NewResumeForm from './NewResumeForm.jsx';

class ResumesContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNewResumeForm: false
    };
    this._toggleNewResumeForm = this._toggleNewResumeForm.bind(this);
  }

  _toggleNewResumeForm() {
    this.setState({ showNewResumeForm: !this.state.showNewResumeForm });
  }

  render() {
    return (
      <div className='resumes-container'>
        <NewResumeForm reload={this.props.reload} showModal={this.state.showNewResumeForm} toggleModal={this._toggleNewResumeForm} />
        <h1 className='header'>
          My Resumes:
          <button className='button' onClick={this._toggleNewResumeForm}>New Resume</button>
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
