import React, {Component} from 'react';

import Navbar from '../Navbar/Navbar.jsx';
import SearchBar from '../partials/SearchBar.jsx';
import LeftSideBar from '../partials/LeftSideBar.jsx';
import RightSideBar from '../partials/RightSideBar.jsx';
import NewCourseForm from './NewCourseForm.jsx';
import NewInstForm from './NewInstForm.jsx';
import CourseRow from './CourseRow.jsx';
import FilterInputBox from './FilterInputBox.jsx';

import SingleSelect from '../partials/SingleSelect.jsx';
import ReactAlert from '../partials/ReactAlert.jsx';
import HandleModal from '../partials/HandleModal.js';

class InstPage extends Component {
  constructor(props) {
    super(props);
    this.fixedCurrInstCourses = [];
    this.reactAlert = new ReactAlert();
    this.state = {
      dataLoaded: false,
      pageError: false,
      instId: this.props.params.inst_id,
      userId: '',
      instList: [],
      currInstCourses: [],
      currUserCourseIds: []
    };
    this.loadComponentData = this.loadComponentData.bind(this);
    this.conditionData = this.conditionData.bind(this);
    this.findInstName = this.findInstName.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }

  componentDidMount() {
    this.loadComponentData(this.state.instId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.inst_id && (this.state.instId !== nextProps.params.inst_id)) {
      this.loadComponentData(nextProps.params.inst_id);
    }
  }

  loadComponentData(instId) {
    $.ajax({
      method: 'GET',
      url: `/api/institutions/${instId}`,
      dataType: 'JSON',
      success: response => this.conditionData(response, instId)
    });
  }

  conditionData(response, instId) {
    if (response) {
      response.instList.forEach(inst => {
        inst.label = inst.inst_display_name;
        inst.value = inst.id;
      });
      response.instId = instId;
      response.dataLoaded = true;
      this.fixedCurrInstCourses = response.currInstCourses;
      this.setState(response);
    } else {
      this.setState({ dataLoaded: true, pageError: true });
    }
  }

  findInstName() {
    let inst = this.state.instList.find(inst => inst.id == this.state.instId);
    return inst ? inst.inst_display_name : '';
  }

  handleFilter(e) {
    let phrase = new RegExp(e.target.value.toLowerCase());
    let currInstCourses = this.fixedCurrInstCourses.filter(course => course.full_display_name.toLowerCase().match(phrase));
    this.setState({ currInstCourses });
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
      let slicedArr = this.state.currInstCourses.slice(0, 199);
      return (
        <div className="main-container">
          <SearchBar />
          <h1 className="header">
            Institution:
            <button className="button" onClick={() => HandleModal('new-inst-form')}>Don't see your institution?</button>
          </h1>
          <div className="inst-dropdown control">
            <SingleSelect
              disabled={false}
              initialValue={parseInt(this.state.instId)}
              name="instList"
              options={this.state.instList}
              handleChange={this.loadComponentData} />
          </div>
          <h1 className="header">
            Courses:
            <button className="button" onClick={() => HandleModal('new-course-form')}>Don't see your course?</button>
          </h1>
          <NewCourseForm
            reload={() => this.loadComponentData(this.state.instId)}
            instId={this.state.instId}
            instName={this.findInstName()} />
          <NewInstForm
            reload={() => this.loadComponentData(this.state.instId)} />
          <FilterInputBox handleFilter={this.handleFilter} />
          <div className="course-rows">
            { slicedArr.map((course, index) => <CourseRow key={index} course={course} currUserCourseIds={this.state.currUserCourseIds} userId={this.state.userId} /> )}
            { this.state.dataLoaded && this.state.currInstCourses[0] && <p>Many more courses available. Refine your search please.</p> }
            { this.state.dataLoaded && !this.state.currInstCourses[0] && <p>No courses are available for this institution. Be the first to add one.</p> }
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
      <div className="inst-page">
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
