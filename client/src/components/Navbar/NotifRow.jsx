import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';
import { browserHistory, Link } from 'react-router';

class NotifRow extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this._changePage = this._changePage.bind(this);
  }

  _changePage(link) {
    browserHistory.push(link);
    this.forceUpdate();
  }

  render() {
    return (
      <article className='media notif-row'>
        <figure className='media-left'>
          <p className='image is-64x64'>
            <img src='http://bulma.io/images/placeholders/128x128.png' />
          </p>
        </figure>
        <div className='media-content'>
          <div className='content'>
            <p>
              <strong>{this.props.notif.username}</strong>
              { this.props.notif.unviewed && <img className='image is-16x16' src='http://bulma.io/images/jgthms.png' /> }
              <br />
              {this.props.notif.content}
              <br />
              <small><a>Like</a> . </small>
              <small><a>Reply</a> . </small>
              <small><Link to={`/courses/${this.props.notif.course_id}`}>Go to Course</Link></small>

              <small>3 hrs</small>
            </p>
          </div>
        </div>
      </article>
    );
  }
}

export default NotifRow;
