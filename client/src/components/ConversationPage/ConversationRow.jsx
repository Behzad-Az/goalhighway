import React, {Component} from 'react';

class ConversationRow extends Component {
  constructor(props) {
    super(props);
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
      if (resJSON) { this.props.reload(); }
      else { throw 'Server returned false'; }
    })
    .catch(() => this.reactAlert.showAlert('Unable to remove course feed', 'error'));
  }

  render() {
    return (
      <article className='media conversation-row'>
        <figure className='media-left'>
          <p className='image is-48x48'>
            <img src={`/imagesapi/users/${this.props.message.photo_name}`} />
          </p>
        </figure>
        <div className='media-content'>
          <div className='content'>
            <small className='message-date'>{this.props.message.sent_at.slice(0, 10)}</small>
            <strong>@{this.props.message.sender_name}</strong>
            <br />
            {this.props.message.content}
          </div>
        </div>
      </article>
    );
  }
}

export default ConversationRow;
