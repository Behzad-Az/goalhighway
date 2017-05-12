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
        return <CourseFeedRow key={feed.id} feed={feed} composeNewConv={this.props.composeNewConv} />;
      case 'resumeReviewFeed':
        return <ResumeReviewFeedRow key={feed.id} feed={feed} composeNewConv={this.props.composeNewConv} />;
      default:
        return <p></p>;
    }
  }

  render() {
    return (
      <div className='feeds-container'>
        { this.props.feeds.map(feed => this._categorizeFeed(feed)) }
        { !this.props.feeds.length && <p>No feed matching your profile yet.</p> }
      </div>
    );
  }
}

export default FeedsContainer;
