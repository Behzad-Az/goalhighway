import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';
import Navbar from '../Navbar/Navbar.jsx';
import SearchBar from '../partials/SearchBar.jsx';
import PersonalInformation from './PersonalInformation.jsx';

class UserProfilePage extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.state = {
      dataLoaded: false,
      pageError: false,
      userInfo: {}
    };
    this.conditionData = this.conditionData.bind(this);
  }

  componentDidMount() {
    document.title = 'My Profile';
    fetch('/api/users/currentuser', {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this.conditionData(resJSON))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  conditionData(resJSON) {
    if (resJSON) {
      const userInfo = {
        username: resJSON.userInfo.username,
        email: resJSON.userInfo.email,
        instDisplayName: resJSON.userInfo.inst_display_name,
        instId: resJSON.userInfo.inst_id,
        progDisplayName: resJSON.userInfo.prog_display_name,
        progId: resJSON.userInfo.prog_id,
        userYear: resJSON.userInfo.user_year
      };
      this.setState({ userInfo, dataLoaded: true });
    } else {
      document.title = 'My Profile - Error';
      throw 'Server returned false';
    }
  }

  render() {
    return (
      <div className='profile-page'>
        <Navbar />
        <div className='main-container'>
          <SearchBar />
          <PersonalInformation userInfo={this.state.userInfo} dataLoaded={this.state.dataLoaded && !this.state.pageError} />
        </div>
        { this.reactAlert.container }
      </div>
    );
  }
}

export default UserProfilePage;
