import React, {Component} from 'react';

import NewCourseFeed from './NewCourseFeed.jsx';
import CommentRow from './CommentRow.jsx';
import FilterFeedControls from './FilterFeedControls.jsx';

class CourseFeed extends Component {
  constructor(props) {
    super(props);
    this.categories = [
      { name: 'asg_report', value: 'Assignments and Reports' },
      { name: 'lecture_note', value: 'Lecture Notes' },
      { name: 'sample_question', value: 'Sample Questions' },
      { name: 'tutor_request', value: 'Peer Tutor Requests' }
    ];
    this.state = {
      categoryFilters: this.categories.map(category => category.name),
      comments: this.props.courseFeed
    };
    this.updateCommentsOptimistically = this.updateCommentsOptimistically.bind(this);
    this.updateCategoryFilters = this.updateCategoryFilters.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ comments: nextProps.courseFeed });
  }

  updateCommentsOptimistically(sourceComment, newOrDelete) {
    let comments = this.state.comments;
    switch(newOrDelete) {
      case 'new':
        if (!sourceComment.commenter_name) { sourceComment.commenter_name = 'anonymous'; }
        comments.unshift(sourceComment);
        break;
      case 'delete':
        let index = comments.findIndex(comment => comment.id === sourceComment.id);
        comments.splice(index, 1);
        break;
      default:
        break;
    }
    this.setState(comments);
  }

  updateCategoryFilters(filter, isItAddition) {
    let categoryFilters = this.state.categoryFilters;
    isItAddition ? categoryFilters.push(filter) : categoryFilters.splice(categoryFilters.indexOf(filter), 1);
    this.setState(categoryFilters);
  }

  render() {
    let comments = this.state.comments.filter(comment => this.state.categoryFilters.includes(comment.category));
    return (
      <div className='feed-container'>
        { this.props.courseId && <NewCourseFeed courseId={this.props.courseId} categories={this.categories} refresh={this.updateCommentsOptimistically} /> }
        <div className='feed-rows'>
          <hr />
          <FilterFeedControls categories={this.categories} updateFilters={this.updateCategoryFilters} />
          { comments.map((comment, index) => <CommentRow key={index} comment={comment} refresh={this.updateCommentsOptimistically} /> )}
        </div>
      </div>
    );
  }
}

export default CourseFeed;
