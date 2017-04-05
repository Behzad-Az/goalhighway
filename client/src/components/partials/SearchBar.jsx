import React, {Component} from 'react';
import { Link } from 'react-router';

class SearhBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: []
    };
    this._handleSearch = this._handleSearch.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._showSearchResults = this._showSearchResults.bind(this);
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
      this.setState({ searchResults: [] });
      this._showSearchResults(false);
    }
  }

  _conditionData(resJSON) {
    let searchResults = [];
    if (resJSON.length) {
      resJSON.forEach((result, index) => {
        switch (result._type) {
          case 'document':
            searchResults.push(
              <p key={index}>
                <Link onClick={() => this._showSearchResults(false)} to={`/courses/${result._source.course_id}/docs/${result._source.id}`}>
                <i className='fa fa-file-text' /> {result._source.course_name} <i className='fa fa-arrow-right' /> {result._source.title}</Link>
              </p>);
            break;
          case 'course':
            searchResults.push(<p key={index}><Link onClick={() => this._showSearchResults(false)} to={`/courses/${result._source.id}`}><i className='fa fa-users' /> {result._source.title}</Link></p>);
            break;
          case 'institution':
            searchResults.push(<p key={index}><Link onClick={() => this._showSearchResults(false)} to={`/institutions/${result._source.id}`}><i className='fa fa-graduation-cap' /> {result._source.inst_name}</Link></p>);
            break;
          case 'company':
            searchResults.push(<p key={index}><Link onClick={() => this._showSearchResults(false)} to={`/companies/${result._source.id}`}><i className='fa fa-briefcase' /> {result._source.company_name}</Link></p>);
            break;
        }
      });
    } else {
      searchResults.push(<p key={1}>No results matching...</p>);
    }
    this.setState({ searchResults });
    this._showSearchResults(true);
  }

  _showSearchResults(enabled) {
    let searchResults = document.getElementById('search-result-list');
    searchResults.className = enabled ? 'search-bar results is-enabled' : 'search-bar results';
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
        <div id='search-result-list' className='search-bar results'>
          { this.state.searchResults }
        </div>
      </div>
    );
  }
}

export default SearhBar;
