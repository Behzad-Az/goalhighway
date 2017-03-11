import React, {Component} from 'react';
import ReactAlert from '../../partials/ReactAlert.jsx';

class NewCourseFeed extends Component {
  constructor(props) {
    super(props);
    this.maxContentLength = 250;
    this.reactAlert = new ReactAlert();
    this.state = {
      commenter_name: '',
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
      commenter_name: '',
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
    $.ajax({
      method: 'POST',
      url: `/api/courses/${this.props.courseId}/comments`,
      data: this.state,
      success: (response) => {
        response ? this.reactAlert.showAlert('Comment submitted', 'info') : console.error('server error - 0', response);
      }
    }).always(() => {
      this.props.refresh(this.state, 'new');
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
              <input className='input' name='commenter_name' type='text' placeholder='Name (Optional)' onChange={this.handleChange} value={this.state.commenter_name} />
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
