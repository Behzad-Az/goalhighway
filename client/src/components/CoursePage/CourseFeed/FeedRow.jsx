import React, {Component} from 'react';
import ReactAlert from '../../partials/ReactAlert.jsx';

class FeedRow extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this._handleDeletionRequest = this._handleDeletionRequest.bind(this);
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
      if (resJSON) { this.reactAlert.showAlert('Course feed removed', 'info'); }
      else { throw 'Server returned false'; }
    })
    .catch(() => this.reactAlert.showAlert('Unable to remove course feed', 'error'));
  }

  render() {
    return (
      <article className='media feed-row'>
        <figure className='media-left'>
          <p className='image is-64x64'>
            <img src='http://bulma.io/images/placeholders/128x128.png' />
          </p>
        </figure>
        <div className='media-content'>
          <div className='content'>
            <p>
              <strong>{this.props.feed.commenter_name}</strong>
              <br />
              {this.props.feed.content}
              <br />
              <small><a>Like</a> . </small>
              <small><a>Reply</a> . </small>
              { this.props.feed.editable && <small><a onClick={this._handleDeletionRequest}>Remove</a> . </small> }
              <small>3 hrs</small>
            </p>
          </div>
        </div>
      </article>
    );
  }
}

export default FeedRow;
