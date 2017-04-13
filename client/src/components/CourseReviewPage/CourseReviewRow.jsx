import React, {Component} from 'react';

class CourseReviewRow extends Component {
  constructor(props) {
    super(props);
    this._decodeWorkload = this._decodeWorkload.bind(this);
    this._decodeFairness = this._decodeFairness.bind(this);
    this._decodeProf = this._decodeProf.bind(this);
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

  render() {
    return (
      <div className='review-row'>
        <table className='meta-info'>
          <tbody>
            <tr>
              <td>Overall:</td>
              <td>
                <i className={ this.props.review.overall_rating >= 1 ? 'fa fa-star' : 'fa fa-star-o'} aria-hidden='true' />
                <i className={ this.props.review.overall_rating >= 2 ? 'fa fa-star' : 'fa fa-star-o'} aria-hidden='true' />
                <i className={ this.props.review.overall_rating >= 3 ? 'fa fa-star' : 'fa fa-star-o'} aria-hidden='true' />
                <i className={ this.props.review.overall_rating >= 4 ? 'fa fa-star' : 'fa fa-star-o'} aria-hidden='true' />
                <i className={ this.props.review.overall_rating >= 5 ? 'fa fa-star' : 'fa fa-star-o'} aria-hidden='true' />
              </td>
            </tr>
            <tr>
              <td>Term:</td>
              <td>{this.props.review.start_month} {this.props.review.start_year}</td>
            </tr>
            <tr>
              <td>Instructor:</td>
              <td>{this.props.review.name || 'unknown'}</td>
            </tr>
            <tr>
              <td>Teaching:</td>
              <td>{this._decodeProf(this.props.review.prof_rating)}</td>
            </tr>
            <tr>
              <td>Evaluation:</td>
              <td>{this._decodeFairness(this.props.review.fairness_rating)}</td>
            </tr>
            <tr>
              <td>Workload:</td>
              <td>{this._decodeWorkload(this.props.review.workload_rating)}</td>
            </tr>
            <tr>
              <td>Posted On:</td>
              <td>{this.props.review.created_at.slice(0, 10)}</td>
            </tr>
          </tbody>
        </table>
        <p className='comment'>'{this.props.review.review_desc || 'no comment provided'}'</p>
      </div>
    );
  }
}

export default CourseReviewRow;
