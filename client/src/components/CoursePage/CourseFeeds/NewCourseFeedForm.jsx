import React, {Component} from 'react';
import ReactAlert from '../../partials/ReactAlert.jsx';
import InvalidCharChecker from '../../partials/InvalidCharChecker.jsx';

class NewCourseFeedForm extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.formLimits = {
      content: { min: 3, max: 500 }
    };
    this.state = {
      content: '',
      anonymous: false
    };
    this._validateForm = this._validateForm.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _validateForm() {
    return this.state.content.length >= this.formLimits.content.min &&
           !InvalidCharChecker(this.state.content, this.formLimits.content.max, 'courseFeed') &&
           [true, false].includes(this.state.anonymous) &&
           this.props.courseId;
  }

  _handleChange(e) {
    let obj = {};
    obj[e.target.name] = e.target.value;
    this.setState(obj);
  }

  _handleSubmit() {
    let data = {
      anonymous: this.state.anonymous,
      content: this.state.content
    };

    fetch(`/api/courses/${this.props.courseId}/feed`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) {
        this.reactAlert.showAlert('Comment submitted', 'info');
        this.setState({ content: '', anonymous: false });
        this.props.reload();
      }
      else { throw 'Server returned false'; }
    })
    .catch(err => {
      this.reactAlert.showAlert('Unable to submit comment', 'error');
      console.error('Unable to post new course feed - ', err);
    });
  }

  render() {
    return (
      <div className='new-course-feed'>
        <div className='control'>
          <textarea
            className='textarea'
            name='content'
            placeholder='Type your comment here...'
            onChange={this._handleChange}
            style={{ borderColor: InvalidCharChecker(this.state.content, this.formLimits.content.max, 'courseFeed') ? '#9D0600' : '' }} />
        </div>
        <div className='control is-grouped'>
          <p className='control'>
            <button className='button is-primary' disabled={!this._validateForm()} onClick={this._handleSubmit}>Post Comment</button>
          </p>
          <p className='field anonymous'>
            <input type='checkbox' name='anonymous' checked={this.state.anonymous} onClick={() => this.setState({ anonymous: !this.state.anonymous })} /> Anonymous
          </p>
          <p className='char-counter' style={{ color: this.state.content.length > this.formLimits.content.max ? '#9D0600' : '' }}>{this.state.content.length}</p>
        </div>
      </div>
    );
  }
}

export default NewCourseFeedForm;
