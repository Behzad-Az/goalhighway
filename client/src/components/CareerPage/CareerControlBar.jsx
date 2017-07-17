import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';
import InvalidCharChecker from '../partials/InvalidCharChecker.jsx';

class CareerControlBar extends Component {
  constructor(props) {
    super(props);
    this.preferenceTags = ['aerospace', 'automation', 'automotive', 'design', 'electrical', 'energy', 'engineer', 'instrumentation', 'manufacturing', 'mechanical', 'military', 'mining', 'naval', 'programming', 'project-management', 'QA/QC', 'R&D', 'robotics', 'software'];
    this.reactAlert = new ReactAlert();
    this.formLimits = {
      postalCode: { min: 5, max: 10 },
      jobKind: { min: 3, max: 100 },
      jobQuery: { min: 3, max: 250 }
    };
    this.state = {
      dataLoaded: false,
      username: '',
      postalCode: '',
      jobDistance: '',
      jobKind: [],
      jobQuery: [],
      tagFilterPhrase: ''
    };
    this._conditionData = this._conditionData.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._handleJobKind = this._handleJobKind.bind(this);
    this._moveUpTag = this._moveUpTag.bind(this);
    this._moveDownTag = this._moveDownTag.bind(this);
    this._validateForm = this._validateForm.bind(this);
    this._handleUpdateSearch = this._handleUpdateSearch.bind(this);
    this._filterPreferenceTags = this._filterPreferenceTags.bind(this);
  }

