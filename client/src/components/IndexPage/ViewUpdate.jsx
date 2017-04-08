import React, {Component} from 'react';
import { Link } from 'react-router';

class ViewUpdate extends Component {
  render() {
    return (
      <div className='update-row'>
        <Link to={`${this.props.courseLink}/docs/${this.props.update.doc_id}`}>
          <p>Update: {this.props.update.rev_desc}<br/>document: {this.props.update.title}</p>
        </Link>
      </div>
    );
  }

}

export default ViewUpdate;
