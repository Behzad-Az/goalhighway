import React, {Component} from 'react';
import { Link } from 'react-router';

class IndexRow extends Component {
  constructor(props) {
    super(props);
    this.courseLink = `/courses/${this.props.course.id}`;
    this._decodeRevActivities = this._decodeRevActivities.bind(this);
    this._displayLatestRevs = this._displayLatestRevs.bind(this);
  }

  _decodeRevActivities() {
    return ['asg_report', 'lecture_note', 'sample_question'].map((type, index) => {
      let update = this.props.course.revActivities.find(update => update.type === type);
      switch (type) {
        case 'asg_report':
          return <p key={index}>• <Link to={`${this.courseLink}#assignmentsAndReports`}>{update ? update.revCount : 0} Assignments & Report Revisions</Link></p>;
        case 'lecture_note':
          return <p key={index}>• <Link to={`${this.courseLink}#lectureNotes`}>{update ? update.revCount : 0} Lecture Note Revisions</Link></p>;
        case 'sample_question':
          return <p key={index}>• <Link to={`${this.courseLink}#sampleQuestions`}>{update ? update.revCount : 0} Sample Question Revisions</Link></p>;
      }
    });
  }

  _displayLatestRevs() {
    return this.props.course.latestRevs[0] ?
      this.props.course.latestRevs.map(rev => <p key={rev.id}><strong><Link to={`${this.courseLink}/docs/${rev.doc_id}`}>@{rev.title} </Link></strong>- {rev.rev_desc}</p>) :
      <p>• No document revision posted yet.</p>;
  }

  render() {
    return (
      <div className='course-index card'>
        <div className='card-content'>
          <p className='title header is-5'>
            <Link to={this.courseLink}>
              <span className='course-name'>{this.props.course.short_display_name}</span>
              <span className='course-desc'>{` - ${this.props.course.course_desc}`}</span>
            </Link>
            <i className='fa fa-angle-down' aria-hidden='true' />
          </p>
          <div className='columns'>
            <div className='updates column is-5'>
              <h1 className='header'>Overview</h1>
              { this._decodeRevActivities() }
              { <p>• <Link to={`${this.courseLink}#items`}>{this.props.course.itemActivities[0] ? this.props.course.itemActivities[0].itemCount : 0} Items for Sale or Trade</Link></p> }
              { <p>• <Link to={`${this.courseLink}#feeds`}>{this.props.course.commentActivities[0] ? this.props.course.commentActivities[0].commentCount : 0} User Comments</Link></p> }
            </div>
            <div className='updates column is-7'>
              <h1 className='header'>Latest Updates</h1>
              { this._displayLatestRevs() }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default IndexRow;
