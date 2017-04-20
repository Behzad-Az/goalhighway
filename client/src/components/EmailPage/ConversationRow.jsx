import React, {Component} from 'react';

class ConversationRow extends Component {
  constructor(props) {
    super(props);
    this._handleDeletionRequest = this._handleDeletionRequest.bind(this);
    this.message = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
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
            <img src='http://bulma.io/images/placeholders/64x64.png' />
          </p>
        </figure>
        <div className='media-content'>
          <div className='content'>
            <small>Posted on 2017-02-14</small>
            <br />
            {this.message}
          </div>
        </div>
      </article>
    );
  }
}

export default ConversationRow;
