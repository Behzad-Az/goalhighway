import React, {Component} from 'react';
import { browserHistory } from 'react-router';

class SearhBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      showResults: false
    };
    this._handleSearch = this._handleSearch.bind(this);
    this._navigatePage = this._navigatePage.bind(this);
    this._conditionData = this._conditionData.bind(this);
  }

  _handleSearch(e) {
    if (e.target.value.length > 2) {
      fetch('/api/searchbar', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: e.target.value })
      })
      .then(response => response.json())
      .then(resJSON => {
        if (resJSON) { this._conditionData(resJSON); }
        else { throw 'Server returned false'; }
      })
      .catch(err => console.error('Unable to process search query - ', err));
    } else {
      this.setState({ searchResults: [], showResults: false });
    }
  }

  _conditionData(resJSON) {
    let searchResults = [];
    if (resJSON.searchResults.length) {
      resJSON.searchResults.forEach((result, index) => {
        switch (result._type) {
          case 'document':
            searchResults.push(
              <p key={index} className='result-row valid' onClick={() => this._navigatePage(`/courses/${result._source.course_id}/docs/${result._source.id}`)}>
                <i className='fa fa-file-text' /> {result._source.course_name} <i className='fa fa-arrow-right' /> {result._source.title}
              </p>);
            break;
          case 'course':
            searchResults.push(
              <p key={index} className='result-row valid' onClick={() => this._navigatePage(`/courses/${result._source.id}`)}>
                <i className='fa fa-users' /> {result._source.title}
              </p>
            );
            break;
          case 'institution':
            searchResults.push(
              <p key={index} className='result-row valid' onClick={() => this._navigatePage(`/institutions/${result._source.id}`)}>
                <i className='fa fa-graduation-cap' /> {result._source.inst_name}
              </p>
            );
            break;
          case 'company':
            searchResults.push(
              <p key={index} className='result-row valid' onClick={() => this._navigatePage(`/companies/${result._source.id}`)}>
                <i className='fa fa-briefcase' /> {result._source.company_name}
              </p>
            );
            break;
        }
      });
    } else {
      searchResults.push(
        <p key={1} className='result-row'>
          No results matching...
        </p>
      );
    }
    this.setState({ searchResults, showResults: true });
  }

  _navigatePage(link) {
    this.setState({ searchResults: [], showResults: false });
    browserHistory.push(link);
  }

  render() {
    return (
      <div className='search-bar-container'>
        <p className='search-bar control has-icon'>
          <input className='search-bar input is-medium' type='test' placeholder='search courses, documents and employers here...' onChange={this._handleSearch} />
          <span className='icon is-medium'>
            <i className='fa fa-search' />
          </span>
        </p>
        <div className={this.state.showResults ? 'search-bar results is-enabled' : 'search-bar results'}>
          { this.state.searchResults }
        </div>
      </div>
    );
  }
}

export default SearhBar;
