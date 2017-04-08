import React, {Component} from 'react';
import ResumeReviewFeedRow from './ResumeReviewFeedRow.jsx';
import CourseFeedRow from './CourseFeedRow.jsx';

class FeedsContainer extends Component {
  render() {
    return (
      <div className='feeds-container'>
        <h1 className='header'>
          My Feed:
          <i className='fa fa-angle-down' aria-hidden='true' />
        </h1>
        <div className='docs-row'>
          { this.props.resumeReviewFeeds.map(feed => <ResumeReviewFeedRow key={feed.id} feed={feed} /> ) }
          { this.props.courseFeeds.map(feed => <CourseFeedRow key={feed.id} feed={feed} /> ) }
          { !this.props.resumeReviewFeeds[0] && !this.props.courseFeeds[0] && <p className='message'>No feed matching your profile yet.</p> }
        </div>
      </div>
    );
  }
}

export default FeedsContainer;
