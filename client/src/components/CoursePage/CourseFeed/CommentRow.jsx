import React, {Component} from 'react';
import ReactAlert from '../../partials/ReactAlert.jsx';

class CommentRow extends Component {
  constructor(props) {
    super(props);
    this.handleDeletionRequest = this.handleDeletionRequest.bind(this);
    this.reactAlert = new ReactAlert();
  }

  handleDeletionRequest() {
    fetch(`/api/courses/${this.props.comment.course_id}/feed/${this.props.comment.id}`, {
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
        this.reactAlert.showAlert('Course feed removed', 'info');
        this.props.updateCommentsOptimistically(this.props.comment, 'delete');
      }
      else { throw 'Server returned false'; }
    })
    .catch(() => this.reactAlert.showAlert('Unable to remove course feed', 'error'));
  }

  render() {
    return (
      <article className='media comment-row'>
        <figure className='media-left'>
          <p className='image is-64x64'>
            <img src='http://bulma.io/images/placeholders/128x128.png' />
          </p>
        </figure>
        <div className='media-content'>
          <div className='content'>
            <p>
              <strong>{this.props.comment.commenter_name}</strong>
              <br />
              {this.props.comment.content}
              <br />
              <small><a>Like</a> . </small>
              <small><a>Reply</a> . </small>
              { this.props.comment.editable && <small><a onClick={this.handleDeletionRequest}>Remove</a> . </small> }
              <small>3 hrs</small>
            </p>
          </div>
        </div>
      </article>
    );
  }
}

export default CommentRow;
