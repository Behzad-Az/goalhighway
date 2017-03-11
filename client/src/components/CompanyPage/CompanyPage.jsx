import React, {Component} from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import TopRow from './TopRow.jsx';
import QaRow from './QaRow.jsx';
import JobRow from './JobRow.jsx';
import NewQuestionForm from './NewQuestionForm.jsx';
import LeftSideBar from '../partials/LeftSideBar.jsx';
import RightSideBar from '../partials/RightSideBar.jsx';
import SearchBar from '../partials/SearchBar.jsx';

class CompanyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      companyInfo: {},
      questions: [],
      jobs: []
    };
    this.loadComponentData = this.loadComponentData.bind(this);
    this.conditionData = this.conditionData.bind(this);
    this.renderPageAfterData = this.renderPageAfterData.bind(this);
  }

  componentDidMount() {
    this.loadComponentData(this.props.routeParams.company_id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.routeParams.company_id !== this.state.companyInfo.id) {
      this.loadComponentData(nextProps.routeParams.company_id);
    }
  }

  loadComponentData(companyId) {
    companyId = companyId || this.state.companyInfo.id;
    fetch(`/api/companies/${companyId}`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this.conditionData(resJSON))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  conditionData(resJSON) {
    if (resJSON) {
      let jobs = resJSON.jobs.map(data => {
        return {
          ...data._source.pin,
          tags: data._source.pin.search_text.split(' ')
        };
      });
      resJSON.jobs = jobs;
      resJSON.dataLoaded = true;
      this.setState(resJSON);
    } else {
      throw 'Server returned false';
    }
  }

  renderPageAfterData() {
    if (this.state.dataLoaded && this.state.pageError) {
      return (
        <div className="main-container">
          <p className="page-msg">
            <i className="fa fa-exclamation-triangle" aria-hidden="true" />
            Error in loading up the page
          </p>
        </div>
      );
    } else if (this.state.dataLoaded) {
      return (
        <div className="main-container">
          <SearchBar />
          <TopRow companyInfo={this.state.companyInfo} />
          <NewQuestionForm companyInfo={this.state.companyInfo} reload={this.loadComponentData} />
          <h1 className="header">
            Open Positions:
            <i className="fa fa-angle-down" aria-hidden="true" />
          </h1>
          <div className="job-rows">
            { this.state.jobs.map((job, index) => <JobRow key={index} job={job} />) }
          </div>
          <h1 className="header">
            Interview Questions / Answers:
            <i className="fa fa-angle-down" aria-hidden="true" />
          </h1>
          <div className="qa-rows">
            { this.state.questions.map((qa, index) => <QaRow key={index} qa={qa} reload={this.loadComponentData} companyId={this.state.companyInfo.id} />) }
          </div>
        </div>
      );
    } else {
      return (
        <div className="main-container">
          <p className="page-msg">
            <i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
            <span className="sr-only">Loading...</span>
          </p>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="company-page">
        <Navbar />
        <LeftSideBar />
        { this.renderPageAfterData() }
        <RightSideBar />
      </div>
    );
  }
}

export default CompanyPage;
