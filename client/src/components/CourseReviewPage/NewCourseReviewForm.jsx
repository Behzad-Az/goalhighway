import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';
import AutoSuggestion from '../partials/AutoSuggestion.jsx';
import SingleSelect from '../partials/SingleSelect.jsx';

class NewCourseReviewForm extends Component {
  constructor(props) {
    super(props);
    this.months = [ { value: '', label: 'select month' }, { value: 'Balls', label: 'Balls' },
      { value: 'Jan', label: 'Jan' }, { value: 'Feb', label: 'Feb' }, { value: 'Mar', label: 'Mar' }, { value: 'Apr', label: 'Apr' },
      { value: 'May', label: 'May' }, { value: 'Jun', label: 'Jun' }, { value: 'Jul', label: 'Jul' }, { value: 'Aug', label: 'Aug' },
      { value: 'Sep', label: 'Sep' }, { value: 'Oct', label: 'Oct' }, { value: 'Nov', label: 'Nov' }, { value: 'Dec', label: 'Dec' }
    ];
    this.years = [ { value: '', label: 'select year' },
      { value: 2017, label: 2017 }, { value: 2016, label: 2016 }, { value: 2015, label: 2015 }, { value: 2014, label: 2014 },
      { value: 2013, label: 2013 }, { value: 2012, label: 2012 }, { value: 2011, label: 2011 }, { value: 2010, label: 2010 },
      { value: 2009, label: 2009 }, { value: 2008, label: 2008 }, { value: 2007, label: 2007 }, { value: 2006, label: 2006 }
    ];
    this.formLimits = {
      reviewDesc: 500,
      profName: 60
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
    this._handleSelectProf = this._handleSelectProf.bind(this);
    this._handleSelectYear = this._handleSelectYear.bind(this);
    this._handleSelectMonth = this._handleSelectMonth.bind(this);
    this._validateForm = this._validateForm.bind(this);
    this._handleNewReview = this._handleNewReview.bind(this);
  }

  _handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  _handleSelectProf(profName) {
    this.setState({ profName });
  }

  _handleSelectYear(startYear) {
    this.setState({ startYear: startYear });
  }

  _handleSelectMonth(startMonth) {
    this.setState({ startMonth });
  }

  _validateForm() {
    return this.state.startYear &&
           this.state.startMonth &&
           this.state.workloadRating &&
           this.state.fairnessRating &&
           this.state.profRating &&
           this.state.overallRating &&
           this.state.reviewDesc.length <= this.formLimits.reviewDesc &&
           this.state.profName.length <= this.formLimits.profName;
  }

  _handleNewReview() {
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
            <div className='columns'>
              <div className='column is-6'>
                <SingleSelect disabled={false} initialValue={this.state.startYear} name='startYear' options={this.years} handleChange={this._handleSelectYear} />
              </div>
              <div className='column is-6'>
                <SingleSelect disabled={false} initialValue={this.state.startMonth} name='startMonth' options={this.months} handleChange={this._handleSelectMonth} />
              </div>
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
                { this.state.profName.length > this.formLimits.profName && <span className='char-limit'>too long!</span> }
              </label>
              <AutoSuggestion options={this.props.profs} onChange={this._handleSelectProf} />
            </div>

            <p className='control'>
              <label className='label'>Overall satisfaction with the course?</label>
              <i className={ this.state.tempStars >= 1 || this.state.overallRating >= 1 ? 'fa fa-star' : 'fa fa-star-o'} aria-hidden='true' onMouseOver={() => this.setState({ tempStars: 1 })} onMouseLeave={() => this.setState({ tempStars: 0 })} onClick={() => this.setState({ overallRating: 1})} />
              <i className={ this.state.tempStars >= 2 || this.state.overallRating >= 2 ? 'fa fa-star' : 'fa fa-star-o'} aria-hidden='true' onMouseOver={() => this.setState({ tempStars: 2 })} onMouseLeave={() => this.setState({ tempStars: 0 })} onClick={() => this.setState({ overallRating: 2})} />
              <i className={ this.state.tempStars >= 3 || this.state.overallRating >= 3 ? 'fa fa-star' : 'fa fa-star-o'} aria-hidden='true' onMouseOver={() => this.setState({ tempStars: 3 })} onMouseLeave={() => this.setState({ tempStars: 0 })} onClick={() => this.setState({ overallRating: 3})} />
              <i className={ this.state.tempStars >= 4 || this.state.overallRating >= 4 ? 'fa fa-star' : 'fa fa-star-o'} aria-hidden='true' onMouseOver={() => this.setState({ tempStars: 4 })} onMouseLeave={() => this.setState({ tempStars: 0 })} onClick={() => this.setState({ overallRating: 4})} />
              <i className={ this.state.tempStars >= 5 || this.state.overallRating >= 5 ? 'fa fa-star' : 'fa fa-star-o'} aria-hidden='true' onMouseOver={() => this.setState({ tempStars: 5 })} onMouseLeave={() => this.setState({ tempStars: 0 })} onClick={() => this.setState({ overallRating: 5})} />
            </p>

            <label className='label'>
              Feel free to ellaborate (optional):
              { this.state.reviewDesc.length > this.formLimits.reviewDesc && <span className='char-limit'>too long!</span> }
            </label>
            <p className='control'>
              <textarea
                className='textarea'
                name='reviewDesc'
                placeholder='Provide context for your review (optional)'
                onChange={this._handleChange}
                style={{ borderColor: this.state.reviewDesc.length > this.formLimits.reviewDesc ? '#9D0600' : '' }} />
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
