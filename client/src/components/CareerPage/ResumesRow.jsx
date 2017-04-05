import React, {Component} from 'react';
import ResumeCard from './ResumeCard.jsx';

class ResumesRow extends Component {
  constructor(props) {
    super(props);
    this._populateRow = this._populateRow.bind(this);
  }

  _populateRow() {
    return this.props.resumes[0] ?
      this.props.resumes.map(doc => <DocCard key={doc.id} doc={doc} /> ) :
      <p>No related document uploaded yet...</p>
  }

  render() {
    return (
      <div className='row-container'>
        <h1 className='header'>
          { this.props.header }
          <i className='fa fa-angle-down' aria-hidden='true' />
        </h1>
        <div className='resumes-row'>
          {this._populateRow()}
        </div>
      </div>
    );
  }
}

export default ResumesRow;