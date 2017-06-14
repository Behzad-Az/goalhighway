import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';
import InvalidCharChecker from '../partials/InvalidCharChecker.jsx';

class JobPage extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.formLimits = {
      companyName: { min: 3, max: 60 },
      location: { min: 3, max: 60 },
      title: { min: 3, max: 60 },
      photoName: { min: 4, max: 35 },
      searchTags: { min: 5, max: 250 },
      link: { min: 10, max: 500 }
    };
    this.state = {
      companyName: '',
      location: '',
      title: '',
      kind: '',
      photoName: '',
      searchTags: '',
      link: '',
      searchResults: [],
      showResults: false
    };
    this._handleSearch = this._handleSearch.bind(this);
    this._conditionCompanySearchResults = this._conditionCompanySearchResults.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._clearForm = this._clearForm.bind(this);
    this._validateForm = this._validateForm.bind(this);
  }

  _handleSearch(e) {
    const query = e.target.value;
    this.setState({ companyName: query });
    if (query.length > 2) {
      fetch('/api/searchbar', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          searchType: 'companyName'
        })
      })
      .then(response => response.json())
      .then(resJSON => {
        if (resJSON) { this._conditionCompanySearchResults(resJSON); }
        else { throw 'Server returned false'; }
      })
      .catch(err => console.error('Unable to process search query - ', err));
    } else {
      this.setState({ searchResults: [], showResults: false });
    }
  }

  _conditionCompanySearchResults(resJSON) {
    if (resJSON.searchResults.length) {
      const searchResults = resJSON.searchResults.map(result =>
        <p key={result._source.id} className='result-row valid' onClick={() => this.setState({ companyName: result._source.company_name, showResults: false, searchResults: [] })}>
          <i className='fa fa-briefcase' /> {result._source.company_name}
        </p>
      );
      this.setState({ searchResults, showResults: true });
    }
  }

  _handleChange(e) {
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  _handleNewJobPost() {
    const data = {
      companyName: this.state.companyName,
      location: this.state.location,
      title: this.state.title,
      kind: this.state.kind,
      photoName: this.state.photoName,
      searchTags: this.state.searchTags,
      link: this.state.link
    };
  }

  _clearForm() {
    this.setState({
      companyName: '',
      location: '',
      title: '',
      kind: '',
      photoName: '',
      searchTags: '',
      link: '',
      searchResults: [],
      showResults: false
    });
  }

  _validateForm() {
    return this.state.companyName.length >= this.formLimits.companyName.min &&
           !InvalidCharChecker(this.state.companyName, this.formLimits.companyName.max, 'companyName') &&
           this.state.location.length >= this.formLimits.location.min &&
           !InvalidCharChecker(this.state.location, this.formLimits.location.max, 'jobLocation') &&
           this.state.title.length >= this.formLimits.title.min &&
           !InvalidCharChecker(this.state.title, this.formLimits.title.max, 'jobTitle') &&
           this.state.kind &&
           this.state.photoName.length >= this.formLimits.photoName.min &&
           !InvalidCharChecker(this.state.photoName, this.formLimits.photoName.max, 'jobPhotoName') &&
           this.state.searchTags.length >= this.formLimits.searchTags.min &&
           !InvalidCharChecker(this.state.searchTags, this.formLimits.searchTags.max, 'jobSearchTags') &&
           this.state.link.length >= this.formLimits.link.min &&
           !InvalidCharChecker(this.state.link, this.formLimits.link.max, 'jobLink');
  }

  render() {
    return (
      <div className='new-job-page'>

        <label className='label'>
          Company Name:
          { InvalidCharChecker(this.state.companyName, this.formLimits.companyName.max, 'companyName') && <span className='char-limit'>Invalid</span> }
        </label>
        <div className='search-bar-container'>
          <p className='search-bar control'>
            <input
              className='search-bar input'
              type='text'
              placeholder='stype company name here'
              value={this.state.companyName}
              onChange={this._handleSearch}
              style={{ borderColor: InvalidCharChecker(this.state.companyName, this.formLimits.companyName.max, 'companyName') ? '#9D0600' : '' }} />
          </p>
          <div className={this.state.showResults ? 'search-bar results is-enabled' : 'search-bar results'}>
            { this.state.searchResults }
          </div>
        </div>

        <label className='label'>
          Job Location:
          { InvalidCharChecker(this.state.location, this.formLimits.location.max, 'jobLocation') && <span className='char-limit'>Invalid</span> }
        </label>
        <p className='control'>
          <input
            className='input'
            type='text'
            name='location'
            placeholder='Enter location here'
            value={this.state.location}
            onChange={this._handleChange}
            style={{ borderColor: InvalidCharChecker(this.state.location, this.formLimits.location.max, 'jobLocation') ? '#9D0600' : '' }} />
        </p>

        <label className='label'>
          Position Title:
          { InvalidCharChecker(this.state.title, this.formLimits.title.max, 'jobPosition') && <span className='char-limit'>Invalid</span> }
        </label>
        <p className='control'>
          <input
            className='input'
            type='text'
            name='title'
            placeholder='Enter position title here'
            value={this.state.title}
            onChange={this._handleChange}
            style={{ borderColor: InvalidCharChecker(this.state.title, this.formLimits.title.max, 'jobPosition') ? '#9D0600' : '' }} />
        </p>

        <label className='label'>Select Type of Job:</label>
        <p className='control'>
          <span className='select'>
            <select className='select' name='kind' onChange={this._handleChange} value={this.state.kind}>
              <option value=''>-</option>
              <option value='summer'>Part Time / Summer</option>
              <option value='internship'>Internship / Coop</option>
              <option value='junior'>New Grad / Junior</option>
            </select>
          </span>
        </p>

        <label className='label'>
          Photo Name:
          { InvalidCharChecker(this.state.photoName, this.formLimits.photoName.max, 'jobPhotoName') && <span className='char-limit'>Invalid</span> }
        </label>
        <p className='control'>
          <input
            className='input'
            type='text'
            name='photoName'
            placeholder='Enter photo name here'
            value={this.state.photoName}
            onChange={this._handleChange}
            style={{ borderColor: InvalidCharChecker(this.state.photoName, this.formLimits.photoName.max, 'jobPhotoName') ? '#9D0600' : '' }} />
        </p>

        <label className='label'>
          Search Tags:
          { InvalidCharChecker(this.state.searchTags, this.formLimits.searchTags.max, 'jobSearchTags') && <span className='char-limit'>Invalid</span> }
        </label>
        <p className='control'>
          <input
            className='input'
            type='text'
            name='searchTags'
            placeholder='Enter search tags here'
            value={this.state.searchTags}
            onChange={this._handleChange}
            style={{ borderColor: InvalidCharChecker(this.state.searchTags, this.formLimits.searchTags.max, 'jobSearchTags') ? '#9D0600' : '' }} />
        </p>

        <label className='label'>
          Job Link:
          { InvalidCharChecker(this.state.link, this.formLimits.link.max, 'jobLink') && <span className='char-limit'>Invalid</span> }
        </label>
        <p className='control'>
          <input
            className='input'
            type='text'
            name='link'
            placeholder='Enter job link here'
            value={this.state.link}
            onChange={this._handleChange}
            style={{ borderColor: InvalidCharChecker(this.state.link, this.formLimits.link.max, 'jobLink') ? '#9D0600' : '' }} />
        </p>

        <button className='button is-primary' disabled={!this._validateForm()} onClick={this._handleNewJobPost}>Post New Job</button>
        <button className='button' onClick={this._clearForm}>Clear Form</button>

        { this.reactAlert.container }
      </div>
    );
  }
}

export default JobPage;