  componentDidMount() {
    fetch('/api/users/currentuser', {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  _conditionData(resJSON) {
    if (resJSON) {
      let jobQuery = resJSON.userInfo.job_query;
      let jobKind = resJSON.userInfo.job_kind;
      jobKind = jobKind ? jobKind.split(' ') : [];

      if (jobQuery) {
        jobQuery = jobQuery.split(' ');
        jobQuery.forEach(query => {
          if (this.preferenceTags.includes(query)) {
            let index = this.preferenceTags.indexOf(query);
            this.preferenceTags.splice(index, 1);
          }
        });
      } else {
        jobQuery = [];
      }

      this.setState({
        username: resJSON.userInfo.username,
        postalCode: resJSON.userInfo.postal_code ? resJSON.userInfo.postal_code : '',
        jobDistance: resJSON.userInfo.job_distance ? resJSON.userInfo.job_distance : '',
        dataLoaded: true,
        jobKind,
        jobQuery
      });
    } else {
      throw 'Server returned false';
    }
  }

  _handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  _handleJobKind(e) {
    let jobKind = this.state.jobKind;
    let value = e.target.value;
    if (e.target.checked && !jobKind.includes(value)) {
      jobKind.push(value);
    } else if (!e.target.checked && jobKind.includes(value)) {
      let index = jobKind.indexOf(value);
      jobKind.splice(index, 1);
    }
    this.setState({ jobKind });
  }

  _moveUpTag(e) {
    let selectedTag = e.target.innerHTML;
    let jobQuery = this.state.jobQuery;
    jobQuery.push(selectedTag);
    let index = this.preferenceTags.findIndex(tag => tag === selectedTag);
    this.preferenceTags.splice(index, 1);
    let tagFilterPhrase = '';
    this.setState({ jobQuery, tagFilterPhrase });
  }

  _moveDownTag(selectedTag) {
    let jobQuery = this.state.jobQuery;
    let index = jobQuery.find(tag => tag === selectedTag);
    jobQuery.splice(index, 1);
    this.preferenceTags.push(selectedTag);
    this.preferenceTags.sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);
    this.setState({ jobQuery });
  }

  _filterPreferenceTags() {
    let tempArr = this.state.tagFilterPhrase ? this.preferenceTags.filter(tag => tag.includes(this.state.tagFilterPhrase)) : this.preferenceTags;
    return tempArr[0] ? tempArr.map((tag, index) => <span key={index} className='tag' onClick={this._moveUpTag}>{tag}</span>) : <p>No matching tags found...</p>;
  }

  _validateForm() {
    return this.state.postalCode.length >= this.formLimits.postalCode.min &&
           !InvalidCharChecker(this.state.postalCode, this.formLimits.postalCode.max, 'userPostalCode') &&
           this.state.jobDistance &&
           this.state.jobQuery[0] &&
           this.state.jobQuery.join(' ').length <= this.formLimits.jobQuery.max &&
           this.state.jobKind[0];
  }

  _handleUpdateSearch() {
    let data = {
      type: 'job',
      postalCode: this.state.postalCode,
      jobDistance: this.state.jobDistance,
      jobKind: this.state.jobKind.join(' '),
      jobQuery: this.state.jobQuery.join(' ')
    };

    fetch('/api/users/currentuser', {
      method: 'PUT',
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
        this.reactAlert.showAlert('search profile updated', 'info');
        this.props.reload();
      } else { throw 'Server returned false'; }
    })
    .catch(() => this.reactAlert.showAlert('Unable to update search criteria', 'error'))
    .then(this.props.toggleControlBar);
  }

  render() {
    return this.state.dataLoaded ? (
      <div id='control-bar' className='card control-bar'>

        <div className='card-content'>
          <div className='media'>
            <div className='media-content'>
              <p className='title is-4'>Jobs for {this.state.username}</p>
            </div>
          </div>
          <div className='content'>
            <label className='label'>
              Search Area:
              { InvalidCharChecker(this.state.postalCode, this.formLimits.postalCode.max, 'postalCode') && <span className='char-limit'>Invalid</span> }
            </label>
            <div className='geo-criteria'>
              <p className='control'>
                <input
                  className='input'
                  type='text'
                  name='postalCode'
                  placeholder='postal code'
                  defaultValue={this.state.postalCode}
                  onChange={this._handleChange}
                  style={{ borderColor: InvalidCharChecker(this.state.postalCode, this.formLimits.postalCode.max, 'postalCode') ? '#9D0600' : '' }} />
              </p>

              <p className='control'>
                <span className='select'>
                  <select name='jobDistance' onChange={this._handleChange} defaultValue={this.state.jobDistance}>
                    <option value=''>Range</option>
                    <option value={10}>10km</option>
                    <option value={20}>20km</option>
                    <option value={30}>30km</option>
                    <option value={50}>50km</option>
                    <option value={100}>100km</option>
                    <option value={9000}>All</option>
                  </select>
                </span>
              </p>
            </div>

            <label className='label'>Categories:</label>
            <p className='categories control'>
              <label className='checkbox'>
                <input type='checkbox' name='jobKind' value='summer' onChange={this._handleJobKind} checked={this.state.jobKind.includes('summer')} />
                Summer / Part-Time
              </label>
              <label className='checkbox'>
                <input type='checkbox' name='jobKind' value='internship' onChange={this._handleJobKind} checked={this.state.jobKind.includes('internship')} />
                Intern / Coop
              </label>
              <label className='checkbox'>
                <input type='checkbox' name='jobKind' value='junior' onChange={this._handleJobKind} checked={this.state.jobKind.includes('junior')} />
                New-Grad / Junior
              </label>
            </p>

            <label className='label'>My preferenence tages:</label>
            <div className='control'>
              { this.state.jobQuery.map((tag, index) => <span key={index} className='tag' onClick={() => this._moveDownTag(tag)}>{tag}</span>) }
              { !this.state.jobQuery[0] && <p>Select tags from the list below...</p> }
            </div>

            <p className='control'>
              <button className='button is-primary' disabled={!this._validateForm()} onClick={this._handleUpdateSearch}>Update</button>
            </p>

            <hr />

            <p className='control'>
              <input className='input' type='text' name='tagFilterPhrase' placeholder='search for tags' onChange={this._handleChange}/>
            </p>

            <div className='tags-list'>
              { this._filterPreferenceTags() }
            </div>
          </div>
        </div>
      </div>
    ) : <p></p>;
  }
}

export default CareerControlBar;
