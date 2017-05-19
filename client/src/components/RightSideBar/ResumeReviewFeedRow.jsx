import React, {Component} from 'react';
import { Link } from 'react-router';

const download = require('../../download.js');

class ResumeReviewFeedRow extends Component {
  constructor(props) {
    super(props);
    this._handleDownload = this._handleDownload.bind(this);
  }

  _handleDownload() {
    fetch(`/api/resumes/${this.props.feed.id}`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => {
      if (response.status === 200) { return response.blob(); }
      else { throw 'Server returned false.'; }
    })
    .then(blob => download(blob, `Resume_${this.props.feed.title}`))
    .catch(err => console.error('Unable to download file: - ', err));
  }

  render() {
    return (
      <article className='media resume-review-feed-row'>
        <div className='media-content'>
          <div className='content'>
            <strong>
              @{this.props.feed.commenter_name} - Resume Review Request
            </strong>
            <br />
            {this.props.feed.title} - {this.props.feed.intent}
            <br />
            <small>
              {this.props.feed.created_at.slice(0, 10)} | <Link onClick={this._handleDownload}>Download CV</Link> | <Link onClick={() => this.props.composeNewConv({
                toId: this.props.feed.commenter_id,
                objId: this.props.feed.id,
                type: 'resumeReview',
                subject: 'RE: CV Review Request' })}>Review CV</Link>
            </small>
          </div>
        </div>
      </article>
    );
  }
}

export default ResumeReviewFeedRow;
