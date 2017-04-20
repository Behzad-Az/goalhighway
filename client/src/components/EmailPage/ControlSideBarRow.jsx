import React, {Component} from 'react';

class ControlSideBarRow extends Component {
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
      <article className='media control-sidebar-row'>
        <figure className='media-left'>
          <p className='image is-48x48'>
            <img src='http://bulma.io/images/placeholders/64x64.png' />
          </p>
        </figure>
        <div className='media-content'>
          <div className='content'>
            <strong>I reviewed your resume</strong>
            <br />
            Baba Raja
            <br />
            <small>Posted on 2017-02-14</small>
            <br />
          </div>
        </div>
      </article>
    );
  }
}

export default ControlSideBarRow;
