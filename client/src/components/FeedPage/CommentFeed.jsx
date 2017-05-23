import React, {Component} from 'react';
import { Link } from 'react-router';
import InvalidCharChecker from '../partials/InvalidCharChecker.jsx';

class CommentFeed extends Component {
  constructor(props) {
    super(props);
    this.formLimits = {
      replyContent: { min: 3, max: 500 }
    };
    this.state = {
      dataLoaded: false,
      pageError: false,
      replies: [],
      replyCount: '',
      flagRequest: false,
      flagReason: '',
      showComments: false,
      noMoreFeeds: false,
      replyContent: '',
      likeCount: parseInt(this.props.feed.likeCount),
      likeColor: this.props.feed.alreadyLiked ? 'rgb(0, 78, 137)' : ''
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._handleFlagSubmit = this._handleFlagSubmit.bind(this);
    this._handleSendReply = this._handleSendReply.bind(this);
    this._handleFeedLike = this._handleFeedLike.bind(this);
    this._validateReply = this._validateReply.bind(this);
    this._renderFlagSelect = this._renderFlagSelect.bind(this);
    this._renderReplyBox = this._renderReplyBox.bind(this);
    this._renderReplies = this._renderReplies.bind(this);
  }

  componentDidMount() {
    this._loadComponentData(false);
  }

  _loadComponentData(freshReload) {
    fetch(`/api/courses/${this.props.feed.course_id}/feed/${this.props.feed.id}/replies?repliesoffset=${freshReload ? 0 : this.state.replies.length}`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON, freshReload))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  _conditionData(resJSON, freshReload) {
    if (resJSON) {
      this.setState({
        replies: freshReload ? resJSON.replies : this.state.replies.concat(resJSON.replies),
        noMoreFeeds: !resJSON.replies.length,
        replyCount: resJSON.replyCount,
        dataLoaded: true
      });
    } else {
      throw 'Server returned false';
    }
  }

  _handleFlagSubmit(e) {
    if (e.target.value) {
      let newState = {};
      newState[e.target.name] = e.target.value;
      fetch(`/api/flags/course_feed/${this.props.feed.id}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newState)
      })
      .then(response => response.json())
      .then(resJSON => { if (!resJSON) throw 'Server returned false' })
      .catch(err => console.error('Unable to post flag - ', err))
      .then(() => this.setState(newState));
    }
  }

  _handleSendReply() {
    fetch(`/api/courses/${this.props.feed.course_id}/feed/${this.props.feed.id}/replies`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ replyContent: this.state.replyContent })
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) { this._loadComponentData(true); }
      else { throw 'Server returned false'; }
    })
    .catch(err => console.error('Unable to post flag - ', err))
  }

  _validateReply() {
    return this.state.replyContent.length >= this.formLimits.replyContent.min &&
           !InvalidCharChecker(this.state.replyContent, this.formLimits.replyContent.max, 'courseFeed') &&
           this.props.feed.course_id &&
           this.props.feed.id;
  }

  _renderFlagSelect() {
    return (
      <small className='control flag-submission'>
        <span className='select is-small'>
          <select name='flagReason' onChange={this._handleFlagSubmit}>
            <option value=''>select reason</option>
            <option value='inappropriate content'>Inappropriate content</option>
            <option value='spam'>Spam</option>
            <option value='other'>Other</option>
          </select>
        </span>
      </small>
    );
  }

  _handleFeedLike() {
    let likeOrDislike = this.state.likeColor === 'rgb(0, 78, 137)' ? -1 : 1;
    fetch(`/api/likes/course_feed/${this.props.feed.id}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ likeOrDislike })
    })
    .then(response => response.json())
    .then(resJSON => {
      if (!resJSON) { throw 'Server returned false.'; }
    })
    .catch(err => console.error('Unable to like / dislike feed - ', err))
    .then(() => this.setState({ likeColor: this.state.likeColor === 'rgb(0, 78, 137)' ? '' : 'rgb(0, 78, 137)', likeCount: this.state.likeCount + likeOrDislike }));
  }

  _renderReplyBox() {
    return (
      <div className='control is-grouped'>
        <p className='control is-expanded'>
          <textarea
            className='textarea'
            name='replyContent'
            placeholder='Reply here...'
            onChange={e => this.setState({ replyContent: e.target.value })}
            style={{ minHeight: '35px', padding: '7px', borderColor: InvalidCharChecker(this.state.replyContent, this.formLimits.replyContent.max, 'courseFeed') ? '#9D0600' : '' }} />
        </p>
        <p className='control'>
          <button className='button reply' onClick={this._handleSendReply} disabled={!this._validateReply()}>
            Send
          </button>
        </p>
      </div>
    );
  }

  _renderLoadMoreBtn() {
    if (this.state.replies.length) {
      const btnContent = this.state.noMoreFeeds && this.state.replies.length ? 'All comments loaded' : 'Load more';
      return (
        <p className='reply-load'>
          <button className='button is-link' disabled={this.state.noMoreFeeds} onClick={() => this._loadComponentData(false)}>{btnContent}</button>
        </p>
      );
    } else {
      return <p>No reply has been posted yet.</p>;
    }
  }

  _renderReplies() {
    return this.state.replies.map(reply =>
      <article key={reply.id} className='media course-feed-row reply'>
        <figure className='media-left'>
          <p className='image is-64x64'>
            <img src={`/imagesapi/users/${reply.photo_name}`} />
          </p>
        </figure>
        <div className='media-content'>
          <div className='content'>
            <strong>@{reply.commenter_name}</strong>
            <br />
            {reply.content}
            <br />
            <small>{reply.created_at.slice(0, 10)}
            </small>
          </div>
        </div>
      </article>
    );
  }

  render() {
    return (
      <article className='media course-feed-row'>
        <figure className='media-left'>
          <p className='image is-64x64'>
            <img src={`/imagesapi/users/${this.props.feed.photo_name}`} />
          </p>
        </figure>
        <div className='media-content'>
          <div className='content'>
            <Link to={`/courses/${this.props.feed.course_id}`}>
              <button className='button'>Course Page</button>
            </Link>
            <p>
              <strong>
                <Link to={`/courses/${this.props.feed.course_id}`}>@{this.props.feed.short_display_name}</Link>
                {` - New Comment by ${this.props.feed.commenter_name}`}
              </strong>
              <br />
              {this.props.feed.content}
              <br />
              <small>
                <span className='footer-item'>{this.props.feed.created_at.slice(0, 10)}</span>
                <i
                  className={this.props.feed.editable ? 'fa fa-trash footer-item' : 'fa fa-flag footer-item'}
                  aria-hidden='true'
                  onClick={() => this.props.feed.editable ? this.props.removeComment(this.props.feed.id, this.props.feed.course_id) : this.setState({ flagRequest: !this.state.flagRequest })}
                  style={{ color: this.state.flagRequest ? '#9D0600' : 'inherit' }}
                />
                {this.state.flagRequest && this._renderFlagSelect()}
                <span className='footer-item'>
                  <i
                    className='fa fa-heart'
                    aria-hidden='true'
                    onClick={this._handleFeedLike}
                    style={{ color: this.state.likeColor }}
                  />
                  ({this.state.likeCount})
                </span>
                <Link className='footer-item' onClick={() => this.setState({ showComments: !this.state.showComments })}>Comments({this.state.replyCount})</Link>
              </small>
            </p>
          </div>
          { this._renderReplyBox() }
          { this.state.showComments && this._renderReplies() }
          { this.state.showComments && this._renderLoadMoreBtn() }
        </div>
      </article>
    );
  }
}

export default CommentFeed;
