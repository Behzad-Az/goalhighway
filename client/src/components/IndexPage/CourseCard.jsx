import React, {Component} from 'react';
import { Link } from 'react-router';

import ViewUpdate from './ViewUpdate.jsx';

class CourseCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sampleQuestionsUpdates: [],
      asgReportsUpdates: [],
      lectureNotesUpdates: []
    };
  }

  componentDidMount() {
    let filterDocs = (updates, docType) => updates.filter(update => update.type === docType);
    let sampleQuestionsUpdates = filterDocs(this.props.updates, 'sample_question');
    let asgReportsUpdates = filterDocs(this.props.updates, 'asg_report');
    let lectureNotesUpdates = filterDocs(this.props.updates, 'lecture_note');
    this.setState({ sampleQuestionsUpdates, asgReportsUpdates, lectureNotesUpdates });
  }

  render() {
    let courseDesc = ` - ${this.props.course.course_desc}`;
    let courseLink = `/courses/${this.props.course.course_id}`;
    return (
      <div className='course-index card'>
        <div className='card-content'>
          <p className='title header is-5'>
            <Link to={courseLink}>
              <span className='course-name'>{this.props.course.short_display_name}</span>
              <span className='course-desc'>{courseDesc}</span>
            </Link>
          </p>
          <div className='columns'>
            <div className='doc-type sample-questions column is-4'>
              <h1 className='header'>Sample Questions</h1>
              { this.state.sampleQuestionsUpdates.map((update, index) => <ViewUpdate key={index} update={update} courseLink={courseLink} /> )}
              { !this.state.sampleQuestionsUpdates[0] && <p>No updates available yet</p> }
            </div>
            <div className='doc-type asg-reports column is-4'>
              <h1 className='header'>Assignment & Reports</h1>
              { this.state.asgReportsUpdates.map((update, index) => <ViewUpdate key={index} update={update} courseLink={courseLink} /> )}
              { !this.state.asgReportsUpdates[0] && <p>No updates available yet</p> }
            </div>
            <div className='doc-type lecture-notes column is-4'>
              <h1 className='header'>Lecture Notes</h1>
              { this.state.lectureNotesUpdates.map((update, index) => <ViewUpdate key={index} update={update} courseLink={courseLink} /> )}
              { !this.state.lectureNotesUpdates[0] && <p>No updates available yet</p> }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CourseCard;
