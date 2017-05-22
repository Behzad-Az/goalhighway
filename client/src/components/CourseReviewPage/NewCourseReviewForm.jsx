import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';
import AutoSuggestion from '../partials/AutoSuggestion.jsx';
import InvalidCharChecker from '../partials/InvalidCharChecker.jsx';

class NewCourseReviewForm extends Component {
  constructor(props) {
    super(props);
    this.years = [2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006];
    this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.formLimits = {
      reviewDesc: { min: 3, max: 500 },
      profName: { min: 3, max: 60 }
    };
    this.reactAlert = new ReactAlert();
    this.state = {
      startYear: '',
      startMonth: '',
      workloadRating: '',
      fairnessRating: '',
      profRating: '',
      tempStars: '',
      overallRating: '',
      reviewDesc: '',
      profName: ''
    };
    this._handleChange = this._handleChange.bind(this);
    this._validateForm = this._validateForm.bind(this);
    this._handleNewReview = this._handleNewReview.bind(this);
  }

  _handleChange(e) {
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  _validateForm() {
    return this.state.startYear &&
           this.state.startMonth &&
           this.state.workloadRating &&
           this.state.fairnessRating &&
           this.state.profRating &&
           this.state.overallRating &&
           !InvalidCharChecker(this.state.reviewDesc, this.formLimits.reviewDesc.max, 'courseReview') &&
           !InvalidCharChecker(this.state.profName, this.formLimits.profName.max, 'profName');
  }

  _handleNewReview() {
    const data = {
      startYear: this.state.startYear,
      startMonth: this.state.startMonth,
      workloadRating: this.state.workloadRating,
      fairnessRating: this.state.fairnessRating,
      profRating: this.state.profRating,
      overallRating: this.state.overallRating,
      reviewDesc: this.state.reviewDesc,
      profName: this.state.profName
    };

    fetch(`/api/courses/${this.props.courseId}/reviews`, {
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
        this.reactAlert.showAlert('review posted', 'info');
        this.props.reload();
      }
      else { throw 'Server returned false'; }
    })
    .catch(() => this.reactAlert.showAlert('Unable to post review', 'error'))
    .then(this.props.toggleModal);
  }

