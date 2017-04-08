import React, {Component} from 'react';
import QaRow from './QaRow.jsx';

class JobsContainer extends Component {
  render() {
    return (
      <div className='qa-container'>
        <h1 className='header'>
          Interview Questions / Answers:
          <i className='fa fa-angle-down' aria-hidden='true' />
        </h1>
        { this.props.qas.map(qa => <QaRow key={qa.id} qa={qa} reload={this.props.reload} companyId={this.props.companyId} />) }
        { !this.props.qas[0] && <p>No interview question posted for this company yet.</p> }
      </div>
    );
  }
}

export default JobsContainer;
