import React, {Component} from 'react';
import DocumentFeed from './DocumentFeed.jsx';
import TutorFeed from './TutorFeed.jsx';
import CommentFeed from './CommentFeed.jsx';
import ItemFeed from './ItemFeed.jsx';
import CourseReviewFeed from './CourseReviewFeed.jsx';

class CourseFeedRow extends Component {
  constructor(props) {
    super(props);
    this._prepareFeed = this._prepareFeed.bind(this);
  }

  _prepareFeed() {
    switch (this.props.feed.category) {
      case 'new_asg_report':
        return <DocumentFeed feed={this.props.feed} header={`New Assingment / Report - ${this.props.feed.header}`} />;
      case 'new_lecture_note':
        return <DocumentFeed feed={this.props.feed} header={`New Lecture Note - ${this.props.feed.header}`} />;
      case 'new_sample_question':
        return <DocumentFeed feed={this.props.feed} header={`New Sample Question - ${this.props.feed.header}`} />;
      case 'new_document':
        return <DocumentFeed feed={this.props.feed} header={`New Document - ${this.props.feed.header}`} />;
      case 'revised_asg_report':
        return <DocumentFeed feed={this.props.feed} header={`Revised Assignment / Report - ${this.props.feed.header}`} />;
      case 'revised_lecture_note':
        return <DocumentFeed feed={this.props.feed} header={`Revised Lecture Note - ${this.props.feed.header}`} />;
      case 'revised_sample_question':
        return <DocumentFeed feed={this.props.feed} header={`Revised Sample Question - ${this.props.feed.header}`} />;
      case 'revised_document':
        return <DocumentFeed feed={this.props.feed} header={`Revised Document - ${this.props.feed.header}`} />;
      case 'new_tutor_request':
        return <TutorFeed feed={this.props.feed} composeNewConv={this.props.composeNewConv} />;
      case 'new_comment':
        return <CommentFeed feed={this.props.feed} />;
      case 'new_item_for_sale':
        return <ItemFeed feed={this.props.feed} composeNewConv={this.props.composeNewConv} />;
      case 'new_course_review':
        return <CourseReviewFeed feed={this.props.feed} />;
      default:
        return <p></p>;
    }
  }

  render() {
    return this._prepareFeed();
  }
}

export default CourseFeedRow;
