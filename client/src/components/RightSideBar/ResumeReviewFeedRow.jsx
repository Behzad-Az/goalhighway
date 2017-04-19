import React, {Component} from 'react';
import { Link } from 'react-router';

class ResumeReviewFeedRow extends Component {
  render() {
    return (
      <article className='media resume-review-row'>
        <div className='media-content'>
          <div className='content'>
            <strong>
              <Link>@{this.props.feed.commenter_name} - Resume Review Request</Link>
            </strong>
            <br />
            {this.props.feed.title} - {this.props.feed.intent}
            <br />
            <small>
              Posted on {this.props.feed.created_at.slice(0, 10)}
            </small>
          </div>
        </div>
      </article>
    );
  }
}

export default ResumeReviewFeedRow;
