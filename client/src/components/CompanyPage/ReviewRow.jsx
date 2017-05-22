import React, {Component} from 'react';

class ReviewRow extends Component {
  constructor(props) {
    super(props);
    this._decodePositionType = this._decodePositionType.bind(this);
    this._decodeWorkDuration = this._decodeWorkDuration.bind(this);
    this._decodeTrainingRating = this._decodeTrainingRating.bind(this);
    this._decodeRelevancyRating = this._decodeRelevancyRating.bind(this);
    this._decodePayRating = this._decodePayRating.bind(this);
  }

  _decodePositionType() {
    switch (this.props.review.position_type) {
      case 'summer':
        return 'Part Time / Summer Job';
      case 'internship':
        return 'Internship / Coop';
      case 'junior':
        return 'New Grad / Junior';
      default:
        return 'Unknown';
    }
  }

  _decodeWorkDuration() {
    switch (this.props.review.work_duration) {
      case 1:
        return 'Less than 6 months';
      case 2:
        return '6 to 12 months';
      case 3:
        return '1 to 2 years';
      case 4:
        return 'More than 2 years';
      default:
        return 'Unknown';
    }
  }

  _decodeTrainingRating() {
    switch (this.props.review.training_rating) {
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
        return 'Unknown';
    }
  }

  _decodeRelevancyRating() {
    switch (this.props.review.relevancy_rating) {
      case 1:
        return 'Not relevant';
      case 2:
        return 'Somewhat relevant';
      case 3:
        return 'Very relevant';
      default:
        return 'Unknown';
    }
  }

  _decodePayRating() {
    switch (this.props.review.pay_rating) {
      case 1:
        return 'Below Average';
      case 2:
        return 'Average';
      case 3:
        return 'Above Average';
      default:
        return 'Unknown';
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
              <td>Position:</td>
              <td>{this.props.review.position}</td>
            </tr>
            <tr>
              <td>Position Type:</td>
              <td>{this._decodePositionType()}</td>
            </tr>
            <tr>
              <td>Reviewer Background:</td>
              <td>{this.props.review.reviewer_background}</td>
            </tr>
            <tr>
              <td>Started On:</td>
              <td>{this.props.review.start_month} {this.props.review.start_year}</td>
            </tr>
            <tr>
              <td>Employed For:</td>
              <td>{this._decodeWorkDuration()}</td>
            </tr>
            <tr>
              <td>Training & Development:</td>
              <td>{this._decodeTrainingRating()}</td>
            </tr>
            <tr>
              <td>Profession Relevancy:</td>
              <td>{this._decodeRelevancyRating()}</td>
            </tr>
            <tr>
              <td>Compensation:</td>
              <td>{this._decodePayRating()}</td>
            </tr>
            <tr>
              <td>Posted On:</td>
              <td>{this.props.review.created_at.slice(0, 10)}</td>
            </tr>
          </tbody>
        </table>
        <p className='comment'>
          <strong>Pros:</strong>
          <br />
          {this.props.review.pros}
          <br />
          <strong>Cons:</strong>
          <br />
          {this.props.review.cons}
        </p>
      </div>
    );
  }
}

export default ReviewRow;
