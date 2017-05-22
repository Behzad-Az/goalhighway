import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';
import AutoSuggestion from '../partials/AutoSuggestion.jsx';
import InvalidCharChecker from '../partials/InvalidCharChecker.jsx';

class NewCompanyReviewForm extends Component {
  constructor(props) {
    super(props);
    this.years = [2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006];
    this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.formLimits = {
      jobPros: { min: 3, max: 500 },
      jobCons: { min: 3, max: 500 },
      profName: { min: 3, max: 60 },

      positionTitle: { min: 3, max: 60 }
    };
    this.reactAlert = new ReactAlert();
    this.state = {
      startYear: '',
      startMonth: '',
      workloadRating: '',
      profRating: '',
      tempStars: '',
      profName: '',



      positionTitle: '',
      trainingRating: '',
      relevancyRating: '',
      overallRating: '',
      jobPros: '',
      jobCons: ''
    };
    this._handleChange = this._handleChange.bind(this);
    this._handleSelectProf = this._handleSelectProf.bind(this);
    this._validateForm = this._validateForm.bind(this);
    this._handleNewReview = this._handleNewReview.bind(this);
  }

  _handleChange(e) {
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  _handleSelectProf(profName) {
    this.setState({ profName });
  }

  _validateForm() {
    return this.state.startYear &&
           this.state.startMonth &&
           this.state.workloadRating &&
           this.state.relevancyRating &&
           this.state.profRating &&
           this.state.overallRating &&
           !InvalidCharChecker(this.state.jobPros, this.formLimits.jobPros.max, 'courseReview') &&
           !InvalidCharChecker(this.state.profName, this.formLimits.profName.max, 'profName');
  }

  _handleNewReview() {
    const data = {
      startYear: this.state.startYear,
      startMonth: this.state.startMonth,
      workloadRating: this.state.workloadRating,
      relevancyRating: this.state.relevancyRating,
      profRating: this.state.profRating,
      overallRating: this.state.overallRating,
      jobPros: this.state.jobPros,
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


            <label className='label'>
              Position title:
              { InvalidCharChecker(this.state.positionTitle, this.formLimits.positionTitle.max, 'positionTitle') && <span className='char-limit'>Invalid</span> }
            </label>
            <div className='control is-grouped'>
              <p className='control is-expanded'>
                <input
                  className='input'
                  type='text'
                  name='positionTitle'
                  placeholder='Describe your position title'
                  onChange={this._handleChange}
                  style={{ borderColor: InvalidCharChecker(this.state.positionTitle, this.formLimits.positionTitle.max, 'positionTitle') ? '#9D0600' : '' }} />
              </p>
              <p className='control'>
                <span className='select'>
                  <select className='select' name='workDuration' onChange={this._handleChange}>
                    <option value=''>select type of job</option>
                    <option value='summer'>Part Time / Summer Job</option>
                    <option value='internship'>Internship / Coop</option>
                    <option value='junior'>New Gradd / Junior</option>
                  </select>
                </span>
              </p>
            </div>

            <label className='label'>Employment Timeline:</label>
            <div className='control is-grouped'>
              <p className='control'>
                <span className='select'>
                  <select className='select' name='startYear' onChange={this._handleChange}>
                    <option value=''>start year</option>
                    { this.years.map(year => <option key={year} value={year}>{year}</option> )}
                  </select>
                </span>
              </p>
              <p className='control'>
                <span className='select'>
                  <select className='select' name='startMonth' onChange={this._handleChange}>
                    <option value=''>start month</option>
                    { this.months.map(month => <option key={month} value={month}>{month}</option> )}
                  </select>
                </span>
              </p>
              <p className='control'>
                <span className='select'>
                  <select className='select' name='workDuration' onChange={this._handleChange}>
                    <option value=''>duration at the job</option>
                    <option value={1}>Less than 6 Months</option>
                    <option value={2}>6 to 12 Months</option>
                    <option value={3}>1 to 2 Years</option>
                    <option value={4}>More than 2 Years</option>
                  </select>
                </span>
              </p>
            </div>

            <label className='label'>How were the training and development programs?</label>
            <p className='control'>
              <label className='radio option'>
                <input type='radio' name='trainingRating' value={1} onChange={this._handleChange} />
                Not good
              </label>
              <label className='radio option'>
                <input type='radio' name='trainingRating' value={2} onChange={this._handleChange} />
                Below average
              </label>
              <label className='radio option'>
                <input type='radio' name='trainingRating' value={3} onChange={this._handleChange} />
                Average
              </label>
              <label className='radio option'>
                <input type='radio' name='trainingRating' value={4} onChange={this._handleChange} />
                Above average
              </label>
              <label className='radio option'>
                <input type='radio' name='trainingRating' value={5} onChange={this._handleChange} />
                Excellent!
              </label>
            </p>

            <label className='label'>How relevant was the job to your field of study?</label>
            <p className='control'>
              <label className='radio option'>
                <input type='radio' name='relevancyRating' value={1} onChange={this._handleChange} />
                Not very relevant
              </label>
              <label className='radio option'>
                <input type='radio' name='relevancyRating' value={2} onChange={this._handleChange} />
                Somewhat relevant
              </label>
              <label className='radio option'>
                <input type='radio' name='relevancyRating' value={3} onChange={this._handleChange} />
                Very relevant
              </label>
            </p>

            <label className='label'>How was the pay?</label>
            <p className='control'>
              <label className='radio option'>
                <input type='radio' name='payRating' value={1} onChange={this._handleChange} />
                Below average
              </label>
              <label className='radio option'>
                <input type='radio' name='payRating' value={2} onChange={this._handleChange} />
                Average
              </label>
              <label className='radio option'>
                <input type='radio' name='payRating' value={3} onChange={this._handleChange} />
                Above average
              </label>
            </p>

            <p className='control'>
              <label className='label'>Overall satisfaction with the job?</label>
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
              Pros (optional):
              { InvalidCharChecker(this.state.jobPros, this.formLimits.jobPros.max, 'jobPros') && <span className='char-limit'>Invalid</span> }
            </label>
            <p className='control'>
              <textarea
                className='textarea'
                name='jobPros'
                placeholder='Describe the pros of your job (optional)'
                onChange={this._handleChange}
                style={{ borderColor: InvalidCharChecker(this.state.jobPros, this.formLimits.jobPros.max, 'jobPros') ? '#9D0600' : '' }} />
            </p>

            <label className='label'>
              Cons (optional):
              { InvalidCharChecker(this.state.jobCons, this.formLimits.jobCons.max, 'jobCons') && <span className='char-limit'>Invalid</span> }
            </label>
            <p className='control'>
              <textarea
                className='textarea'
                name='jobCons'
                placeholder='Describe the cons of your job (optional)'
                onChange={this._handleChange}
                style={{ borderColor: InvalidCharChecker(this.state.jobCons, this.formLimits.jobCons.max, 'courseReview') ? '#9D0600' : '' }} />
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

export default NewCompanyReviewForm;
