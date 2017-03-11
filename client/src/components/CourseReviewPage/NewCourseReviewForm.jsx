import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';
import HandleModal from '../partials/HandleModal.js';
import AutoSuggestion from '../partials/AutoSuggestion.jsx';
import SingleSelect from '../partials/SingleSelect.jsx';

class NewCourseReviewForm extends Component {
  constructor(props) {
    super(props);
    this.months = [ { value: '', label: 'select month' },
      { value: 'Jan', label: 'Jan' }, { value: 'Feb', label: 'Feb' }, { value: 'Mar', label: 'Mar' }, { value: 'Apr', label: 'Apr' },
      { value: 'May', label: 'May' }, { value: 'Jun', label: 'Jun' }, { value: 'Jul', label: 'Jul' }, { value: 'Aug', label: 'Aug' },
      { value: 'Sep', label: 'Sep' }, { value: 'Oct', label: 'Oct' }, { value: 'Nov', label: 'Nov' }, { value: 'Dec', label: 'Dec' }
    ];

    this.years = [ { value: '', label: 'select year' },
      { value: 2006, label: 2006 }, { value: 2007, label: 2007 }, { value: 2008, label: 2008 }, { value: 2009, label: 2009 },
      { value: 2010, label: 2010 }, { value: 2011, label: 2011 }, { value: 2012, label: 2012 }, { value: 2013, label: 2013 },
      { value: 2014, label: 2014 }, { value: 2015, label: 2015 }, { value: 2016, label: 2016 }, { value: 2017, label: 2017 }
    ];

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

    this.reactAlert = new ReactAlert();
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectProf = this.handleSelectProf.bind(this);
    this.handleSelectYear = this.handleSelectYear.bind(this);
    this.handleSelectMonth = this.handleSelectMonth.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleNewReview = this.handleNewReview.bind(this);
  }

  handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  handleSelectProf(profName) {
    this.setState({ profName });
  }

  handleSelectYear(startYear) {
    this.setState({ startYear });
  }

  handleSelectMonth(startMonth) {
    this.setState({ startMonth });
  }

  validateForm() {
    return this.state.startYear &&
           this.state.startMonth &&
           this.state.workloadRating &&
           this.state.fairnessRating &&
           this.state.profRating &&
           this.state.overallRating;
  }

  handleNewReview() {
    const successFcn = () => {
      this.reactAlert.showAlert('Successfully posted review', 'info');
      this.props.reload();
    };
    let data = {
      startYear: this.state.startYear,
      startMonth: this.state.startMonth,
      workloadRating: this.state.workloadRating,
      fairnessRating: this.state.fairnessRating,
      profRating: this.state.profRating,
      overallRating: this.state.overallRating,
      reviewDesc: this.state.reviewDesc,
      profName: this.state.profName
    };
    $.ajax({
      method: 'POST',
      url: `/api/courses/${this.props.courseId}/reviews`,
      data: data,
      success: response => {
        response ? successFcn() : this.reactAlert.showAlert('Unable to post review', 'error');
      }
    }).always(() => HandleModal('new-course-review-form'));
  }

