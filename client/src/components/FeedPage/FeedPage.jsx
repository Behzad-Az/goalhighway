import React, {Component} from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import LeftSideBar from '../partials/LeftSideBar.jsx';
import RightSideBar from '../partials/RightSideBar.jsx';
import SearchBar from '../partials/SearchBar.jsx';
import FeedsContainer from './FeedsContainer.jsx';

class FeedPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      feeds: [],
      courseFeedsLength: 0,
      resumeReviewFeedsLength: 0,
      noMoreFeeds: false
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._renderPageAfterData = this._renderPageAfterData.bind(this);
    this._displayLoadMoreBtn = this._displayLoadMoreBtn.bind(this);
  }

  componentDidMount() {
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

  _displayLoadMoreBtn() {
    let btnContent = this.state.noMoreFeeds && this.state.feeds.length ? 'No more feed item' : 'Load more feed items';
    if (this.state.feeds.length) {
      return (
        <p className='end-msg'>
          <button className='button' disabled={this.state.noMoreFeeds} onClick={this._loadComponentData}>{btnContent}</button>
        </p>
      );
    }
  }

  _renderPageAfterData() {
    if (this.state.dataLoaded && this.state.pageError) {
      return (
        <div className='main-container'>
          <p className='page-msg'>
            <i className='fa fa-exclamation-triangle' aria-hidden='true' />
            Error in loading up the page
          </p>
        </div>
      );
    } else if (this.state.dataLoaded) {
      return (
        <div className='main-container'>
          <SearchBar />
          <FeedsContainer feeds={this.state.feeds} />
          { this._displayLoadMoreBtn() }
        </div>
      );
    } else {
      return (
        <div className='main-container'>
          <p className='page-msg'>
            <i className='fa fa-spinner fa-spin fa-3x fa-fw'></i>
            <span className='sr-only'>Loading...</span>
          </p>
        </div>
      );
    }
  }

  render() {
    return (
      <div className='feed-page'>
        <Navbar />
        <LeftSideBar />
        { this._renderPageAfterData() }
        <RightSideBar />
      </div>
    );
  }
}

export default FeedPage;
