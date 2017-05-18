import React, {Component} from 'react';
import { Link } from 'react-router';

class CommentFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flagRequest: false,
      flagReason: '',
      showReplyBox: false,
      replyContent: '',
      likeCount: parseInt(this.props.feed.likeCount),
      likeColor: this.props.feed.alreadyLiked ? 'rgb(0, 78, 137)' : ''
    };
    this._handleFlagSubmit = this._handleFlagSubmit.bind(this);
    this._renderFlagSelect = this._renderFlagSelect.bind(this);
    this._handleFeedLike = this._handleFeedLike.bind(this);
    this._displayReplyBox = this._displayReplyBox.bind(this);
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

  _displayReplyBox() {
    if (this.state.showReplyBox) {
      return (
        <div className='control is-grouped'>
          <p className='control is-expanded'>
            <textarea
              className='textarea'
              style={{minHeight: '40px'}}
              name='replyContent'
              placeholder='Enter your comment here...'
              onChange={e => this.setState({ replyContent: e.target.value })} />
          </p>
          <p className='control'>
            <a className='button is-info'>
              Send
            </a>
          </p>
        </div>
      );
    }
  }

  render() {
    return (
      <article className='media course-row'>
        <figure className='media-left'>
          <p className='image is-64x64'>
            <img src={`http://localhost:19001/images/users/${this.props.feed.photo_name}`} />
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
                <Link onClick={() => this.setState({ showReplyBox: !this.state.showReplyBox })}>Comment</Link>
              </small>
              <br />
              <small>
                <span className='footer-item'>{this.props.feed.created_at.slice(0, 10)}</span>
                <i
                  className={this.props.feed.editable ? 'fa fa-trash footer-item' : 'fa fa-flag footer-item'}
                  aria-hidden='true'
                  onClick={() => this.props.feed.editable ? this.props.removeComment(this.props.feed.id, this.props.feed.course_id) : this.setState({ flagRequest: !this.state.flagRequest })}
                  style={{ color: this.state.flagRequest ? '#9D0600' : 'inherit' }} />
                {this.state.flagRequest && this._renderFlagSelect()}
                <i className='fa fa-heart footer-item' aria-hidden='true' onClick={this._handleFeedLike} style={{ color: this.state.likeColor }} />
                <span className='footer-item'>{this.state.likeCount}</span>
              </small>
            </p>
          </div>
          { this._displayReplyBox() }
        </div>
      </article>
    );
  }
}

export default CommentFeed;
