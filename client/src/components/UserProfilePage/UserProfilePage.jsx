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
    $.ajax({
      method: 'GET',
      url: '/api/users/currentuser',
      dataType: 'JSON',
      success: response => this.conditionData(response)
    });
  }

  conditionData(response) {
    if (response) {
      let userInfo = {
        username: response.username,
        email: response.email,
        instDisplayName: response.inst_display_name,
        instId: response.inst_id,
        progDisplayName: response.prog_display_name,
        progId: response.prog_id,
        userYear: response.user_year
      };
      this.setState({ userInfo, dataLoaded: true });
    } else {
      this.setState({ dataLoaded: true, pageError: true });
    }
  }

  render() {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="main-container">
          <SearchBar />
          <PersonalInformation userInfo={this.state.userInfo} dataLoaded={this.state.dataLoaded && !this.state.pageError} />
        </div>
        { this.reactAlert.container }
      </div>
    );
  }
}

export default UserProfilePage;
