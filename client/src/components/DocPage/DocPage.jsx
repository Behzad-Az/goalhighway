import React, {Component} from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import LeftSideBar from '../partials/LeftSideBar.jsx';
import RightSideBar from '../RightSideBar/RightSideBar.jsx';
import SearchBar from '../partials/SearchBar.jsx';
import ReactAlert from '../partials/ReactAlert.jsx';
import TopRow from './TopRow.jsx';
import RevisionsContainer from './RevisionsContainer.jsx';

class DocPage extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.state = {
      revisionsState: 0
    };
  }

  render() {
    return (
      <div className='doc-page'>
        <Navbar />
        <LeftSideBar />
        <div className='main-container'>
          <SearchBar />
          <TopRow
            courseId={this.props.params.course_id}
            docId={this.props.params.doc_id}
            updateCompState={() => this.setState({ revisionsState: this.state.revisionsState + 1 })} />
          <RevisionsContainer
            courseId={this.props.params.course_id}
            docId={this.props.params.doc_id}
            parentState={this.state.revisionsState}
          />
        </div>
        <RightSideBar />
        { this.reactAlert.container }
      </div>
    );
  }
}

export default DocPage;
