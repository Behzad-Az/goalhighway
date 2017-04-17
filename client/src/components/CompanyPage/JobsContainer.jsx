import React, {Component} from 'react';
import JobRow from './JobRow.jsx';

class JobsContainer extends Component {
  render() {
    return (
      <div className='jobs-container'>
        <h1 className='header'>
          Open Positions:
          <i className='fa fa-angle-down' aria-hidden='true' />
        </h1>
        { this.props.jobs.map(job => <JobRow key={job.id} job={job} /> ) }
        { !this.props.jobs[0] && <p>No open position for this company.</p> }
      </div>
    );
  }
}

export default JobsContainer;
