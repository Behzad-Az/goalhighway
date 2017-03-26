import React, {Component} from 'react';
import CourseFeed from '../CoursePage/CourseFeed/CourseFeed.jsx';

class RightSideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      courseCount: 'N/A',
      courseFeeds: [],
      instName: 'N/A',
      revCount: 'N/A',
      studentCount: 'N/A',
      tutorCount: 'N/A'
    };
    this._conditionData = this._conditionData.bind(this);
  }

  componentWillMount() {
    fetch('/api/rightsidebar', {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  _conditionData(resJSON) {
    if (resJSON) {
      resJSON.dataLoaded = true;
      this.setState(resJSON);
    } else {
      throw 'Server returned false';
    }
  }

  render() {
    return this.state.dataLoaded ? (
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
