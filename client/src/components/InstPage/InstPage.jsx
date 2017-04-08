import React, {Component} from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import SearchBar from '../partials/SearchBar.jsx';
import LeftSideBar from '../partials/LeftSideBar.jsx';
import RightSideBar from '../partials/RightSideBar.jsx';
import ReactAlert from '../partials/ReactAlert.jsx';
import NewCourseForm from './NewCourseForm.jsx';
import NewInstForm from './NewInstForm.jsx';
import CoursesContainer from './CoursesContainer.jsx';
import TopRow from './TopRow.jsx';

class InstPage extends Component {
  constructor(props) {
    super(props);
    this.fixedCurrInstCourses = [];
    this.reactAlert = new ReactAlert();
    this.state = {
      dataLoaded: false,
      pageError: false,
      instId: this.props.params.inst_id,
      instList: [],
      currInstCourses: [],
      currUserCourseIds: []
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._findInstName = this._findInstName.bind(this);
    this._handleFilter = this._handleFilter.bind(this);
  }

  componentDidMount() {
    this._loadComponentData(this.state.instId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.inst_id && (this.state.instId !== nextProps.params.inst_id)) {
      this._loadComponentData(nextProps.params.inst_id);
    }
  }

  _loadComponentData(instId) {
    instId = instId || this.state.instId;
    fetch(`/api/institutions/${instId}`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON, instId))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  _conditionData(resJSON, instId) {
    if (resJSON) {
      resJSON.instList.forEach(inst => {
        inst.label = inst.inst_display_name;
        inst.value = inst.id;
      });
      resJSON.instId = instId;
      resJSON.dataLoaded = true;
      this.fixedCurrInstCourses = resJSON.currInstCourses;
      this.setState(resJSON);
    } else {
      throw 'Server returned false';
    }
  }

  _findInstName() {
    let inst = this.state.instList.find(inst => inst.id == this.state.instId);
    return inst ? inst.inst_display_name : '';
  }

  _handleFilter(e) {
    let phrase = new RegExp(e.target.value.toLowerCase());
    let currInstCourses = this.fixedCurrInstCourses.filter(course => course.full_display_name.toLowerCase().match(phrase));
    this.setState({ currInstCourses });
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
          <NewCourseForm reload={this._loadComponentData} instId={this.state.instId} instName={this._findInstName()} />
          <NewInstForm reload={this._loadComponentData} />
          <TopRow instId={parseInt(this.state.instId)} instList={this.state.instList} handleChange={this._loadComponentData} />
          <CoursesContainer courses={this.state.currInstCourses.slice(0, 15)} currUserCourseIds={this.state.currUserCourseIds} handleFilter={this._handleFilter} />
          { this.state.dataLoaded && this.state.currInstCourses[0] && <p>Many more courses available. Refine your search please.</p> }
          { this.state.dataLoaded && !this.state.currInstCourses[0] && <p>No courses are available for this institution. Be the first to add one.</p> }
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
      <div className='inst-page'>
        <Navbar />
        <LeftSideBar />
        { this.renderPageAfterData() }
        <RightSideBar />
        { this.reactAlert.container }
      </div>
    );
  }
}

export default InstPage;
