import React, {Component} from 'react';
import { Link } from 'react-router';
import HandleModal from '../partials/HandleModal.js';

class TopRow extends Component {
  constructor(props) {
    super(props);
    this._getAverageValues = this._getAverageValues.bind(this);
    this._calcStarPercent = this._calcStarPercent.bind(this);
    this._getProfAvgRatings = this._getProfAvgRatings.bind(this);
    this._decodeProf = this._decodeProf.bind(this);
    this._decodeWorkload = this._decodeWorkload.bind(this);
    this._decodeFairness = this._decodeFairness.bind(this);
  }

  _getAverageValues() {
    let length = this.props.courseReviews.length || 1;
    let sumRatings = this.props.courseReviews.reduce((a, b) => {
      return {
        overall_rating: a.overall_rating + b.overall_rating,
        workload_rating: a.workload_rating + b.workload_rating,
        fairness_rating: a.fairness_rating + b.fairness_rating,
        prof_rating: a.prof_rating + b.prof_rating
      };
    }, {
      overall_rating: 0,
      workload_rating: 0,
      fairness_rating: 0,
      prof_rating: 0
    });

    return {
      overallRating: sumRatings.overall_rating / length,
      workloadRating: Math.round(sumRatings.workload_rating / length),
      fairnessRating: Math.round(sumRatings.fairness_rating / length),
      profRating: Math.round(sumRatings.prof_rating / length)
    };
  }

  _calcStarPercent(count, avgValue) {
    if (count > avgValue) {
      return 0;
    } else {
      return (avgValue - count < 1) ? (avgValue - count) * 100 : 100;
    }
  }

  _getProfAvgRatings() {
    let profRatingSum = {};
    let profRatingCount = {};
    this.props.courseReviews.forEach(review => {
      profRatingSum[review.name] = profRatingSum[review.name] ? profRatingSum[review.name] + review.prof_rating : review.prof_rating;
      profRatingCount[review.name] = profRatingCount[review.name] ? profRatingCount[review.name] + 1 : 1;
    });
    return Object.keys(profRatingSum)[0] ? Object.keys(profRatingSum).map((profName, index) =>
      <tr key={index}>
        <td>{profName}:</td>
        <td className='second-column'>
          { this._decodeProf(Math.round(profRatingSum[profName] / profRatingCount[profName])) }
        </td>
      </tr>
    ) : <tr><td>Not</td><td>Available</td></tr>;
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
        return 'Not Available';
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
        return 'Not Available';
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
        return 'Not Available';
    }
  }

  render() {
    let profAvgs = this._getProfAvgRatings();
    let overallAvgs = this._getAverageValues();
    return (
      <div className='top-row'>
        <h1 className='header'>
          <Link to={`/institutions/${this.props.courseInfo.inst_id}`}>{this.props.courseInfo.inst_display_name} </Link>
          > <Link to={`/courses/${this.props.courseInfo.id}`}>{this.props.courseInfo.short_display_name} </Link>
          > <span className='review-name'>Reviews</span>
          <button className='button' onClick={() => HandleModal('new-course-review-form')}>New Review</button>
        </h1>
        <div className='summary columns'>
          <table className='top-row-info column is-6'>
            <thead>
              <tr><th colSpan='2'>Average Ratings:</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Overvall:</td>
                <td className='second-column'>
                  <div className='star-rating'>
                    <div className='outer'>
                      <i className='fa fa-star-o' aria-hidden='true' />
                      <div className='inner' style={{ width: `${this._calcStarPercent(0, overallAvgs.overallRating)}%` }}>
                        <i className='fa fa-star' aria-hidden='true' />
                      </div>
                    </div>
                    <div className='outer'>
                      <i className='fa fa-star-o' aria-hidden='true' />
                      <div className='inner' style={{ width: `${this._calcStarPercent(1, overallAvgs.overallRating)}%` }}>
                        <i className='fa fa-star' aria-hidden='true' />
                      </div>
                    </div>
                    <div className='outer'>
                      <i className='fa fa-star-o' aria-hidden='true' />
                      <div className='inner' style={{ width: `${this._calcStarPercent(2, overallAvgs.overallRating)}%` }}>
                        <i className='fa fa-star' aria-hidden='true' />
                      </div>
                    </div>
                    <div className='outer'>
                      <i className='fa fa-star-o' aria-hidden='true' />
                      <div className='inner' style={{ width: `${this._calcStarPercent(3, overallAvgs.overallRating)}%` }}>
                        <i className='fa fa-star' aria-hidden='true' />
                      </div>
                    </div>
                    <div className='outer'>
                      <i className='fa fa-star-o' aria-hidden='true' />
                      <div className='inner' style={{ width: `${this._calcStarPercent(4, overallAvgs.overallRating)}%` }}>
                        <i className='fa fa-star' aria-hidden='true' />
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Teaching:</td>
                <td className='second-column'>{this._decodeProf(overallAvgs.profRating)}</td>
              </tr>
              <tr>
                <td>Evaluation:</td>
                <td className='second-column'>{this._decodeFairness(overallAvgs.fairnessRating)}</td>
              </tr>
              <tr>
                <td>Workload:</td>
                <td className='second-column'>{this._decodeWorkload(overallAvgs.workloadRating)}</td>
              </tr>
            </tbody>
          </table>
          <table className='top-row-info column is-6'>
            <thead>
              <tr><th colSpan='2'>Previous Instructors:</th></tr>
            </thead>
            <tbody>
              { profAvgs }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default TopRow;
