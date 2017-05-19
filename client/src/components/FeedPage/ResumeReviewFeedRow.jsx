import React, {Component} from 'react';
import { Link } from 'react-router';

const download = require('../../download.js');

class ResumeReviewFeedRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flagRequest: false,
      flagReason: '',
      likeColor: ''
    };
    this._handleDownload = this._handleDownload.bind(this);
    this._handleFlagClick = this._handleFlagClick.bind(this);
    this._handleFlagSubmit = this._handleFlagSubmit.bind(this);
    this._renderFlagSelect = this._renderFlagSelect.bind(this);
    this._handleFeedLike = this._handleFeedLike.bind(this);
  }

  _handleFlagClick() {
    let flagRequest = !this.state.flagRequest;
    this.setState({ flagRequest });
  }

  _handleFlagSubmit(e) {
    if (e.target.value) {
      let newState = {};
      newState[e.target.name] = e.target.value;
      fetch(`/api/flags/resumes/${this.props.feed.id}`, {
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

  _handleFeedLike(e) {
    let color = e.target.style.color;
    let likeOrDislike = color === 'rgb(0, 78, 137)' ? -1 : 1;

    fetch(`/api/likes/resumes/${this.props.feed.id}`, {
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
    .then(() => this.setState({ likeColor: color === 'rgb(0, 78, 137)' ? '' : 'rgb(0, 78, 137)' }));
  }

  render() {
    return (
      <article className='media resume-review-feed-row'>
        <figure className='media-left'>
          <p className='image is-64x64'>
            <img src={`http://localhost:19001/images/users/${this.props.feed.photo_name}`} />
          </p>
        </figure>
        <div className='media-content'>
          <div className='content'>
            <Link onClick={() => this.props.composeNewConv({
              toId: this.props.feed.commenter_id,
              objId: this.props.feed.id,
              type: 'resumeReview',
              subject: 'RE: CV Review Request' })} >
              <button className='button'>Review CV</button>
            </Link>
            <p>
              <strong>@{this.props.feed.commenter_name} - CV Review Request</strong>
              <br />
              {this.props.feed.title} - {this.props.feed.intent}
              <br />
              <small>
                <Link onClick={this._handleDownload}>Download CV</Link>
              </small>
              <br />
              <small>
                <span className='footer-item'>{this.props.feed.created_at.slice(0, 10)}</span>
                <i className='fa fa-flag footer-item' aria-hidden='true' onClick={this._handleFlagClick} style={{ color: this.state.flagRequest ? '#9D0600' : 'inherit' }} />
                {this.state.flagRequest && this._renderFlagSelect()}
              </small>
            </p>
          </div>
        </div>
      </article>
    );
  }
}

export default ResumeReviewFeedRow;