  render() {
    return (
      <div id='new-course-review-form' className='modal'>
        <div className='modal-background' onClick={() => HandleModal('new-course-review-form')}></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>New Course Review</p>
            <button className='delete' onClick={() => HandleModal('new-course-review-form')}></button>
          </header>
          <section className='modal-card-body'>

            <label className='label'>When did you start?</label>
            <div className='columns'>
              <div className='column is-6'>
                <SingleSelect disabled={false} initialValue={this.state.startYear} name='startYear' options={this.years} handleChange={this.handleSelectYear} />
              </div>
              <div className='column is-6'>
                <SingleSelect disabled={false} initialValue={this.state.startMonth} name='startMonth' options={this.months} handleChange={this.handleSelectMonth} />
              </div>
            </div>

            <label className='label'>How was the workload?</label>
            <p className='control'>
              <label className='radio option'>
                <input type='radio' name='workloadRating' value={1} onChange={this.handleChange} />
                Too Much
              </label>
              <label className='radio option'>
                <input type='radio' name='workloadRating' value={2} onChange={this.handleChange} />
                Too Little
              </label>
              <label className='radio option'>
                <input type='radio' name='workloadRating' value={3} onChange={this.handleChange} />
                Fair
              </label>
            </p>

            <label className='label'>How was the evaluation?</label>
            <p className='control'>
              <label className='radio option'>
                <input type='radio' name='fairnessRating' value={1} onChange={this.handleChange} />
                Too Hard
              </label>
              <label className='radio option'>
                <input type='radio' name='fairnessRating' value={2} onChange={this.handleChange} />
                Too Easy
              </label>
              <label className='radio option'>
                <input type='radio' name='fairnessRating' value={3} onChange={this.handleChange} />
                Fair
              </label>
            </p>

            <label className='label'>How was the instructor?</label>
            <p className='control'>
              <label className='radio option'>
                <input type='radio' name='profRating' value={1} onChange={this.handleChange} />
                Not good
              </label>
              <label className='radio option'>
                <input type='radio' name='profRating' value={2} onChange={this.handleChange} />
                Below average
              </label>
              <label className='radio option'>
                <input type='radio' name='profRating' value={3} onChange={this.handleChange} />
                Average
              </label>
              <label className='radio option'>
                <input type='radio' name='profRating' value={4} onChange={this.handleChange} />
                Above average
              </label>
              <label className='radio option'>
                <input type='radio' name='profRating' value={5} onChange={this.handleChange} />
                Excellent!
              </label>
            </p>

            <div className='control'>
              <label className='is-inline-block'>Instructor's name (optional):</label>
              <AutoSuggestion options={this.props.profs} onChange={this.handleSelectProf} />
            </div>

            <p className='control'>
              <label className='label'>Overall satisfaction with the course?</label>
              <i className={ this.state.tempStars >= 1 || this.state.overallRating >= 1 ? 'fa fa-star' : 'fa fa-star-o'} aria-hidden='true' onMouseOver={() => this.setState({ tempStars: 1 })} onMouseLeave={() => this.setState({ tempStars: 0 })} onClick={() => this.setState({ overallRating: 1})} />
              <i className={ this.state.tempStars >= 2 || this.state.overallRating >= 2 ? 'fa fa-star' : 'fa fa-star-o'} aria-hidden='true' onMouseOver={() => this.setState({ tempStars: 2 })} onMouseLeave={() => this.setState({ tempStars: 0 })} onClick={() => this.setState({ overallRating: 2})} />
              <i className={ this.state.tempStars >= 3 || this.state.overallRating >= 3 ? 'fa fa-star' : 'fa fa-star-o'} aria-hidden='true' onMouseOver={() => this.setState({ tempStars: 3 })} onMouseLeave={() => this.setState({ tempStars: 0 })} onClick={() => this.setState({ overallRating: 3})} />
              <i className={ this.state.tempStars >= 4 || this.state.overallRating >= 4 ? 'fa fa-star' : 'fa fa-star-o'} aria-hidden='true' onMouseOver={() => this.setState({ tempStars: 4 })} onMouseLeave={() => this.setState({ tempStars: 0 })} onClick={() => this.setState({ overallRating: 4})} />
              <i className={ this.state.tempStars >= 5 || this.state.overallRating >= 5 ? 'fa fa-star' : 'fa fa-star-o'} aria-hidden='true' onMouseOver={() => this.setState({ tempStars: 5 })} onMouseLeave={() => this.setState({ tempStars: 0 })} onClick={() => this.setState({ overallRating: 5})} />
            </p>

            <label className='label'>Feel free to ellaborate (optional):</label>
            <p className='control'>
              <textarea className='textarea' name='reviewDesc' placeholder='Provide context for your review (optional)' onChange={this.handleChange} />
            </p>

          </section>
          <footer className='modal-card-foot'>
            <button className='button is-primary' disabled={!this.validateForm()} onClick={this.handleNewReview}>Submit</button>
            <button className='button' onClick={() => HandleModal('new-course-review-form')}>Cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default NewCourseReviewForm;
