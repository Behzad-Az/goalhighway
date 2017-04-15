import React, {Component} from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import TopRow from './TopRow.jsx';
import JobsContainer from './JobsContainer.jsx';
import QaContainer from './QaContainer.jsx';
import NewQuestionForm from './NewQuestionForm.jsx';
import LeftSideBar from '../partials/LeftSideBar.jsx';
import RightSideBar from '../RightSideBar/RightSideBar.jsx';
import SearchBar from '../partials/SearchBar.jsx';

class CompanyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      companyInfo: {},
      qas: [],
      jobs: []
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._renderPageAfterData = this._renderPageAfterData.bind(this);
  }

  componentDidMount() {
    this._loadComponentData(this.props.routeParams.company_id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.routeParams.company_id !== this.state.companyInfo.id) {
      this._loadComponentData(nextProps.routeParams.company_id);
    }
  }

  _loadComponentData(companyId) {
    companyId = companyId || this.state.companyInfo.id;
    fetch(`/api/companies/${companyId}`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  _conditionData(resJSON) {
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

  _renderPageAfterData() {
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
          <TopRow companyInfo={this.state.companyInfo} />
          <NewQuestionForm companyInfo={this.state.companyInfo} reload={this._loadComponentData} />
          <JobsContainer jobs={this.state.jobs} />
          <QaContainer qas={this.state.qas} reload={this._loadComponentData} companyId={this.state.companyInfo.id} />
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
      <div className='company-page'>
        <Navbar />
        <LeftSideBar />
        { this._renderPageAfterData() }
        <RightSideBar />
      </div>
    );
  }
}

export default CompanyPage;
