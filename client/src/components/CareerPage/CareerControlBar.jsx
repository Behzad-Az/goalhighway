import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';

class CareerControlBar extends Component {
  constructor(props) {
    super(props);
    this.dataLoaded = false;
    this.preferenceTags = ['aerospace', 'automation', 'automotive', 'design', 'electrical', 'energy', 'engineer', 'instrumentation', 'manufacturing', 'mechanical', 'military', 'mining', 'naval', 'programming', 'project-management', 'QA/QC', 'R&D', 'robotics', 'software'];
    this.reactAlert = new ReactAlert();
    this.state = {
      dataLoaded: false,
      username: '',
      postalCode: '',
      jobDistance: '',
      jobKind: [],
      jobQuery: [],
      tagFilterPhrase: ''
    };
    this.conditionData = this.conditionData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleJobKind = this.handleJobKind.bind(this);
    this.moveUpTag = this.moveUpTag.bind(this);
    this.moveDownTag = this.moveDownTag.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleUpdateSearch = this.handleUpdateSearch.bind(this);
    this.filterPreferenceTags = this.filterPreferenceTags.bind(this);
  }

  componentDidMount() {
    fetch('/api/users/currentuser', {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this.conditionData(resJSON))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  conditionData(resJSON) {
    if (resJSON) {
      let jobQuery = resJSON.job_query;
      let jobKind = resJSON.job_kind;

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

      this.dataLoaded = true;
      this.setState({
        username: resJSON.username,
        postalCode: resJSON.postal_code ? resJSON.postal_code.toUpperCase() : '',
        jobDistance: resJSON.job_distance ? resJSON.job_distance : '',
        jobKind,
        jobQuery
      });
    } else {
      throw 'Server returned false';
    }
  }

  handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  handleJobKind(e) {
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

  moveUpTag(e) {
    let selectedTag = e.target.innerHTML;
    let jobQuery = this.state.jobQuery;
    jobQuery.push(selectedTag);
    let index = this.preferenceTags.findIndex(tag => tag === selectedTag);
    this.preferenceTags.splice(index, 1);
    let tagFilterPhrase = '';
    this.setState({ jobQuery, tagFilterPhrase });
  }

  moveDownTag(selectedTag) {
    let jobQuery = this.state.jobQuery;
    let index = jobQuery.find(tag => tag === selectedTag);
    jobQuery.splice(index, 1);
    this.preferenceTags.push(selectedTag);
    this.preferenceTags.sort((a,b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);
    this.setState({ jobQuery });
  }

  filterPreferenceTags() {
    let tempArr = this.state.tagFilterPhrase ? this.preferenceTags.filter(tag => tag.includes(this.state.tagFilterPhrase)) : this.preferenceTags;
    return tempArr[0] ? tempArr.map((tag, index) => <span key={index} className='tag' onClick={this.moveUpTag}>{tag}</span>) : <p>No matching tags found...</p>;
  }

  validateForm() {
    return this.state.postalCode &&
           this.state.jobDistance &&
           this.state.jobQuery[0] &&
           this.state.jobKind[0]
  }

  handleUpdateSearch() {
    let data = {
      type: 'job',
      postalCode: this.state.postalCode,
      jobDistance: this.state.jobDistance,
      jobKind: this.state.jobKind.join(' '),
      jobQuery: this.state.jobQuery.join(' ')
    };

    fetch('/api/users/currentuser', {
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
        this.reactAlert.showAlert('search profile updated', 'info');
        this.props.reload();
      } else { throw 'Server returned false'; }
    })
    .catch(() => this.reactAlert.showAlert('Unable to update search criteria', 'error'))
    .then(this.props.toggleControlBar);
  }

  render() {
    return this.dataLoaded ? (
      <div id='control-bar' className='card control-bar'>

        <div className='card-content'>

          <div className='media'>
            <div className='media-content'>
              <p className='title is-4'>Jobs for {this.state.username}</p>
            </div>
          </div>

          <div className='content'>

            <label className='label'>Search Area:</label>
            <div className='geo-criteria'>
              <p className='control'>
                <input className='input' type='text' name='postalCode' placeholder='postal code' onChange={this.handleChange} defaultValue={this.state.postalCode} />
              </p>

              <p className='control'>
                <span className='select'>
                  <select name='jobDistance' onChange={this.handleChange} defaultValue={this.state.jobDistance}>
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
                <input type='checkbox' name='jobKind' value='summer' onChange={this.handleJobKind} checked={this.state.jobKind.includes('summer')} />
                Summer/Part-Time
              </label>
              <label className='checkbox'>
                <input type='checkbox' name='jobKind' value='internship' onChange={this.handleJobKind} checked={this.state.jobKind.includes('internship')} />
                Intern/Coop
              </label>
              <label className='checkbox'>
                <input type='checkbox' name='jobKind' value='junior' onChange={this.handleJobKind} checked={this.state.jobKind.includes('junior')} />
                Junior
              </label>
              <label className='checkbox'>
                <input type='checkbox' name='jobKind' value='senior' onChange={this.handleJobKind} checked={this.state.jobKind.includes('senior')} />
                Senior
              </label>
            </p>

            <label className='label'>My preferenence tages:</label>
            <div className='control'>
              { this.state.jobQuery.map((tag, index) => <span key={index} className='tag' onClick={() => this.moveDownTag(tag)}>{tag}</span>) }
              { !this.state.jobQuery[0] && <p>Select tags from the list below...</p> }
            </div>

            <p className='control'>
              <button className='button is-primary' disabled={!this.validateForm()} onClick={this.handleUpdateSearch}>Update</button>
            </p>

            <hr />

            <p className='control'>
              <input className='input' type='text' name='tagFilterPhrase' placeholder='search for tags' onChange={this.handleChange}/>
            </p>

            <div className='tags-list'>
              { this.filterPreferenceTags() }
            </div>
          </div>
        </div>
      </div>
    ) : <p></p>;
  }
}

export default CareerControlBar;
