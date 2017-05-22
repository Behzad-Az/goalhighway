import React, {Component} from 'react';
import JobRow from './JobRow.jsx';

class JobsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      companyId: this.props.companyId,
      jobs: [],
      noMoreFeeds: false,
      parentState: this.props.parentState
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._renderLoadMoreBtn = this._renderLoadMoreBtn.bind(this);
    this._renderCompAfterData = this._renderCompAfterData.bind(this);
  }

  componentDidMount() {
    this._loadComponentData(false);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.companyId !== this.state.companyId) {
      this.setState({ companyId: nextProps.companyId });
      this._loadComponentData(true, nextProps.companyId);
    }
    if (nextProps.parentState !== this.state.parentState) {
      this.setState({ parentState: nextProps.parentState });
      this._loadComponentData(true);
    }
  }

  _loadComponentData(freshReload, companyId) {
    fetch(`/api/companies/${companyId || this.state.companyId}/jobs?jobsoffset=${freshReload ? 0 : this.state.jobs.length}`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON, freshReload))
    .catch((err) => {
      this.setState({ dataLoaded: true, pageError: true });
    });
  }

  _conditionData(resJSON, freshReload) {
    if (resJSON) {
      const newJobs = resJSON.jobs.map(data => {
        return {
          ...data._source.pin,
          tags: data._source.pin.search_text.split(' ')
        };
      });
      this.setState({
        jobs: freshReload ? newJobs : this.state.jobs.concat(newJobs),
        dataLoaded: true,
        noMoreFeeds: !newJobs.length
      });
    } else {
      throw 'Server returned false';
    }
  }

  _renderLoadMoreBtn() {
    if (this.state.jobs.length) {
      const btnContent = this.state.noMoreFeeds && this.state.jobs.length ? 'All jobs shown' : 'Load More';
      return (
        <p className='end-msg'>
          <button className='button is-link' disabled={this.state.noMoreFeeds} onClick={() => this._loadComponentData(false)}>{btnContent}</button>
        </p>
      );
    } else {
      return <p>No open position available.</p>;
    }
  }

  _renderCompAfterData() {
    if (this.state.dataLoaded && this.state.pageError) {
      return (
        <p className='page-msg'>
          <i className='fa fa-exclamation-triangle' aria-hidden='true' />
          Error in loading up the page
        </p>
      );
    } else if (this.state.dataLoaded) {
      return (
        <div className='jobs-container'>
          <h1 className='header'>
            Open Positions:
            <i className='fa fa-angle-down' aria-hidden='true' />
          </h1>
          { this.state.jobs.map(job => <JobRow key={job.id} job={job} /> ) }
          { this._renderLoadMoreBtn() }
        </div>
      );
    } else {
      return (
        <p className='page-msg'>
          <i className='fa fa-spinner fa-spin fa-3x fa-fw'></i>
          <span className='sr-only'>Loading...</span>
        </p>
      );
    }
  }

  render() {
    return this._renderCompAfterData();
  }
}

export default JobsContainer;
