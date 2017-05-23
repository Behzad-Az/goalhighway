import React, {Component} from 'react';
import { Link } from 'react-router';

class ItemFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flagRequest: false,
      flagReason: '',
      likeCount: parseInt(this.props.feed.likeCount),
      likeColor: this.props.feed.alreadyLiked ? 'rgb(0, 78, 137)' : ''
    };
    this._handleFlagSubmit = this._handleFlagSubmit.bind(this);
    this._renderFlagSelect = this._renderFlagSelect.bind(this);
    this._handleFeedLike = this._handleFeedLike.bind(this);
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
            <Link onClick={() => this.props.composeNewConv({
              toId: this.props.feed.commenter_id,
              objId: this.props.feed.item_for_sale_id,
              type: 'itemForSale',
              subject: 'RE: Interested in your item for sale / trade' })}>
              <button className='button'>Contact Owner</button>
            </Link>
            <p>
              <strong>
                <Link to={`/courses/${this.props.feed.course_id}`}>@{this.props.feed.short_display_name}</Link>
                {`- New Item for Sale - ${this.props.feed.header}`}
              </strong>
              <br />
              {this.props.feed.content}
              <br />
              <small>
                <Link to={`/courses/${this.props.feed.course_id}`}>Go to Course Page</Link>
              </small>
              <br />
              <small>
                <span className='footer-item'>{this.props.feed.created_at.slice(0, 10)}</span>
                <i className='fa fa-flag footer-item' aria-hidden='true' onClick={() => this.setState({ flagRequest: !this.state.flagRequest })} style={{ color: this.state.flagRequest ? '#9D0600' : 'inherit' }} />
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
              </small>
            </p>
          </div>
        </div>
      </article>
    );
  }
}

export default ItemFeed;
