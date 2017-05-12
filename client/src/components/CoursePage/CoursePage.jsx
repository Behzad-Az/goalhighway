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
      dataLoaded: false,
      pageError: false,
      convParams: {
        toId: '',
        objId: '',
        type: '',
        subject: ''
      },
      showNewConvForm: false,
      courseInfo: {
        id: this.props.routeParams.course_id
      },
      courseFeeds: [],
      itemsForSale: [],
      sampleQuestions: [],
      asgReports: [],
      lectureNotes: []
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._composeNewConv = this._composeNewConv.bind(this);
    this._removeComment = this._removeComment.bind(this);
    this._renderPageAfterData = this._renderPageAfterData.bind(this);
  }

  componentDidMount() {
    this._loadComponentData(this.state.courseInfo.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.course_id !== this.state.courseInfo.id) {
      this._loadComponentData(nextProps.params.course_id);
    }
  }

  _loadComponentData(courseId) {
    courseId = courseId || this.state.courseInfo.id;
    fetch(`/api/courses/${courseId}`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  _conditionData(resJSON) {
    if (resJSON) {
      let filterDocs = (docs, docType) => docs.filter(doc => doc.type === docType);
      let newState = {
        courseInfo: resJSON.courseInfo,
        courseFeeds: resJSON.courseFeeds,
        itemsForSale: resJSON.itemsForSale,
        sampleQuestions: filterDocs(resJSON.docs, 'sample_question'),
        asgReports: filterDocs(resJSON.docs, 'asg_report'),
        lectureNotes: filterDocs(resJSON.docs, 'lecture_note'),
        dataLoaded: true
      };
      this.setState(newState);
    } else {
      throw 'Server returned false';
    }
  }

  _composeNewConv(convParams) {
    this.setState({ convParams, showNewConvForm: true });
  }

  _removeComment(feedId) {
    fetch(`/api/courses/${this.state.courseInfo.id}/feed/${feedId}`, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/string',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) {
        this.setState({ courseFeeds: this.state.courseFeeds.filter(comment => comment.id !== feedId) });
      }
      else { throw 'Server returned false'; }
    })
    .catch(err => console.error('Unable to delete course feed: ', err));
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
          <NewConvForm
            convParams={this.state.convParams}
            showModal={this.state.showNewConvForm}
            toggleModal={() => this.setState({ showNewConvForm: !this.state.showNewConvForm })}
          />
          <TopRow courseInfo={this.state.courseInfo} reload={this._loadComponentData} />
          <DocsContainer docs={this.state.asgReports} header='Assignments and Reports' />
          <DocsContainer docs={this.state.lectureNotes} header='Lecture Notes' />
          <DocsContainer docs={this.state.sampleQuestions} header='Sample Questions' />
          <ItemsContainer
            items={this.state.itemsForSale}
            reload={this._loadComponentData}
            composeNewConv={this._composeNewConv}
          />
          <CourseFeedsContainer
            courseId={this.state.courseInfo.id}
            courseFeeds={this.state.courseFeeds}
            reload={this._loadComponentData}
            composeNewConv={this._composeNewConv}
            removeComment={this._removeComment}
          />
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
      <div className='course-page'>
        <Navbar />
        <LeftSideBar />
        { this._renderPageAfterData() }
        <RightSideBar />
        { this.reactAlert.container }
      </div>
    );
  }
}

export default CoursePage;
