import React, {Component} from 'react';
import NewCourseFeedForm from './NewCourseFeedForm.jsx';
import CourseFeedRow from './CourseFeedRow.jsx';

class CourseFeedsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showContainer: true
    };
  }

  render() {
    return (
      <div className='feeds-container'>
        <h1 className='header'>
          Course Feed:
          <i
            className={this.state.showContainer ? 'fa fa-angle-down' : 'fa fa-angle-up'}
            aria-hidden='true'
            onClick={() => this.setState({ showContainer: !this.state.showContainer })}
          />
        </h1>
        <NewCourseFeedForm courseId={this.props.courseId} reload={this.props.reload} />
        <hr />
        <div className={this.state.showContainer ? 'feeds-rows' : 'feeds-rows is-hidden'}>
          { this.props.courseFeeds.map(feed => <CourseFeedRow key={feed.id} feed={feed} reload={this.props.reload} composeNewEmail={this.props.composeNewEmail} removeComment={this.props.removeComment} /> ) }
          { !this.props.courseFeeds.length && <p>No course feed available yet.</p> }
        </div>
      </div>
    );
  }
}

export default CourseFeedsContainer;
