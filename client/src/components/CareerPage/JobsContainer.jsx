import React, {Component} from 'react';
import JobRow from './JobRow.jsx';

class ResumesContainer extends Component {
  render() {
    return (
      <div className='jobs-container'>
        <h1 className='header'>Open positions:</h1>
        { this.props.jobs.map(job => <JobRow key={job.id} job={job} /> ) }
        { !this.props.jobs[0] && <p>No jobs matching your search.</p> }
      </div>
    );
  }
}

export default ResumesContainer;
