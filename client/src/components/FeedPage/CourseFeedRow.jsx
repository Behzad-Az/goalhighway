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

  _decodeCategory() {
    let output;
    switch(this.props.feed.category) {
      case 'new_asg_report':
        output = 'New Assingment / Report - ';
        break;
      case 'new_lecture_note':
        output = 'New Lecture Note - ';
        break;
      case 'new_sample_question':
        output = 'New Sample Question - ';
        break;
      case 'new_document':
        output = 'New Document - ';
        break;
      case 'revised_asg_report':
        output = 'Revised Assingment / Report - ';
        break;
      case 'revised_lecture_note':
        output = 'Revised Lecture Note - ';
        break;
      case 'revised_sample_question':
        output = 'Revised Sample Question - ';
        break;
      case 'revised_document':
        output = 'Revised Document - ';
        break;
      case 'tutor_request':
        output = 'Tutor Request - ';
        break;
      case 'new_comment':
        output = 'New Comment';
        break;
      default:
        output = '';
        break;
    }
    return output;
  }

  render() {
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
                <Link to={`/courses/${this.props.feed.course_id}/docs/${this.props.feed.doc_id}`}>{this._decodeCategory()}'{this.props.feed.header}'</Link>
              </strong>
              <br />
              {this.props.feed.content}
              <br />
              <small><Link>Download Document</Link></small>
              <i className='fa fa-flag expandable' aria-hidden='true' onClick={this._handleFlagClick} style={{ color: this.state.flagRequest ? '#9D0600' : 'inherit' }} />
              { this.state.flagRequest && this._renderFlagSelect() }
              <br />
              <small>By {this.props.feed.commenter_name} on {this.props.feed.created_at.slice(0, 10)}</small>
            </p>
          </div>
        </div>
      </article>
    );
  }
}

export default CourseFeedRow;
