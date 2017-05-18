import React, {Component} from 'react';
import { Link } from 'react-router';

class LeftSideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      userInfo: { username: 'N/A', created_at: 'N/A', photo_name: 'N/A' },
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
        <div className='card-image'>
          <Link to='/profile'>
            <figure className='image is-4by3'>
              <img src={`http://localhost:19001/images/users/${this.state.userInfo.photo_name}`} alt='Image' />
            </figure>
          </Link>
        </div>
        <div className='card-content'>
          <div className='media'>
            <div className='media-content'>
              <Link to='/profile' className='title is-4'>@{this.state.userInfo.username}</Link>
            </div>
          </div>
          <hr />
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
