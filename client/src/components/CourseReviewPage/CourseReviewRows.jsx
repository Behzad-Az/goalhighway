import React, {Component} from 'react';

class CourseReviewRows extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortedBy: ''
    };
    this._decodeWorkload = this._decodeWorkload.bind(this);
    this._decodeFairness = this._decodeFairness.bind(this);
    this._decodeProf = this._decodeProf.bind(this);
    this._handleSortCritera = this._handleSortCritera.bind(this);
    this._sortReviews = this._sortReviews.bind(this);
  }

  _decodeWorkload(value) {
    switch(value) {
      case 1:
        return 'Too little';
      case 2:
        return 'Too much';
      case 3:
        return 'Fair';
      default:
        return 'unknown';
    }
  }

  _decodeFairness(value) {
    switch(value) {
      case 1:
        return 'Too easy';
      case 2:
        return 'Too difficult';
      case 3:
        return 'Fair';
      default:
        return 'unknown';
    }
  }

  _decodeProf(value) {
    switch(value) {
      case 1:
        return 'Not good';
      case 2:
        return 'Below average';
      case 3:
        return 'Average';
      case 4:
        return 'Above average';
      case 5:
        return 'Excellent!';
      default:
        return 'unknown';
    }
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
        { this.props.courseReviews.map((review, index) => {
          return (
            <div key={index} className='review-row'>
              <table className='meta-info'>
                <tbody>
                  <tr>
                    <td>Overall:</td>
                    <td>
                      <i className={ review.overall_rating >= 1 ? 'fa fa-star' : 'fa fa-star-o'} aria-hidden='true' />
                      <i className={ review.overall_rating >= 2 ? 'fa fa-star' : 'fa fa-star-o'} aria-hidden='true' />
                      <i className={ review.overall_rating >= 3 ? 'fa fa-star' : 'fa fa-star-o'} aria-hidden='true' />
                      <i className={ review.overall_rating >= 4 ? 'fa fa-star' : 'fa fa-star-o'} aria-hidden='true' />
                      <i className={ review.overall_rating >= 5 ? 'fa fa-star' : 'fa fa-star-o'} aria-hidden='true' />
                    </td>
                  </tr>
                  <tr>
                    <td>Term:</td>
                    <td>{review.start_month} {review.start_year}</td>
                  </tr>
                  <tr>
                    <td>Instructor:</td>
                    <td>{review.name || 'unknown'}</td>
                  </tr>
                  <tr>
                    <td>Teaching:</td>
                    <td>{this._decodeProf(review.prof_rating)}</td>
                  </tr>
                  <tr>
                    <td>Evaluation:</td>
                    <td>{this._decodeFairness(review.fairness_rating)}</td>
                  </tr>
                  <tr>
                    <td>Workload:</td>
                    <td>{this._decodeWorkload(review.workload_rating)}</td>
                  </tr>
                  <tr>
                    <td>By:</td>
                    <td>{review.reviewer_name || 'anonymous'}</td>
                  </tr>
                  <tr>
                    <td>Posted On:</td>
                    <td>{review.review_created_at.slice(0, 10)}</td>
                  </tr>
                </tbody>
              </table>
              <p className='comment'>'{review.review_desc || 'no comment provided'}'</p>
            </div>
          );
        })}
      </div>
    );
  }
}

export default CourseReviewRows;
