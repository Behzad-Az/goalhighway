import React, {Component} from 'react';
import ReactAlert from '../../partials/ReactAlert.jsx';

class NewCourseFeed extends Component {
  constructor(props) {
    super(props);
    this.maxContentLength = 250;
    this.reactAlert = new ReactAlert();
    this.state = {
      commenterName: '',
      category: '',
      content: ''
    };
    this.validateForm = this.validateForm.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateForm() {
    return this.state.category && this.state.content && this.state.content.length <= this.maxContentLength;
  }

  clearForm() {
    this.setState({
      commenterName: '',
      category: '',
      content: ''
    });
  }

  handleChange(e) {
    e.preventDefault();
    let obj = {};
    obj[e.target.name] = e.target.value;
    this.setState(obj);
  }

  handleSubmit() {
    let data = {
      commenterName: this.state.commenterName,
      category: this.state.category,
      content: this.state.content
    };

    fetch(`/api/courses/${this.props.courseId}/comments`, {
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
      if (resJSON) { this.reactAlert.showAlert('New course feed submitted', 'info'); }
      else { throw 'Server returned false'; }
    })
    .catch(err => console.error('Unable to post new course feed - ', err))
    .then(() => {
      this.props.updateCommentsOptimistically(this.state, 'new');
      this.clearForm();
    });
  }

  render() {
    return (
      <div className='new-course-feed'>
        <h1 className='header'>
          Course Feed
          <i onClick={this.handleModal} className='fa fa-angle-down' aria-hidden='true' />
        </h1>
        <div className='control is-horizontal'>
          <div className='control is-grouped'>
            <p className='control is-expanded'>
              <input className='input' name='commenterName' type='text' placeholder='Name (Optional)' onChange={this.handleChange} value={this.state.commenterName} />
            </p>
            <div className='control is-expanded'>
              <div className='select is-fullwidth'>
                <select name='category' onChange={this.handleChange} value={this.state.category}>
                  <option value=''>Select Category</option>
                  { this.props.categories.map((category, index) => <option key={index} value={category.name}>{category.value}</option> )}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className='control is-horizontal'>
          <div className='control'>
            <textarea className='textarea' name='content' placeholder='Type your comment here...' onChange={this.handleChange} value={this.state.content} />
          </div>
        </div>
        <div className='control is-grouped'>
          <p className='control'>
            <button className='button is-primary' disabled={!this.validateForm()} onClick={this.handleSubmit}>Post Comment</button>
          </p>
          <p className='control'>
            <button className='button is-link' onClick={this.clearForm}>Clear</button>
          </p>
          <p className='char-counter' style={{color: this.maxContentLength - this.state.content.length < 0 ? 'red' : ''}}>{this.state.content.length}</p>
        </div>
      </div>
    );
  }
}

export default NewCourseFeed;
