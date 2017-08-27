import React, {Component} from 'react';
import NewConvForm from '../ConversationPage/NewConvForm.jsx';
import ResumeReviewFeedRow from './ResumeReviewFeedRow.jsx';
import CourseFeedRow from './CourseFeedRow.jsx';

class FeedsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      convParams: {
        toId: '',
        objId: '',
        type: '',
        subject: ''
      },
      showNewConvForm: false,
      feeds: [],
      courseFeedsLength: 0,
      resumeReviewFeedsLength: 0,
      noMoreFeeds: false
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._composeNewConv = this._composeNewConv.bind(this);
    this._categorizeFeed = this._categorizeFeed.bind(this);
    this._removeComment = this._removeComment.bind(this);
    this._renderLoadMoreBtn = this._renderLoadMoreBtn.bind(this);
    this._renderCompAfterData = this._renderCompAfterData.bind(this);
  }

  componentDidMount() {
    document.title = 'Feed';
    this._loadComponentData();
  }

  _loadComponentData() {
    fetch(`/api/users/currentuser/feed?coursefeedoffset=${this.state.courseFeedsLength}&resumefeedoffset=${this.state.resumeReviewFeedsLength}`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  _conditionData(resJSON) {
    if (resJSON) {
      this.setState({
        courseFeedsLength: this.state.courseFeedsLength + resJSON.feeds.reduce((acc, feed) => feed.type === 'courseFeed' ? acc + 1 : acc, 0),
        resumeReviewFeedsLength: this.state.resumeReviewFeedsLength + resJSON.feeds.reduce((acc, feed) => feed.type === 'resumeReviewFeed' ? acc + 1 : acc, 0),
        feeds: this.state.feeds.concat(resJSON.feeds.sort((a, b) => a.created_at <= b.created_at ? 1 : -1)),
        dataLoaded: true,
        noMoreFeeds: !resJSON.feeds.length
      });
    } else {
      throw 'Server returned false';
    }
  }

  _composeNewConv(convParams) {
    this.setState({ convParams, showNewConvForm: true });
  }

  _categorizeFeed(feed) {
    switch (feed.type) {
      case 'courseFeed':
        return <CourseFeedRow key={feed.id} feed={feed} composeNewConv={this._composeNewConv} removeComment={this._removeComment} />;
      case 'resumeReviewFeed':
        return <ResumeReviewFeedRow key={feed.id} feed={feed} composeNewConv={this._composeNewConv} />;
      default:
        return <p></p>;
    }
  }

  _removeComment(feedId, courseId) {
    fetch(`/api/courses/${courseId}/feed/${feedId}`, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/string',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) {
        this.setState({ feeds: this.state.feeds.filter(comment => !(comment.id == feedId && comment.course_id == courseId && comment.type === 'courseFeed')) });
      }
      else { throw 'Server returned false'; }
    })
    .catch(err => console.error('Unable to delete course feed: ', err));
  }

  _renderLoadMoreBtn() {
    if (this.state.feeds.length) {
      const btnContent = this.state.noMoreFeeds && this.state.feeds.length ? 'No more feed' : 'Load more';
      return (
        <p className='end-msg'>
          <button className='button' disabled={this.state.noMoreFeeds} onClick={this._loadComponentData}>{btnContent}</button>
        </p>
      );
    } else {
      return <p>No feed matching your profile yet.</p>;
    }
  }

  _renderCompAfterData() {
    if (this.state.dataLoaded && this.state.pageError) {
      return (
        <p className='page-msg'>
          <i className='fa fa-exclamation-triangle' aria-hidden='true' />
          Error in loading up the page
        </p>
      );
    } else if (this.state.dataLoaded) {
      return (
        <div className='feeds-container'>
          <NewConvForm
            convParams={this.state.convParams}
            showModal={this.state.showNewConvForm}
            toggleModal={() => this.setState({ showNewConvForm: !this.state.showNewConvForm })}
          />
          <h1 className='header'>
            My Feed:
            <i className='fa fa-angle-down' aria-hidden='true' />
          </h1>
          { this.state.feeds.map(feed => this._categorizeFeed(feed)) }
          { this._renderLoadMoreBtn() }
        </div>
      );
    } else {
      return (
        <p className='page-msg'>
          <i className='fa fa-spinner fa-spin fa-3x fa-fw'></i>
          <span className='sr-only'>Loading...</span>
        </p>
      );
    }
  }

  render() {
    return this._renderCompAfterData();
  }
}

export default FeedsContainer;
