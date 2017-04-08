import React, {Component} from 'react';
import RevisionRow from './RevisionRow.jsx';

class RevisionsContainer extends Component {
  render() {
    return (
      <div className='revisions-container'>
        <h1 className='header'>
          Document Revisions:
          <i className='fa fa-angle-down' aria-hidden='true' />
        </h1>
        { this.props.revs.map(rev => <RevisionRow key={rev.id} rev={rev} docInfo={this.props.docInfo} currentUrl={this.props.currentUrl} reload={this.props.reload} /> ) }
        { !this.props.revs[0] && <p>Error in loading the document revisions.</p> }
      </div>
    );
  }
}

export default RevisionsContainer;
