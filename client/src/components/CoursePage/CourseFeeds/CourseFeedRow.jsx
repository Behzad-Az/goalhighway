import React, {Component} from 'react';
import { Link } from 'react-router';

class CourseFeedRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flagRequest: false,
      flagReason: ''
    };
    this._handleDeletionRequest = this._handleDeletionRequest.bind(this);
    this._handleFlagClick = this._handleFlagClick.bind(this);
    this._handleFlagSubmit = this._handleFlagSubmit.bind(this);
    this._renderFlagSelect = this._renderFlagSelect.bind(this);
    this._prepareFeed = this._prepareFeed.bind(this);
    this._renderDocumentFeed = this._renderDocumentFeed.bind(this);
    this._renderCommentFeed = this._renderCommentFeed.bind(this);
    this._renderTutorFeed = this._renderTutorFeed.bind(this);
  }

  _handleDeletionRequest() {
    fetch(`/api/courses/${this.props.feed.course_id}/feed/${this.props.feed.id}`, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/string',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) { this.props.reload(); }
      else { throw 'Server returned false'; }
    })
    .catch(() => this.reactAlert.showAlert('Unable to remove course feed', 'error'));
  }

  _handleFlagClick() {
    let flagRequest = !this.state.flagRequest;
    this.setState({ flagRequest });
  }

  _handleFlagSubmit(e) {
    let state = {};
    state[e.target.name] = e.target.value;
  }

  _renderFlagSelect() {
    return (
      <small className='control flag-submission'>
        <span className='select is-small'>
          <select name='flagReason' onChange={this._handleFlagSubmit}>
            <option value=''>select reason</option>
            <option value='expired link'>Expired link</option>
            <option value='poor categorization'>Poor categorization</option>
            <option value='other'>Other</option>
          </select>
        </span>
      </small>
    );
  }

  _prepareFeed() {
    switch(this.props.feed.category) {
      case 'new_asg_report':
        return this._renderDocumentFeed('New Assingment / Report - ');
      case 'new_lecture_note':
        return this._renderDocumentFeed('New Lecture Note - ');
      case 'new_sample_question':
        return this._renderDocumentFeed('New Sample Question - ');
      case 'new_document':
        return this._renderDocumentFeed('New Document - ');
      case 'revised_asg_report':
        return this._renderDocumentFeed('Revised Assingment / Report - ');
      case 'revised_lecture_note':
        return this._renderDocumentFeed('Revised Lecture Note - ');
      case 'revised_sample_question':
        return this._renderDocumentFeed('Revised Sample Question - ');
      case 'revised_document':
        return this._renderDocumentFeed('Revised Document - ');
      case 'tutor_request':
        return this._renderTutorFeed(`Tutor Request by ${this.props.feed.commenter_name}`);
      case 'new_comment':
        return this._renderCommentFeed(`New Comment by ${this.props.feed.commenter_name}`);
      default:
        return <p></p>;
    }
  }

  _renderDocumentFeed(headerPrefix) {
    return (
      <article className='media course-row'>
        <figure className='media-left'>
          <p className='image is-64x64'>
            <img src='http://bulma.io/images/placeholders/128x128.png' />
          </p>
        </figure>
        <div className='media-content'>
          <div className='content'>
            <strong>
              {headerPrefix}'{this.props.feed.header}'
            </strong>
            <br />
            {this.props.feed.content}
            <br />
            <small><Link>Download Document</Link></small>
            <br />
            <small>
              By {this.props.feed.commenter_name} on {this.props.feed.created_at.slice(0, 10)}
              <i className='fa fa-flag expandable' aria-hidden='true' onClick={this._handleFlagClick} style={{ color: this.state.flagRequest ? '#9D0600' : 'inherit' }} />
              { this.state.flagRequest && this._renderFlagSelect() }
            </small>
          </div>
        </div>
      </article>
    );
  }

  _renderCommentFeed(header) {
    return (
      <article className='media course-row'>
        <figure className='media-left'>
          <p className='image is-64x64'>
            <img src='http://bulma.io/images/placeholders/128x128.png' />
          </p>
        </figure>
        <div className='media-content'>
          <div className='content'>
            <strong>
              {header}
            </strong>
            <br />
            {this.props.feed.content}
            <br />
            <small>
              Posted on {this.props.feed.created_at.slice(0, 10)}
              <i className='fa fa-flag expandable' aria-hidden='true' onClick={this._handleFlagClick} style={{ color: this.state.flagRequest ? '#9D0600' : 'inherit' }} />
              { this.state.flagRequest && this._renderFlagSelect() }
            </small>
            <br />
            <small><a>Reply</a></small>
            {this.props.feed.editable && <small> . <a onClick={this._handleDeletionRequest}> Remove</a></small>}

          </div>
        </div>
      </article>
    );
  }

  _renderTutorFeed(header) {
    return (
      <article className='media course-row'>
        <figure className='media-left'>
          <p className='image is-64x64'>
            <img src='http://bulma.io/images/placeholders/128x128.png' />
          </p>
        </figure>
        <div className='media-content'>
          <div className='content'>
            <strong>
              {header}
            </strong>
            <br />
            {this.props.feed.content}
            <br />
            <small>
              Posted on {this.props.feed.created_at.slice(0, 10)} |
              <i className='fa fa-flag expandable' aria-hidden='true' onClick={this._handleFlagClick} style={{ color: this.state.flagRequest ? '#9D0600' : 'inherit' }} />
              { this.state.flagRequest && this._renderFlagSelect() }
            </small>
            <br />
          </div>
        </div>
      </article>
    );
  }

  render() {
    return this._prepareFeed();
  }
}

export default CourseFeedRow;
