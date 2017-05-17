import React, {Component} from 'react';
import { Link } from 'react-router';
import NewCourseReviewForm from './NewCourseReviewForm.jsx';

class TopRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      showCourseReviewForm: false,
      courseInfo: {
        id: this.props.courseId
      },
      profAvgs: [],
      courseAvgs: {
        avgOverall: -1,
        avgTeaching: -1,
        avgWorkload: -1,
        avgFairness: -1
      },
      profs: []
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._calcStarPercent = this._calcStarPercent.bind(this);
    this._getProfAvgRatings = this._getProfAvgRatings.bind(this);
    this._decodeProf = this._decodeProf.bind(this);
    this._decodeWorkload = this._decodeWorkload.bind(this);
    this._decodeFairness = this._decodeFairness.bind(this);
    this._toggleCourseReviewForm = this._toggleCourseReviewForm.bind(this);
    this._reloadPage = this._reloadPage.bind(this);
    this._renderCompAfterData = this._renderCompAfterData.bind(this);
  }

  componentDidMount() {
    this._loadComponentData();
  }

  _loadComponentData() {
    fetch(`/api/courses/${this.state.courseInfo.id}/reviews/toprow`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }))
  }

  _conditionData(resJSON) {
    if (resJSON) {
      this.setState({
        courseInfo: resJSON.courseInfo,
        profAvgs: resJSON.profAvgs,
        courseAvgs: resJSON.courseAvgs,
        profs: resJSON.profs,
        dataLoaded: true
      });
    } else {
      throw 'Server returned false';
    }
  }

  _calcStarPercent(count, avgValue) {
    if (count > avgValue) {
      return 0;
    } else {
      return (avgValue - count < 1) ? (avgValue - count) * 100 : 100;
    }
  }

  _getProfAvgRatings() {
    return this.state.profAvgs[0] ?
      this.state.profAvgs.map((avg, index) => {
        return (
          <tr key={index}>
            <td>{avg.name}:</td>
            <td className='second-column'>
              { this._decodeProf(avg.avgTeaching) }
            </td>
          </tr>
        );
      }) :
      <tr><td>Not</td><td>Available</td></tr>;
  }

  _decodeProf(value) {
    switch (Math.round(Number(value))) {
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

  _decodeWorkload(value) {
    switch (Math.round(Number(value))) {
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
    switch (Math.round(Number(value))) {
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

  _toggleCourseReviewForm() {
    this.setState({ showCourseReviewForm: !this.state.showCourseReviewForm });
  }

  _reloadPage() {
    this._loadComponentData();
    this.props.updateCompState();
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
      const profAvgs = this._getProfAvgRatings();
      return (
        <div className='top-row'>
          <NewCourseReviewForm
            courseId={this.state.courseInfo.id}
            profs={this.state.profs}
            reload={this._reloadPage}
            showModal={this.state.showCourseReviewForm}
            toggleModal={this._toggleCourseReviewForm}
          />
          <h1 className='header'>
            <Link to={`/institutions/${this.state.courseInfo.inst_id}`}>{this.state.courseInfo.inst_display_name} </Link>
            > <Link to={`/courses/${this.state.courseInfo.id}`}>{this.state.courseInfo.short_display_name} </Link>
            > <span className='review-name'>Reviews</span>
            <button className='button' onClick={this._toggleCourseReviewForm}>New Review</button>
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
                        <div className='inner' style={{ width: `${this._calcStarPercent(0, this.state.courseAvgs.avgOverall)}%` }}>
                          <i className='fa fa-star' aria-hidden='true' />
                        </div>
                      </div>
                      <div className='outer'>
                        <i className='fa fa-star-o' aria-hidden='true' />
                        <div className='inner' style={{ width: `${this._calcStarPercent(1, this.state.courseAvgs.avgOverall)}%` }}>
                          <i className='fa fa-star' aria-hidden='true' />
                        </div>
                      </div>
                      <div className='outer'>
                        <i className='fa fa-star-o' aria-hidden='true' />
                        <div className='inner' style={{ width: `${this._calcStarPercent(2, this.state.courseAvgs.avgOverall)}%` }}>
                          <i className='fa fa-star' aria-hidden='true' />
                        </div>
                      </div>
                      <div className='outer'>
                        <i className='fa fa-star-o' aria-hidden='true' />
                        <div className='inner' style={{ width: `${this._calcStarPercent(3, this.state.courseAvgs.avgOverall)}%` }}>
                          <i className='fa fa-star' aria-hidden='true' />
                        </div>
                      </div>
                      <div className='outer'>
                        <i className='fa fa-star-o' aria-hidden='true' />
                        <div className='inner' style={{ width: `${this._calcStarPercent(4, this.state.courseAvgs.avgOverall)}%` }}>
                          <i className='fa fa-star' aria-hidden='true' />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Teaching:</td>
                  <td className='second-column'>{this._decodeProf(this.state.courseAvgs.avgTeaching)}</td>
                </tr>
                <tr>
                  <td>Evaluation:</td>
                  <td className='second-column'>{this._decodeFairness(this.state.courseAvgs.avgFairness)}</td>
                </tr>
                <tr>
                  <td>Workload:</td>
                  <td className='second-column'>{this._decodeWorkload(this.state.courseAvgs.avgWorkload)}</td>
                </tr>
              </tbody>
            </table>
            <table className='top-row-info column is-6'>
              <thead>
                <tr><th colSpan='2'>Top Five Instructors:</th></tr>
              </thead>
              <tbody>
                { profAvgs }
              </tbody>
            </table>
          </div>
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
    return this._renderCompAfterData();
  }
}

export default TopRow;
