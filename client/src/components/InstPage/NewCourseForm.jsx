import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';
import HandleModal from '../partials/HandleModal.js';

class NewCourseForm extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.state = {
      prefix: '',
      suffix: '',
      courseDesc: '',
      courseYear: ''
    };
    this._handleChange = this._handleChange.bind(this);
    this._validateForm = this._validateForm.bind(this);
    this._handleNewCoursePost = this._handleNewCoursePost.bind(this);
  }

  _handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  _validateForm() {
    return this.state.prefix &&
           this.state.suffix &&
           this.state.courseDesc &&
           this.state.courseYear &&
           this.props.instId
  }

  _handleNewCoursePost() {
    let data = {
      prefix: this.state.prefix,
      suffix: this.state.suffix,
      course_desc: this.state.courseDesc,
      course_year: this.state.courseYear,
      inst_id: this.props.instId
    };

    fetch('/api/courses', {
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
        this.reactAlert.showAlert('New course added.', 'info');
        this.props.reload();
      }
      else { throw 'Server returned false'; }
    })
    .catch(() => this.reactAlert.showAlert('Unable to add new course', 'error'))
    .then(() => HandleModal('new-course-form'));
  }

  render() {
    return (
      <div id='new-course-form' className='modal'>
        <div className='modal-background' onClick={() => HandleModal('new-course-form')}></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>{this.props.instName} - New Course</p>
            <button className='delete' onClick={() => HandleModal('new-course-form')}></button>
          </header>
          <section className='modal-card-body'>

            <label className='label'>Prefix:</label>
            <p className='control'>
              <input className='input' type='text' name='prefix' placeholder='Example: MATH' onChange={this._handleChange} />
            </p>

            <label className='label'>Suffix:</label>
            <p className='control'>
              <input className='input' type='text' name='suffix' placeholder='Example: 101' onChange={this._handleChange} />
            </p>

            <label className='label'>Title:</label>
            <p className='control'>
              <input className='input' type='text' name='courseDesc' placeholder='Example: Introducion to calculus' onChange={this._handleChange} />
            </p>

            <label className='label'>Academic Year:</label>
            <p className='control'>
              <span className='select'>
                <select className='select' name='courseYear' onChange={this._handleChange}>
                  <option value=''>-</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                </select>
              </span>
            </p>

          </section>
          <footer className='modal-card-foot'>
            <button className='button is-primary' disabled={!this._validateForm()} onClick={this._handleNewCoursePost}>Submit</button>
            <button className='button' onClick={() => HandleModal('new-course-form')}>Cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default NewCourseForm;
