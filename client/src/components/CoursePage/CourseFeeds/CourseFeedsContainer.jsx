import React, {Component} from 'react';
import NewCourseFeed from './NewCourseFeed.jsx';
import CourseFeedRow from './CourseFeedRow.jsx';

class CourseFeedsContainer extends Component {
  render() {
    return (
      <div className='feeds-container'>
        <h1 className='header'>
          Course Feed
          <i className='fa fa-angle-down' aria-hidden='true' />
        </h1>
        <NewCourseFeed courseId={this.props.courseId} reload={this.props.reload} />
        <hr />
        <div className='feeds-rows'>
          { this.props.courseFeeds.map(feed => <CourseFeedRow key={feed.id} feed={feed} reload={this.props.reload} /> ) }
          { !this.props.courseFeeds.length && <p>No course feed available yet.</p> }
        </div>
      </div>
    );
  }
}

export default CourseFeedsContainer;
