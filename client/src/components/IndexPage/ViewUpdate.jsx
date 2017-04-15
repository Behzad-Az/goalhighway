import React, {Component} from 'react';
import { Link } from 'react-router';

class ViewUpdate extends Component {
  render() {
    return (
      <div className='update-row'>

          <Link to={this.props.docLink} className='update-title'>{this.props.update.title}: </Link>
          <span className='update-desc'>{this.props.update.revisions[0].rev_desc}</span>


      </div>
    );
  }

}

export default ViewUpdate;
