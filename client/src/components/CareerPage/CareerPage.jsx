import React, {Component} from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import ReactAlert from '../partials/ReactAlert.jsx';
import CareerControlBar from './CareerControlBar.jsx';
import JobRow from './JobRow.jsx';
import RightSideBar from '../partials/RightSideBar.jsx';
import SearchBar from '../partials/SearchBar.jsx';

class CareerPage extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.state = {
      dataLoaded: false,
      pageError: false,
      jobs: []
    };
    this.loadComponentData = this.loadComponentData.bind(this);
    this.conditionData = this.conditionData.bind(this);
    this.toggleControlBar = this.toggleControlBar.bind(this);
    this.renderPageAfterData = this.renderPageAfterData.bind(this);
  }

  componentDidMount() {
    this.loadComponentData();
  }

  loadComponentData() {
    $.ajax({
      method: 'GET',
      url: '/api/users/currentuser/jobs',
      dataType: 'JSON',
      success: response => this.conditionData(response)
    });
  }

  conditionData(response) {
    if (response) {
      let jobs = response.map(data => {
        return {
          ...data._source.pin,
          tags: data._source.pin.search_text.split(' ')
        };
      });
      this.setState({ jobs, dataLoaded: true });
    } else {
      this.setState({ dataLoaded: true, pageError: true });
    }
  }

  toggleControlBar() {
    let controlBar = document.getElementById('control-bar');
    let className = controlBar.getAttribute('class');
    controlBar.className = className.includes(' is-enabled') ? 'card control-bar' : 'card control-bar is-enabled';
  }

  renderPageAfterData() {
    if (this.state.dataLoaded && this.state.pageError) {
      return (
        <div className='main-container'>
          <p className='page-msg'>
            <i className='fa fa-exclamation-triangle' aria-hidden='true' />
            Error in loading up the page
          </p>
        </div>
      );
    } else if (this.state.dataLoaded) {
      return (
        <div className='main-container'>
          <SearchBar />
          <h1 className='header'>
            Open positions:
          </h1>
          <div className='career-rows'>
            { this.state.jobs.map((job, index) => <JobRow key={index} job={job} /> ) }
            { !this.state.jobs[0] && <p className='message'>No jobs matching your search...</p> }
          </div>
        </div>
      );
    } else {
      return (
        <div className='main-container'>
          <p className='page-msg'>
            <i className='fa fa-spinner fa-spin fa-3x fa-fw'></i>
            <span className='sr-only'>Loading...</span>
          </p>
        </div>
      );
    }
  }

  render() {
    return (
      <div className='career-page'>
        <Navbar />
        <div className='hamburger'>
          <i className='fa fa-navicon' onClick={this.toggleControlBar} />
        </div>
        <CareerControlBar reload={this.loadComponentData} toggleControlBar={this.toggleControlBar} />
        { this.renderPageAfterData() }
        <RightSideBar />
        { this.reactAlert.container }
      </div>
    );
  }
}

export default CareerPage;
