import React, {Component} from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import LeftSideBar from '../partials/LeftSideBar.jsx';
import RightSideBar from '../RightSideBar/RightSideBar.jsx';
import SearchBar from '../partials/SearchBar.jsx';
import ReactAlert from '../partials/ReactAlert.jsx';
import TopRow from './TopRow.jsx';
import RevisionsContainer from './RevisionsContainer.jsx';
import NewReAssistForm from '../partials/NewReqAssistForm.jsx';
import NewRevisionForm from './NewRevisionForm.jsx';

class DocPage extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.state = {
      dataLoaded: false,
      pageError: false,
      courseInfo: {
        id: this.props.params.course_id
      },
      docInfo: {
        id: this.props.params.doc_id,
        revisions: []
      }
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._renderPageAfterData = this._renderPageAfterData.bind(this);
  }

  componentDidMount() {
    this._loadComponentData(this.props.params.course_id, this.props.params.doc_id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.doc_id !== this.state.docInfo.id || nextProps.params.course_id  !== this.state.courseInfo.id) {
      this._loadComponentData(nextProps.params.course_id, nextProps.params.doc_id);
    }
  }

  _loadComponentData(courseId, docId) {
    courseId = courseId || this.state.courseInfo.id;
    docId = docId || this.state.docInfo.id;
    fetch(`/api/courses/${courseId}/docs/${docId}`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  _conditionData(resJSON) {
    if (resJSON) {
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
          <TopRow courseInfo={this.state.courseInfo} docInfo={this.state.docInfo} />
          <NewReAssistForm courseInfo={this.state.courseInfo} reload={this._loadComponentData} />
          <NewRevisionForm docInfo={this.state.docInfo} reload={this._loadComponentData} />
          <RevisionsContainer
            revs={this.state.docInfo.revisions}
            docInfo={this.state.docInfo}
            currentUrl={`/courses/${this.state.courseInfo.id}/docs/${this.state.docInfo.id}`}
            reload={this._loadComponentData}
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
      <div className='doc-page'>
        <Navbar />
        <LeftSideBar />
        { this._renderPageAfterData() }
        <RightSideBar />
        { this.reactAlert.container }
      </div>
    );
  }
}

export default DocPage;
