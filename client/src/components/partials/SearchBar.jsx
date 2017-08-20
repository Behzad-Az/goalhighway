import React, {Component} from 'react';
import { browserHistory } from 'react-router';

class SearhBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      highlightedRow: -1,
      searchResults: [],
      showResults: false
    };

    this._validateSearchQuery = this._validateSearchQuery.bind(this);
    this._handleSearch = this._handleSearch.bind(this);
    this._navigatePage = this._navigatePage.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._scrollSearchResults = this._scrollSearchResults.bind(this);
    this._renderSearchResults = this._renderSearchResults.bind(this);
  }

  _validateSearchQuery(query) {
    return query.length >= 3 && query.length <= 40 &&
           query.search(/[^a-zA-Z0-9\ \-\(\)\'\\/\\.]/) == -1;
  }

  _handleSearch(e) {
    const query = e.target.value.trim();
    if (this._validateSearchQuery(query)) {
      fetch(`/api/searchbar?query=${query}&searchType=mainSearchBar`, {
        method: 'GET',
        credentials: 'same-origin'
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
    this.setState({ searchResults: resJSON.searchResults, showResults: true });
  }

  _navigatePage(link) {
    this.setState({ searchResults: [], showResults: false });
    browserHistory.push(link);
  }

  _scrollSearchResults(e) {
    if (e.key === 'ArrowDown' && this.state.searchResults.length - 1 > this.state.highlightedRow) {
      this.setState({ highlightedRow: this.state.highlightedRow + 1 });
    } else if (e.key === 'ArrowUp' && this.state.highlightedRow > -1) {
      this.setState({ highlightedRow: this.state.highlightedRow - 1 });
    } else if (e.key === 'Enter' && this.state.highlightedRow > -1) {
      const result = this.state.searchResults[this.state.highlightedRow];
      switch (result._type) {
        case 'document':
          this._navigatePage(`/courses/${result._source.course_id}/docs/${result._id}`);
          break;
        case 'course':
          this._navigatePage(`/courses/${result._id}`);
          break;
        case 'institution':
          this._navigatePage(`/institutions/${result._source.inst_id}`);
          break;
        case 'company':
          this._navigatePage(`/companies/${result._source.id}`);
          break;
        default:
          break;
      }
    }
  }

  _renderSearchResults() {
    console.log("i'm here 0: searchResults");
    let searchResults = [];
    if (this.state.searchResults.length) {
      this.state.searchResults.forEach((result, index) => {
        switch (result._type) {
          case 'document':
            searchResults.push(
              <p key={index}
                 className={this.state.highlightedRow === index ? 'result-row valid highlighted' : 'result-row valid'}
                 onClick={() => this._navigatePage(`/courses/${result._source.course_id}/docs/${result._id}`)}>
                <i className='fa fa-file-text' /> {result._source.course_name} <i className='fa fa-arrow-right' /> {result._source.title}
              </p>);
            break;
          case 'course':
            searchResults.push(
              <p key={index}
                 className={this.state.highlightedRow === index ? 'result-row valid highlighted' : 'result-row valid'}
                 onClick={() => this._navigatePage(`/courses/${result._id}`)}>
                <i className='fa fa-users' /> {result._source.title}
              </p>
            );
            break;
          case 'institution':
            searchResults.push(
              <p key={index}
                 className={this.state.highlightedRow === index ? 'result-row valid highlighted' : 'result-row valid'}
                 onClick={() => this._navigatePage(`/institutions/${result._source.inst_id}`)}>
                <i className='fa fa-graduation-cap' /> {result._source.name}
              </p>
            );
            break;
          case 'company':
            searchResults.push(
              <p key={index}
                 className={this.state.highlightedRow === index ? 'result-row valid highlighted' : 'result-row valid'}
                 onClick={() => this._navigatePage(`/companies/${result._source.id}`)}>
                <i className='fa fa-briefcase' /> {result._source.name}
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
    return searchResults;
  }

  render() {
    return (
      <div className='search-bar-container'>
        <p className='search-bar control has-icon'>
          <input
            className='search-bar input is-medium'
            type='text'
            placeholder='search courses, documents and employers here...'
            onKeyUp={this._scrollSearchResults}
            onChange={this._handleSearch} />
          <span className='icon is-medium'>
            <i className='fa fa-search' />
          </span>
        </p>
        <div className={this.state.showResults ? 'search-bar results is-enabled' : 'search-bar results'}>
          { this._renderSearchResults() }
        </div>
      </div>
    );
  }
}

export default SearhBar;
