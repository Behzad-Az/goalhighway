import React, {Component} from 'react';
import { Link } from 'react-router';

class SearhBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: []
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.conditionData = this.conditionData.bind(this);
    this.showSearchResults = this.showSearchResults.bind(this);
  }

  handleSearch(e) {
    if (e.target.value.length > 2) {
      $.ajax({
        method: 'POST',
        url: '/api/searchbar',
        data: { query: e.target.value },
        success: response => {
          response ? this.conditionData(response) : console.error("Error in server 0: ", response);
        }
      });
    } else {
      this.setState({ searchResults: [] });
      this.showSearchResults(false);
    }
  }

  conditionData(response) {
    let searchResults = [];
    if (response.length) {
      response.forEach((result, index) => {
        switch (result._type) {
          case "document":
            searchResults.push(
              <p key={index}>
                <Link onClick={() => this.showSearchResults(false)} to={`/courses/${result._source.course_id}/docs/${result._source.id}`}>
                <i className="fa fa-file-text" />
                {result._source.course_name} <i className="fa fa-arrow-right" /> {result._source.title}</Link>
              </p>);
            break;
          case "course":
            searchResults.push(<p key={index}><Link onClick={() => this.showSearchResults(false)} to={`/courses/${result._source.id}`}><i className="fa fa-users" />{result._source.title}</Link></p>);
            break;
          case "institution":
            searchResults.push(<p key={index}><Link onClick={() => this.showSearchResults(false)} to={`/institutions/${result._source.id}`}><i className="fa fa-graduation-cap" />{result._source.inst_name}</Link></p>);
            break;
          case "company":
            searchResults.push(<p key={index}><Link onClick={() => this.showSearchResults(false)} to={`/companies/${result._source.id}`}><i className="fa fa-institution" />{result._source.company_name}</Link></p>);
            break;
        };
      });
    } else {
      searchResults.push(<p key={1}>No results matching...</p>);
    }
    this.setState({ searchResults });
    this.showSearchResults(true);
  }

  showSearchResults(enabled) {
    let searchResults = document.getElementById("search-result-list");
    searchResults.className = enabled ? "search-bar results is-enabled" : "search-bar results";
  }

  render() {
    return (
      <div className="search-bar-container">
        <p className="search-bar control has-icon">
          <input className="search-bar input is-medium" type="test" placeholder="search courses, documents and employers here..." onChange={this.handleSearch} />
          <span className="icon is-medium">
            <i className="fa fa-search" />
          </span>
        </p>
        <div id="search-result-list" className="search-bar results">
          { this.state.searchResults }
        </div>
      </div>
    );
  }
}

export default SearhBar;
