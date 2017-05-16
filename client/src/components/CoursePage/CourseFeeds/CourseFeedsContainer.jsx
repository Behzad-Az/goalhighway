import React, {Component} from 'react';
import NewCourseFeedForm from './NewCourseFeedForm.jsx';
import CourseFeedRow from './CourseFeedRow.jsx';

class CourseFeedsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      showContainer: true,
      feeds: [],
      noMoreFeeds: false
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._removeComment = this._removeComment.bind(this);
    this._displayLoadMoreBtn = this._displayLoadMoreBtn.bind(this);
    this._renderCompAfterData = this._renderCompAfterData.bind(this);
  }

  componentDidMount() {
    this._loadComponentData()
  }

  _loadComponentData(courseId) {
    fetch(`/api/courses/${this.props.courseId}/feed?coursefeedoffset=${this.state.feeds.length}`, {
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
        feeds: this.state.feeds.concat(resJSON.feeds),
        dataLoaded: true,
        noMoreFeeds: !resJSON.feeds.length
      });
    } else {
      throw 'Server returned false';
    }
  }

  _removeComment(feedId) {
    fetch(`/api/courses/${this.props.courseId}/feed/${feedId}`, {
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
        this.setState({ feeds: this.state.feeds.filter(comment => !(comment.id === feedId)) });
      }
      else { throw 'Server returned false'; }
    })
    .catch(err => console.error('Unable to delete course feed: ', err));
  }

  _displayLoadMoreBtn() {
    let btnContent = this.state.noMoreFeeds && this.state.feeds.length ? 'No more feed item' : 'Load more feed items';
    if (this.state.feeds.length) {
      return (
        <p className='end-msg'>
          <button className='button' disabled={this.state.noMoreFeeds} onClick={this._loadComponentData}>{btnContent}</button>
        </p>
      );
    } else {
      return <p>No course feed available yet.</p>;
    }
  }

  _renderCompAfterData() {
    if (this.state.dataLoaded && this.state.pageError) {
      return (
        <p className='page-msg'>
          <i className='fa fa-exclamation-triangle' aria-hidden='true' />
          Error while loading up course feed
        </p>
      );
    } else if (this.state.dataLoaded) {
      return (
        <div className={this.state.showContainer ? 'feeds-rows' : 'feeds-rows is-hidden'}>
          { this.state.feeds.map(feed =>
              <CourseFeedRow
                key={feed.id}
                feed={feed}
                reload={this.props.reload}
                composeNewConv={this.props.composeNewConv}
                removeComment={this._removeComment} />
          )}
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
    return (
      <div className='feeds-container'>
        <h1 className='header'>
          Course Feed:
          <i
            className={this.state.showContainer ? 'fa fa-angle-down' : 'fa fa-angle-up'}
            aria-hidden='true'
            onClick={() => this.setState({ showContainer: !this.state.showContainer })}
          />
        </h1>
        <NewCourseFeedForm courseId={this.props.courseId} reload={this.props.reload} />
        <hr />
        { this._renderCompAfterData() }
        { this.state.showContainer && this._displayLoadMoreBtn() }
      </div>
    );
  }
}

export default CourseFeedsContainer;
