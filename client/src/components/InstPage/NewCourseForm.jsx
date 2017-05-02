import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';

class NewCourseForm extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.formLimits = {
      prefix: 10,
      suffix: 10,
      courseDesc: 100
    };
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
    return this.state.prefix && this.state.prefix.length <= this.formLimits.prefix &&
           this.state.suffix && this.state.suffix.length <= this.formLimits.suffix &&
           this.state.courseDesc && this.state.courseDesc.length <= this.formLimits.courseDesc &&
           this.state.courseYear &&
           this.props.instId;
  }

  _handleNewCoursePost() {
    let data = {
      prefix: this.state.prefix,
      suffix: this.state.suffix,
      courseDesc: this.state.courseDesc,
      courseYear: this.state.courseYear,
      instId: this.props.instId
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
    .then(this.props.toggleModal);
  }

  render() {
    return (
      <div className={this.props.showModal ? 'modal is-active' : 'modal'}>
        <div className='modal-background' onClick={this.props.toggleModal}></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>{this.props.instName} - New Course</p>
            <button className='delete' onClick={this.props.toggleModal}></button>
          </header>
          <section className='modal-card-body'>

            <label className='label'>
              Prefix:
              { this.state.prefix.length > this.formLimits.prefix && <span className='char-limit'>too long!</span> }
            </label>
            <p className='control'>
              <input
                className='input'
                type='text'
                name='prefix'
                placeholder='Example: MATH'
                onChange={this._handleChange}
                style={{ borderColor: this.state.prefix.length > this.formLimits.prefix ? '#9D0600' : '' }} />
            </p>

            <label className='label'>
              Suffix:
              { this.state.suffix.length > this.formLimits.suffix && <span className='char-limit'>too long!</span> }
            </label>
            <p className='control'>
              <input
                className='input'
                type='text'
                name='suffix'
                placeholder='Example: 101'
                onChange={this._handleChange}
                style={{ borderColor: this.state.suffix.length > this.formLimits.suffix ? '#9D0600' : '' }} />
            </p>

            <label className='label'>
              Title:
              { this.state.courseDesc.length > this.formLimits.courseDesc && <span className='char-limit'>too long!</span> }
            </label>
            <p className='control'>
              <input
                className='input'
                type='text'
                name='courseDesc'
                placeholder='Example: Introducion to calculus'
                onChange={this._handleChange}
                style={{ borderColor: this.state.courseDesc.length > this.formLimits.courseDesc ? '#9D0600' : '' }} />
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
            <button className='button' onClick={this.props.toggleModal}>Cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default NewCourseForm;
