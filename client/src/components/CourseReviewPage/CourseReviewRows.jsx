import React, {Component} from 'react';
import CourseReviewRow from './CourseReviewRow.jsx';

class CourseReviewRows extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortedBy: ''
    };
    this._handleSortCritera = this._handleSortCritera.bind(this);
    this._sortReviews = this._sortReviews.bind(this);
  }

  _handleSortCritera(e) {
    this.setState({ sortedBy: e.target.value });
  }

  _sortReviews(sortedBy) {
    switch(sortedBy) {
      case 'date_new_to_old':
        this.props.courseReviews.sort((a, b) => a.review_created_at < b.review_created_at);
        break;
      case 'date_old_to_new':
        this.props.courseReviews.sort((a, b) => a.review_created_at > b.review_created_at);
        break;
      case 'rating_high_to_low':
        this.props.courseReviews.sort((a, b) => a.overall_rating < b.overall_rating);
        break;
      case 'rating_low_to_high':
        this.props.courseReviews.sort((a, b) => a.overall_rating > b.overall_rating);
        break;
      case 'instructor_name':
        this.props.courseReviews.sort((a, b) => a.name > b.name);
        break;
      default:
        break;
    }
  }

  render() {
    this._sortReviews(this.state.sortedBy);
    return (
      <div className='row-container'>
        <h1 className='header'>
          Previous Reviews:
          <select className='sort-select' onChange={this._handleSortCritera}>
            <option value={'date_new_to_old'}>Date - New to Old</option>
            <option value={'date_old_to_new'}>Date - Old to New</option>
            <option value={'rating_high_to_low'}>Rating - High to Low</option>
            <option value={'rating_low_to_high'}>Rating - Low to High</option>
            <option value={'instructor_name'}>Instructor Name</option>
          </select>
        </h1>
        { this.props.courseReviews.map(review => <CourseReviewRow key={review.id} review={review} /> ) }
      </div>
    );
  }
}

export default CourseReviewRows;
