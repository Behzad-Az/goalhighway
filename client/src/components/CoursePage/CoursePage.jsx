import React, {Component} from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import LeftSideBar from '../partials/LeftSideBar.jsx';
import RightSideBar from '../partials/RightSideBar.jsx';
import SearchBar from '../partials/SearchBar.jsx';
import DocsRow from './DocsRow.jsx';
import ItemsRow from './ItemsRow.jsx';
import NewDocForm from './NewDocForm.jsx';
import NewReAssistForm from '../partials/NewReqAssistForm.jsx';
import NewItemForm from './NewItemForm.jsx';
import TopRow from './TopRow.jsx';
import CourseFeed from './CourseFeed/CourseFeed.jsx';
import ReactAlert from '../partials/ReactAlert.jsx';

class CoursePage extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.state = {
      dataLoaded: false,
      pageError: false,
      courseInfo: {
        id: this.props.routeParams.course_id
      },
      courseFeed: [],
      itemsForSale: [],
      sampleQuestions: [],
      asgReports: [],
      lectureNotes: []
    };
    this.loadComponentData = this.loadComponentData.bind(this);
    this.conditionData = this.conditionData.bind(this);
    this.updateState = this.updateState.bind(this);
    this.renderPageAfterData = this.renderPageAfterData.bind(this);
  }

  componentDidMount() {
    this.loadComponentData(this.props.routeParams.course_id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.course_id !== this.state.courseInfo.id) {
      this.loadComponentData(nextProps.params.course_id);
    }
  }

  loadComponentData(courseId) {
    courseId = courseId || this.state.courseInfo.id;
    fetch(`/api/courses/${courseId}`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this.conditionData(resJSON))
    .catch(err => this.setState({ dataLoaded: true, pageError: true }));
  }

  conditionData(resJSON) {
    if (resJSON) {
      let filterDocs = (docs, docType) => docs.filter(doc => doc.type === docType);
      let newState = {
        courseInfo: resJSON.courseInfo,
        courseFeed: resJSON.courseFeed,
        itemsForSale: resJSON.itemsForSale,
        sampleQuestions: filterDocs(resJSON.docs, 'sample_question'),
        asgReports: filterDocs(resJSON.docs, 'asg_report'),
        lectureNotes: filterDocs(resJSON.docs, 'lecture_note'),
        dataLoaded: true
      };
      this.setState(newState);
    } else {
      this.setState({ dataLoaded: true, pageError: true });
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
          <TopRow courseInfo={this.state.courseInfo} />
          <NewDocForm courseId={this.state.courseInfo.id} reload={this.loadComponentData} />
          <NewItemForm courseId={this.state.courseInfo.id} reload={this.loadComponentData} />
          <NewReAssistForm courseInfo={this.state.courseInfo} updateParentState={this.updateState} />
          <DocsRow docs={this.state.asgReports} header="Assignments and Reports" />
          <DocsRow docs={this.state.lectureNotes} header="Lecture Notes" />
          <DocsRow docs={this.state.sampleQuestions} header="Sample Questions" />
          <ItemsRow items={this.state.itemsForSale} reload={this.loadComponentData} />
          <CourseFeed courseId={this.state.courseInfo.id} courseFeed={this.state.courseFeed} />
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

  updateState(newState) {
    this.setState(newState);
  }

  render() {
    return (
      <div className="course-page">
        <Navbar />
        <LeftSideBar />
        { this.renderPageAfterData() }
        <RightSideBar />
        { this.reactAlert.container }
      </div>
    );
  }
}

export default CoursePage;
