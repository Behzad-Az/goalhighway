import React, {Component} from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import TopRow from './TopRow.jsx';
import JobsContainer from './JobsContainer.jsx';
import QaContainer from './QaContainer.jsx';
import LeftSideBar from '../partials/LeftSideBar.jsx';
import RightSideBar from '../RightSideBar/RightSideBar.jsx';
import SearchBar from '../partials/SearchBar.jsx';

class CompanyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      companyInfo: {
        id: this.props.routeParams.company_id,
      },
      qas: [],
      jobs: []
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._renderPageAfterData = this._renderPageAfterData.bind(this);
  }

  componentDidMount() {
    document.title = 'GoalHwy - Company Page';
    this._loadComponentData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.routeParams.company_id !== this.state.companyInfo.id) {
      this._loadComponentData(nextProps.routeParams.company_id);
    }
  }

  _loadComponentData(companyId) {
    fetch(`/api/companies/${companyId || this.state.companyInfo.id}`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  _conditionData(resJSON) {
    if (resJSON) {
      const jobs = resJSON.jobs.map(data => {
        return {
          ...data._source.pin,
          tags: data._source.pin.search_text.split(' ')
        };
      });
      document.title = `GoalHwy - ${resJSON.companyInfo.name}`;
      this.setState({
        companyInfo: resJSON.companyInfo,
        qas: resJSON.qas,
        jobs,
        dataLoaded: true
      });

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
          <TopRow companyInfo={this.state.companyInfo} reload={this._loadComponentData} />
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
