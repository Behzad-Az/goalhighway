import React, {Component} from 'react';
import ResumeReviewFeedRow from './ResumeReviewFeedRow.jsx';
import CourseFeedRow from './CourseFeedRow.jsx';

class FeedsContainer extends Component {
  constructor(props) {
    super(props);
    this._categorizeFeed = this._categorizeFeed.bind(this);
  }

  _categorizeFeed(feed) {
    switch (feed.type) {
      case 'courseFeed':
        return <CourseFeedRow key={feed.id} feed={feed} composeNewEmail={this.props.composeNewEmail} removeComment={this.props.removeComment} />;
      case 'resumeReviewFeed':
        return <ResumeReviewFeedRow key={feed.id} feed={feed} composeNewEmail={this.props.composeNewEmail} />;
      default:
        return <p></p>;
    }
  }

  render() {
    return (
      <div className='feeds-container'>
        <h1 className='header'>
          My Feed:
          <i className='fa fa-angle-down' aria-hidden='true' />
        </h1>
        { this.props.feeds.map(feed => this._categorizeFeed(feed)) }
        { !this.props.feeds.length && <p>No feed matching your profile yet.</p> }
      </div>
    );
  }
}

export default FeedsContainer;