  render() {
    return (
      <div className={this.props.showModal ? 'modal is-active' : 'modal'}>
        <div className='modal-background' onClick={this.props.toggleModal}></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>New Course Review</p>
            <button className='delete' onClick={this.props.toggleModal}></button>
          </header>
          <section className='modal-card-body'>

            <label className='label'>When did you start?</label>
            <div className='control is-grouped'>
              <p className='control'>
                <span className='select'>
                  <select className='select' name='startYear' onChange={this._handleChange}>
                    <option value=''>select year</option>
                    { this.years.map(year => <option key={year} value={year}>{year}</option> )}
                  </select>
                </span>
              </p>
              <p className='control'>
                <span className='select'>
                  <select className='select' name='startMonth' onChange={this._handleChange}>
                    <option value=''>select month</option>
                    { this.months.map(month => <option key={month} value={month}>{month}</option> )}
                  </select>
                </span>
              </p>
            </div>

            <label className='label'>How was the workload?</label>
            <p className='control'>
              <label className='radio option'>
                <input type='radio' name='workloadRating' value={1} onChange={this._handleChange} />
                Too Much
              </label>
              <label className='radio option'>
                <input type='radio' name='workloadRating' value={2} onChange={this._handleChange} />
                Too Little
              </label>
              <label className='radio option'>
                <input type='radio' name='workloadRating' value={3} onChange={this._handleChange} />
                Fair
              </label>
            </p>

            <label className='label'>How was the evaluation?</label>
            <p className='control'>
              <label className='radio option'>
                <input type='radio' name='fairnessRating' value={1} onChange={this._handleChange} />
                Too Hard
              </label>
              <label className='radio option'>
                <input type='radio' name='fairnessRating' value={2} onChange={this._handleChange} />
                Too Easy
              </label>
              <label className='radio option'>
                <input type='radio' name='fairnessRating' value={3} onChange={this._handleChange} />
                Fair
              </label>
            </p>

            <label className='label'>How was the instructor?</label>
            <p className='control'>
              <label className='radio option'>
                <input type='radio' name='profRating' value={1} onChange={this._handleChange} />
                Not good
              </label>
              <label className='radio option'>
                <input type='radio' name='profRating' value={2} onChange={this._handleChange} />
                Below average
              </label>
              <label className='radio option'>
                <input type='radio' name='profRating' value={3} onChange={this._handleChange} />
                Average
              </label>
              <label className='radio option'>
                <input type='radio' name='profRating' value={4} onChange={this._handleChange} />
                Above average
              </label>
              <label className='radio option'>
                <input type='radio' name='profRating' value={5} onChange={this._handleChange} />
                Excellent!
              </label>
            </p>

            <div className='control'>
              <label className='is-inline-block'>
                Instructor's name (optional):
                { InvalidCharChecker(this.state.profName, this.formLimits.profName.max, 'profName') && <span className='char-limit'>Invalid</span> }
              </label>
              <AutoSuggestion options={this.props.profs} onChange={profName => this.setState({ profName })} />
            </div>

            <p className='control'>
              <label className='label'>Overall satisfaction with the course?</label>
              <i
                className={ this.state.tempStars >= 1 || this.state.overallRating >= 1 ? 'fa fa-star' : 'fa fa-star-o'}
                aria-hidden='true'
                onMouseOver={() => this.setState({ tempStars: 1 })}
                onMouseLeave={() => this.setState({ tempStars: 0 })}
                onClick={() => this.setState({ overallRating: 1})} />
              <i
                className={ this.state.tempStars >= 2 || this.state.overallRating >= 2 ? 'fa fa-star' : 'fa fa-star-o'}
                aria-hidden='true'
                onMouseOver={() => this.setState({ tempStars: 2 })}
                onMouseLeave={() => this.setState({ tempStars: 0 })}
                onClick={() => this.setState({ overallRating: 2})} />
              <i
                className={ this.state.tempStars >= 3 || this.state.overallRating >= 3 ? 'fa fa-star' : 'fa fa-star-o'}
                aria-hidden='true'
                onMouseOver={() => this.setState({ tempStars: 3 })}
                onMouseLeave={() => this.setState({ tempStars: 0 })}
                onClick={() => this.setState({ overallRating: 3})} />
              <i
                className={ this.state.tempStars >= 4 || this.state.overallRating >= 4 ? 'fa fa-star' : 'fa fa-star-o'}
                aria-hidden='true'
                onMouseOver={() => this.setState({ tempStars: 4 })}
                onMouseLeave={() => this.setState({ tempStars: 0 })}
                onClick={() => this.setState({ overallRating: 4})} />
              <i
                className={ this.state.tempStars >= 5 || this.state.overallRating >= 5 ? 'fa fa-star' : 'fa fa-star-o'}
                aria-hidden='true'
                onMouseOver={() => this.setState({ tempStars: 5 })}
                onMouseLeave={() => this.setState({ tempStars: 0 })}
                onClick={() => this.setState({ overallRating: 5})} />
            </p>

            <label className='label'>
              Feel free to elaborate (optional):
              { InvalidCharChecker(this.state.reviewDesc, this.formLimits.reviewDesc.max, 'courseReview') && <span className='char-limit'>Invalid</span> }
            </label>
            <p className='control'>
              <textarea
                className='textarea'
                name='reviewDesc'
                placeholder='Provide context for your review (optional)'
                onChange={this._handleChange}
                style={{ borderColor: InvalidCharChecker(this.state.reviewDesc, this.formLimits.reviewDesc.max, 'courseReview') ? '#9D0600' : '' }} />
            </p>

          </section>
          <footer className='modal-card-foot'>
            <button className='button is-primary' disabled={!this._validateForm()} onClick={this._handleNewReview}>Submit</button>
            <button className='button' onClick={this.props.toggleModal}>Cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default NewCourseReviewForm;
