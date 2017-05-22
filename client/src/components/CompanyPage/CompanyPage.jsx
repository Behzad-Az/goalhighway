import React, {Component} from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import TopRow from './TopRow.jsx';
import JobsContainer from './JobsContainer.jsx';
import ReviewsContainer from './ReviewsContainer.jsx';
import QaContainer from './QaContainer.jsx';
import LeftSideBar from '../partials/LeftSideBar.jsx';
import RightSideBar from '../RightSideBar/RightSideBar.jsx';
import SearchBar from '../partials/SearchBar.jsx';

class CompanyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qasState: 0,
      companyReviewsState: 0
    };
    this._updateCompState = this._updateCompState.bind(this);
  }

  _updateCompState(state) {
    let newState = {};
    newState[state] = this.state[state] + 1;
    this.setState(newState);
  }

  render() {
    return (
      <div className='company-page'>
        <Navbar />
        <LeftSideBar />
        <div className='main-container'>
          <SearchBar />
          <TopRow companyId={this.props.routeParams.company_id} updateCompState={this._updateCompState} />
          <JobsContainer companyId={this.props.routeParams.company_id} />
          <ReviewsContainer companyId={this.props.routeParams.company_id} />
          <QaContainer companyId={this.props.routeParams.company_id} parentState={this.state.qasState} />
        </div>
        <RightSideBar />
      </div>
    );
  }
}

export default CompanyPage;
