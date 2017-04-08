import React, {Component} from 'react';
import DocCard from './DocCard.jsx';

class DocsContainer extends Component {
  render() {
    return (
      <div className='docs-container'>
        <h1 className='header'>
          { this.props.header }:
          <i className='fa fa-angle-down' aria-hidden='true' />
        </h1>
        <div className='docs-row'>
          { this.props.docs.map(doc => <DocCard key={doc.id} doc={doc} /> ) }
          { !this.props.docs[0] && <p>No related document uploaded yet...</p> }
        </div>
      </div>
    );
  }
}

export default DocsContainer;
