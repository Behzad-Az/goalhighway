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
    this._decodeDocumentCategory = this._decodeDocumentCategory.bind(this);
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

  _decodeDocumentCategory(category) {
    switch(category) {
      case 'lecture_note':
        return ' under Lecture Notes';
      case 'asg_report':
        return ' under Assignments & Reports';
      case 'sample_question':
        return ' under Sample Questions';
      default:
        return '';
    }
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
              <strong>@{this.props.feed.short_display_name} - New Document!</strong>
              <br />
              {this.props.feed.content}{this._decodeDocumentCategory}
              <br />
              <small>
                <Link>Download Document</Link>
              </small>
              <i className='fa fa-flag expandable' aria-hidden='true' onClick={this._handleFlagClick} style={{ color: this.state.flagRequest ? '#9D0600' : 'inherit' }} />
              {this.state.flagRequest && this._renderFlagSelect()}
            </p>
          </div>
        </div>
      </article>
    );
  }
}

export default CourseFeedRow;
