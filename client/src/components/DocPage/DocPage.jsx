import React, {Component} from 'react';

import Navbar from '../Navbar/Navbar.jsx';
import LeftSideBar from '../partials/LeftSideBar.jsx';
import RightSideBar from '../partials/RightSideBar.jsx';
import SearchBar from '../partials/SearchBar.jsx';
import ReactAlert from '../partials/ReactAlert.jsx';
import RevisionRow from './RevisionRow.jsx';
import NewRevisionForm from './NewRevisionForm.jsx';
import TopRow from './TopRow.jsx';
import NewReAssistForm from '../partials/NewReqAssistForm.jsx';

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
    this.loadComponentData = this.loadComponentData.bind(this);
    this.conditionData = this.conditionData.bind(this);
    this.updateState = this.updateState.bind(this);
    this.renderPageAfterData = this.renderPageAfterData.bind(this);
  }

  componentDidMount() {
    this.loadComponentData(this.props.params.course_id, this.props.params.doc_id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.doc_id !== this.state.docInfo.id || nextProps.params.course_id  !== this.state.courseInfo.id) {
      this.loadComponentData(nextProps.params.course_id, nextProps.params.doc_id);
    }
  }

  loadComponentData(courseId, docId) {
    courseId = courseId || this.state.courseInfo.id;
    docId = docId || this.state.docInfo.id;
    fetch(`/api/courses/${courseId}/docs/${docId}`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this.conditionData(resJSON))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  conditionData(resJSON) {
    if (resJSON) {
      resJSON.dataLoaded = true;
      this.setState(resJSON);
    } else {
      throw 'Server returned false';
    }
  }

  updateState(newState) {
    this.setState(newState);
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
          <TopRow courseInfo={this.state.courseInfo} docInfo={this.state.docInfo} />
          <NewReAssistForm courseInfo={this.state.courseInfo} updateParentState={this.updateState} />
          <NewRevisionForm docInfo={this.state.docInfo} reload={this.loadComponentData} />
          <div className="row-container">
            <h1 className="header">
              Document Revisions
              <i className="fa fa-angle-down" aria-hidden="true" />
            </h1>
            { this.state.docInfo.revisions.map(rev => <RevisionRow key={rev.id} rev={rev} docInfo={this.state.docInfo} reload={this.loadComponentData} currentUrl={`/courses/${this.state.courseInfo.id}/docs/${this.state.docInfo.id}`} courseInfo={this.state.courseInfo} /> ) }
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
      <div className="doc-page">
        <Navbar />
        <LeftSideBar />
        { this.renderPageAfterData() }
        <RightSideBar />
        { this.reactAlert.container }
      </div>
    );
  }
}

export default DocPage;
