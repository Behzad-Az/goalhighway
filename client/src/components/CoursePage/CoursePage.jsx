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
      itemsForSale: []
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._composeNewConv = this._composeNewConv.bind(this);
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
        itemsForSale: resJSON.itemsForSale,
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
          <DocsContainer type='asg_report' courseId={this.state.courseInfo.id} />
          <DocsContainer type='lecture_note' courseId={this.state.courseInfo.id} />
          <DocsContainer type='sample_question' courseId={this.state.courseInfo.id} />
          <ItemsContainer
            items={this.state.itemsForSale}
            reload={this._loadComponentData}
            composeNewConv={this._composeNewConv}
          />
          <CourseFeedsContainer courseId={this.state.courseInfo.id} composeNewConv={this._composeNewConv} />
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
