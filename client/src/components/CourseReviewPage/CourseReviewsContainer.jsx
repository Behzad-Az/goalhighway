import React, {Component} from 'react';
import CourseReviewRow from './CourseReviewRow.jsx';

class reviewsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      reviews: [],
      sortedBy: '',
      noMoreFeeds: false,
      parentState: this.props.parentState
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._sortReviews = this._sortReviews.bind(this);
    this._renderLoadMoreBtn = this._renderLoadMoreBtn.bind(this);
    this._renderCompAfterData = this._renderCompAfterData.bind(this);
  }

  componentDidMount() {
    this._loadComponentData(false);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.parentState !== this.state.parentState) {
      this.setState({ parentState: nextProps.parentState });
      this._loadComponentData(true);
    }
  }

  _loadComponentData(freshReload) {
    fetch(`/api/courses/${this.props.courseId}/reviews/reviews?reviewsoffset=${freshReload ? 0 : this.state.reviews.length}`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON, freshReload))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  _conditionData(resJSON, freshReload) {
    if (resJSON) {
      this.setState({
        reviews: freshReload ? resJSON.reviews : this.state.reviews.concat(resJSON.reviews),
        dataLoaded: true,
        noMoreFeeds: !resJSON.reviews.length
      });
    } else {
      throw 'Server returned false';
    }
  }

  _sortReviews() {
    switch (this.state.sortedBy) {
      case 'date_new_to_old':
        this.state.reviews.sort((a, b) => a.created_at <= b.created_at ? 1 : -1);
        break;
      case 'date_old_to_new':
        this.state.reviews.sort((a, b) => a.created_at >= b.created_at ? 1 : -1);
        break;
      case 'rating_high_to_low':
        this.state.reviews.sort((a, b) => a.overall_rating <= b.overall_rating ? 1 : -1);
        break;
      case 'rating_low_to_high':
        this.state.reviews.sort((a, b) => a.overall_rating >= b.overall_rating ? 1 : -1);
        break;
      case 'instructor_name':
        this.state.reviews.sort((a, b) => a.name.toLowerCase() >= b.name.toLowerCase() ? 1 : -1);
        break;
      default:
        break;
    }
  }

  _renderLoadMoreBtn() {
    if (this.state.reviews.length) {
      const btnContent = this.state.noMoreFeeds && this.state.reviews.length ? 'All reviews shown' : 'Load More';
      return (
        <p className='end-msg'>
          <button className='button' disabled={this.state.noMoreFeeds} onClick={() => this._loadComponentData(false)}>{btnContent}</button>
        </p>
      );
    } else {
      return <p>No review posted yet.</p>;
    }
  }

  _renderCompAfterData() {
    if (this.state.dataLoaded && this.state.pageError) {
      return (
        <p className='page-msg'>
          <i className='fa fa-exclamation-triangle' aria-hidden='true' />
          Error in loading up the page
        </p>
      );
    } else if (this.state.dataLoaded) {
      return (
        <div className='review-container'>
          <h1 className='header'>
            Previous Reviews:
            <select className='sort-select' onChange={e => this.setState({ sortedBy: e.target.value })}>
              <option value='date_new_to_old'>Date - New to Old</option>
              <option value='date_old_to_new'>Date - Old to New</option>
              <option value='rating_high_to_low'>Rating - High to Low</option>
              <option value='rating_low_to_high'>Rating - Low to High</option>
              <option value='instructor_name'>Instructor Name</option>
            </select>
          </h1>
          { this.state.reviews.map(review => <CourseReviewRow key={review.id} review={review} /> ) }
          { this._renderLoadMoreBtn() }
        </div>
      );
    } else {
      return (
        <p className='page-msg'>
          <i className='fa fa-spinner fa-spin fa-3x fa-fw'></i>
          <span className='sr-only'>Loading...</span>
        </p>
      );
    }
  }

  render() {
    this._sortReviews();
    return this._renderCompAfterData();
  }
}

export default reviewsContainer;
