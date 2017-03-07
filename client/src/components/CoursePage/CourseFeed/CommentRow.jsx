import React, {Component} from 'react';
import ReactAlert from '../../partials/ReactAlert.jsx';

class CommentRow extends Component {
  constructor(props) {
    super(props);
    this.handleDeletionRequest = this.handleDeletionRequest.bind(this);
    this.reactAlert = new ReactAlert();
  }

  handleDeletionRequest(e) {
    $.ajax({
      method: 'DELETE',
      url: `/api/courses/${this.props.comment.course_id}/feed/${this.props.comment.id}`,
      success: (response) => {
       response ? this.reactAlert.showAlert("Comment deleted", "info") : console.error("server error - 0", response);
      }
    }).always(() => {
      this.props.refresh(this.props.comment, 'delete');
    });
  }

  render() {
    return (
      <article className="media comment-row">
        <figure className="media-left">
          <p className="image is-64x64">
            <img src="http://bulma.io/images/placeholders/128x128.png" />
          </p>
        </figure>
        <div className="media-content">
          <div className="content">
            <p>
              <strong>{this.props.comment.commenter_name}</strong>
              <br />
              {this.props.comment.content}
              <br />
              <small><a>Like</a> . </small>
              <small><a>Reply</a> . </small>
              { this.props.comment.editable && <small><a onClick={this.handleDeletionRequest}>Delete</a> . </small> }
              <small>3 hrs</small>
            </p>
          </div>
        </div>
      </article>
    );
  }
}

export default CommentRow;
