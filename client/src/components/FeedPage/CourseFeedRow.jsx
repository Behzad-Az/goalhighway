import React, {Component} from 'react';
import { Link } from 'react-router';

class CourseFeedRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flagRequest: false,
      flagReason: ''
    };
    this._handleFlagClick = this._handleFlagClick.bind(this);
    this._handleFlagSubmit = this._handleFlagSubmit.bind(this);
    this._renderFlagSelect = this._renderFlagSelect.bind(this);
    this._prepareFeed = this._prepareFeed.bind(this);
    this._renderDocumentFeed = this._renderDocumentFeed.bind(this);
    this._renderCommentFeed = this._renderCommentFeed.bind(this);
  }

  _handleFlagClick() {
    let flagRequest = !this.state.flagRequest;
    this.setState({ flagRequest });
  }

  _handleFlagSubmit(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    // fetch(`/api/flags/jobs/${this.props.feed.id}`, {
    //   method: 'POST',
    //   credentials: 'same-origin',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(state)
    // })
    // .then(response => response.json())
    // .then(resJSON => { if (!resJSON) throw 'Server returned false' })
    // .catch(err => console.error('Unable to post flag - ', err))
    // .then(() => this.setState(state));
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
        return <p>'Tutor Request - '</p>
      case 'new_comment':
        return this._renderCommentFeed(` - New Comment by ${this.props.feed.commenter_name}`);
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
            <Link to={`/courses/${this.props.feed.course_id}`}>
              <button className='button'>Go to Course Page</button>
            </Link>
            <p>
              <strong>
                <Link to={`/courses/${this.props.feed.course_id}`}>@{this.props.feed.short_display_name}</Link>
              </strong>
              <br />
              <strong>
                <Link to={`/courses/${this.props.feed.course_id}/docs/${this.props.feed.doc_id}`}>{headerPrefix}'{this.props.feed.header}'</Link>
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
            </p>
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
            <Link to={`/courses/${this.props.feed.course_id}`}>
              <button className='button'>Go to Course Page</button>
            </Link>
            <p>
              <strong>
                <Link to={`/courses/${this.props.feed.course_id}`}>@{this.props.feed.short_display_name}</Link>
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
            </p>
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
