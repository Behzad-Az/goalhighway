import React, {Component} from 'react';
import CourseFeed from '../CoursePage/CourseFeed/CourseFeed.jsx';

class RightSideBar extends Component {
  constructor(props) {
    super(props);
    this.dataLoaded = false;
    this.state = {
      courseCount: 'N/A',
      courseFeeds: [],
      instName: 'N/A',
      revCount: 'N/A',
      studentCount: 'N/A',
      tutorCount: 'N/A'
    };
  }

  componentWillMount() {
    $.ajax({
      method: 'GET',
      url: '/api/rightsidebar',
      dataType: 'JSON',
      success: response => {
        this.dataLoaded = true;
        response ? this.setState(response) : console.error('Error in server 0: ', response);
      }
    });
  }

  render() {
    return this.dataLoaded ? (
      <div className='card side-bar right'>
        <div className='card-content'>
          <div className='media'>
            <div className='media-left'>
              <figure className='image inst-logo'>
                <img src='http://www.cs.ubc.ca/~shafaei/homepage/images/logoUBC.gif' alt='Image' />
              </figure>
            </div>
            <div className='media-content'>
              <p className='title is-4'>{this.state.instName}</p>
            </div>
          </div>
          <div className='content'>
            <p><i className='fa fa-users' aria-hidden='true' /> {this.state.studentCount} peers</p>
            <p><i className='fa fa-graduation-cap' aria-hidden='true' /> {this.state.courseCount} courses available</p>
            <p><i className='fa fa-file' aria-hidden='true' /> {this.state.revCount} files posted.</p>
            <p><i className='fa fa-slideshare' aria-hidden='true' /> {this.state.tutorCount} tutors</p>
            <small>As of - 1 Jan 2016</small>
          </div>
          <CourseFeed courseFeed={this.state.courseFeeds} />
        </div>
      </div>
    ) : <p></p>;
  }
}

export default RightSideBar;
