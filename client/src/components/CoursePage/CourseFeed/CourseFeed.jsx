import React, {Component} from 'react';
import NewCourseFeed from './NewCourseFeed.jsx';
import FeedRow from './FeedRow.jsx';

class CourseFeed extends Component {
  render() {
    return (
      <div className='feed-container'>
        <h1 className='header'>
          Course Feed
          <i className='fa fa-angle-down' aria-hidden='true' />
        </h1>
        <NewCourseFeed courseId={this.props.courseId} reload={this.props.reload} />
        <hr />
        { this.props.courseFeed.map(feed => <FeedRow key={feed.id} feed={feed} /> ) }
      </div>
    );
  }
}

export default CourseFeed;
