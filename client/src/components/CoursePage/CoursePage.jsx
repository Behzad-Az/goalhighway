import React, {Component} from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import LeftSideBar from '../partials/LeftSideBar.jsx';
import RightSideBar from '../RightSideBar/RightSideBar.jsx';
import SearchBar from '../partials/SearchBar.jsx';
import DocsContainer from './DocsContainer.jsx';
import ItemsContainer from './ItemsContainer.jsx';
import TopRow from './TopRow.jsx';
import CourseFeedsContainer from './CourseFeeds/CourseFeedsContainer.jsx';
import ReactAlert from '../partials/ReactAlert.jsx';
import NewConvForm from '../ConversationPage/NewConvForm.jsx';

class CoursePage extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.state = {
      convParams: {
        toId: '',
        objId: '',
        type: '',
        subject: ''
      },
      showNewConvForm: false,
      itemsState: 0,
      asgReportsState: 0,
      lectureNotesState: 0,
      sampleQuestionsState: 0
    };
    this._composeNewConv = this._composeNewConv.bind(this);
    this._updateCompState = this._updateCompState.bind(this);
  }

  _composeNewConv(convParams) {
    this.setState({ convParams, showNewConvForm: true });
  }

  _updateCompState(state) {
    let newState = {};
    newState[state] = this.state[state] + 1;
    this.setState(newState);
  }

  render() {
    return (
      <div className='course-page'>
        <Navbar />
        <LeftSideBar />
        <div className='main-container'>
          <SearchBar />
          <NewConvForm
            convParams={this.state.convParams}
            showModal={this.state.showNewConvForm}
            toggleModal={() => this.setState({ showNewConvForm: !this.state.showNewConvForm })}
          />
          <TopRow courseId={this.props.routeParams.course_id} updateCompState={this._updateCompState} />
          <DocsContainer
            scrollId='assignmentsAndReports'
            courseId={this.props.routeParams.course_id}
            type='asg_report'
            parentState={this.state.asgReportsState} />
          <DocsContainer
            scrollId='lectureNotes'
            courseId={this.props.routeParams.course_id}
            type='lecture_note'
            parentState={this.state.lectureNotesState} />
          <DocsContainer
            scrollId='sampleQuestions'
            courseId={this.props.routeParams.course_id}
            type='sample_question'
            parentState={this.state.sampleQuestionsState} />
          <ItemsContainer
            courseId={this.props.routeParams.course_id}
            composeNewConv={this._composeNewConv}
            parentState={this.state.itemsState} />
          <CourseFeedsContainer courseId={this.props.routeParams.course_id} composeNewConv={this._composeNewConv} />
        </div>
        <RightSideBar />
        { this.reactAlert.container }
      </div>
    );
  }
}

export default CoursePage;
