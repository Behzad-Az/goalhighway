import React, {Component} from 'react';
import { Link } from 'react-router';

class LeftSideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      userInfo: { username: 'N/A', created_at: 'N/A' },
      progName: 'N/A',
      instName: 'N/A',
      contributionCount: 'N/A'
    };
    this._conditionData = this._conditionData.bind(this);
  }

  componentWillMount() {
    fetch('/api/leftsidebar', {
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
      <div className='card side-bar left'>
        <Link to='users/currentuser' className='button is-info edit'>Edit</Link>
        <div className='card-image'>
          <figure className='image is-4by3'>
            <img src='http://www.free-icons-download.net/images/user-icon-27998.png' alt='Image' />
          </figure>
        </div>
        <div className='card-content'>
          <div className='media'>
            <div className='media-content'>
              <p className='title is-4'>{this.state.userInfo.username}</p>
            </div>
          </div>
          <div className='content'>
            <p>{this.state.progName}</p>
            <p>{this.state.instName}</p>
            <p>Contribution: {this.state.contributionCount} <i className='fa fa-star' aria-hidden='true' /></p>
            <small>Member Since - {this.state.userInfo.created_at.slice(0, 10)}</small>
          </div>
        </div>
      </div>
    ) : <p></p>;
  }
}

export default LeftSideBar;
