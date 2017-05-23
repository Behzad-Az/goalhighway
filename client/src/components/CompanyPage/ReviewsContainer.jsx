import React, {Component} from 'react';
import ReviewRow from './ReviewRow.jsx';

class ReviewsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      showContainer: true,
      companyId: this.props.companyId,
      reviews: [],
      noMoreFeeds: false,
      parentState: this.props.parentState
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._renderLoadMoreBtn = this._renderLoadMoreBtn.bind(this);
    this._renderCompAfterData = this._renderCompAfterData.bind(this);
  }

  componentDidMount() {
    this._loadComponentData(false);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.companyId !== this.state.companyId) {
      this.setState({ companyId: nextProps.companyId });
      this._loadComponentData(true, nextProps.companyId);
    }
    if (nextProps.parentState !== this.state.parentState) {
      this.setState({ parentState: nextProps.parentState });
      this._loadComponentData(true);
    }
  }

  _loadComponentData(freshReload, companyId) {
    fetch(`/api/companies/${companyId || this.state.companyId}/reviews?reviewsoffset=${freshReload ? 0 : this.state.reviews.length}`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON, freshReload))
    .catch((err) => {
      this.setState({ dataLoaded: true, pageError: true });
    });
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

  _renderLoadMoreBtn() {
    if (this.state.reviews.length) {
      const btnContent = this.state.noMoreFeeds && this.state.reviews.length ? 'All reviews shown' : 'Load More';
      return (
        <p className='end-msg'>
          <button className='button is-link' disabled={this.state.noMoreFeeds} onClick={() => this._loadComponentData(false)}>{btnContent}</button>
        </p>
      );
    } else {
      return <p>No company review available.</p>;
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
        <div className='reviews-container'>
          <h1 className='header'>
            Company Reviews:
            <i
              className={this.state.showContainer ? 'fa fa-angle-down' : 'fa fa-angle-up'}
              aria-hidden='true'
              onClick={() => this.setState({ showContainer: !this.state.showContainer })}
            />
          </h1>
          <div className={this.state.showContainer ? 'is-visible' : 'is-hidden'}>
            { this.state.reviews.map(review => <ReviewRow key={review.id} review={review} /> ) }
            { this._renderLoadMoreBtn() }
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

export default ReviewsContainer;
