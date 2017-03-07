import React, {Component} from 'react';
import DocCard from './DocCard.jsx';

class DocsRow extends Component {
  constructor(props) {
    super(props);
    this.populateRow = this.populateRow.bind(this);
  }

  populateRow() {
    return this.props.docs[0] ?
      this.props.docs.map(doc => <DocCard key={doc.id} doc={doc} /> ) :
      <p>No related document uploaded yet...</p>
  }

  render() {
    return (
      <div className="row-container">
        <h1 className="header">
          { this.props.header }
          <i className="fa fa-angle-down" aria-hidden="true" />
        </h1>
        <div className="docs-row">
          {this.populateRow()}
        </div>
      </div>
    );
  }
}

export default DocsRow;
