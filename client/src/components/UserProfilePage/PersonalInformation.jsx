import React, {Component} from 'react';
import {Link} from 'react-router';
import SingleSelect from '../partials/SingleSelect.jsx';
import ReactAlert from '../partials/ReactAlert.jsx';

class PersonalInformation extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.academicYears = [ { value: 1, label: 'Year 1'}, { value: 2, label: 'Year 2'}, { value: 2, label: 'Year 2'}, { value: 3, label: 'Year 3'}, { value: 4, label: 'Year 4'}, { value: 5, label: 'Year 5'}, { value: 6, label: 'Year 6'} ];
    this.state = {
      dataLoaded: false,
      pageError: false,
      username: '',
      email: '',
      userYear: '',
      instId: '',
      instDisplayName: '',
      progId: '',
      progDisplayName: '',
      editView: false,
      instProgDropDownList: []
    };
    this.conditionData = this.conditionData.bind(this);
    this.showInfo = this.showInfo.bind(this);
    this.editInfo = this.editInfo.bind(this);
    this.toggleView = this.toggleView.bind(this);
    this.handleInstChange = this.handleInstChange.bind(this);
    this.handleProgChange = this.handleProgChange.bind(this);
    this.handleUserYearChange = this.handleUserYearChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUpdateProfile = this.handleUpdateProfile.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.userInfo);
  }

  componentDidMount() {
    fetch('/api/institutions_programs', {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this.conditionData(resJSON))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  conditionData(resJSON) {
    if (resJSON) {
      let instProgDropDownList = resJSON.map(inst => {
        let value = inst.id;
        let label = inst.inst_display_name;
        let programs = inst.programs.map(prog => {
          let value = prog.prog_id;
          let label = prog.prog_display_name;
          return { value, label };
        });
        return { value, label, programs};
      });
      this.setState({ instProgDropDownList, dataLoaded: true });
    } else {
      throw 'Server returned false';
    }
  }

  handleInstChange(instId, instDisplayName) {
    this.setState({ instId, instDisplayName });
  }

  handleProgChange(progId, progDisplayName) {
    this.setState({ progId, progDisplayName });
  }

  handleUserYearChange(userYear) {
    this.setState({ userYear });
  }

  handleChange(e) {
    let obj = {};
    obj[e.target.name] = e.target.value;
    this.setState(obj);
  }

  toggleView() {
    this.setState({ editView: !this.state.editView })
  }

  handleUpdateProfile() {
    let data = {
      type: 'profile',
      username: this.state.username.trim().toLowerCase(),
      email: this.state.email.trim().toLowerCase(),
      userYear: this.state.userYear,
      instId: this.state.instId,
      progId: this.state.progId
    };

    fetch('/api/users/currentuser', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) { this.reactAlert.showAlert('User profile saved', 'info'); }
      else { throw 'Server returned false'; }
    })
    .catch(() => this.reactAlert.showAlert('Could not save user profile', 'error'))
    .then(this.toggleView);
  }

  showInfo() {
    if (this.props.dataLoaded) {
      return (
        <div className='card'>
          <header className='card-header'>
            <p className='card-header-title'>
              Profile Information
            </p>
            <Link className='card-header-icon'>
              <button
                className='button is-primary'
                onClick={this.toggleView}>
                Edit
              </button>
            </Link>
          </header>
          <div className='card-content'>
            <div className='content'>
              <label className='label'>Username:</label>
              <p className='title is-6'>{this.state.username}</p>
            </div>

            <div className='content'>
              <label className='label'>Email:</label>
              <p className='title is-6'>{this.state.email}</p>
            </div>

            <div className='content'>
              <label className='label'>Primary Institution:</label>
              <p className='title is-6'>{this.state.instDisplayName}</p>
            </div>

            <div className='content'>
              <label className='label'>Primary Program:</label>
              <p className='title is-6'>{this.state.progDisplayName}</p>
            </div>

            <div className='content'>
              <label className='label'>Primary Academic Year:</label>
              <p className='title is-6'>{`Year ${this.state.userYear}`}</p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className='card'>
          <header className='card-header'>
            <p className='card-header-title'>
              Profile Information
            </p>
          </header>
          <div className='card-content'>
            <div className='content'>
              <p className='title is-6'>Could not load the information...</p>
            </div>
          </div>
        </div>
      );
    }
  }

  editInfo() {
    let programList = this.state.instId ? this.state.instProgDropDownList.find(item => item.value === this.state.instId).programs : [];
    if (this.state.dataLoaded && !this.state.pageError) {
      return (
        <div className='card'>
          <header className='card-header'>
            <p className='card-header-title'>
              Profile Information
            </p>
          </header>

          <div className='card-content'>
            <div className='control'>
              <label className='label'>Username:</label>
              <input type='text' className='input is-primary'
                     placeholder='Enter username' name='username'
                     defaultValue={this.state.username}
                     onChange={this.handleChange} />
            </div>
            <div className='control'>
              <label className='label'>Email:</label>
              <input type='text' className='input is-primary'
                     placeholder='Enter email' name='email'
                     defaultValue={this.state.email}
                     onChange={this.handleChange} />
            </div>

            <div className='control'>
              <label className='label'>Primary Institution:</label>
              <SingleSelect
                disabled={false}
                initialValue={this.state.instId}
                options={this.state.instProgDropDownList}
                name='instId'
                handleChange={this.handleInstChange} />
            </div>

            <div className='control'>
              <label className='label'>Primary Program:</label>
              <SingleSelect
                disabled={false}
                initialValue={this.state.progId}
                options={programList}
                name='progId'
                handleChange={this.handleProgChange} />
            </div>

            <div className='control'>
              <label className='label'>Primary Academic Year:</label>
              <SingleSelect
                disabled={false}
                initialValue={this.state.userYear}
                options={this.academicYears}
                name='userYear'
                handleChange={this.handleUserYearChange} />
            </div>
          </div>
          <footer className='card-footer'>
            <Link className='card-footer-item' onClick={this.handleUpdateProfile}>Save</Link>
            <Link className='card-footer-item' onClick={this.toggleView}>Cancel</Link>
          </footer>
        </div>
      );
    } else {
      return (
        <div className='card'>
          <header className='card-header'>
            <p className='card-header-title'>
              Profile Information
            </p>
          </header>
          <div className='card-content'>
            <div className='content'>
              <p className='title is-6'>Unable to edit profile at this time...</p>
            </div>
          </div>
          <footer className='card-footer'>
            <Link className='card-footer-item' onClick={this.toggleView}>View Profile</Link>
          </footer>
        </div>
      );
    }
  }

  render() {
    return (
      <div className='personal-info-container'>
        { this.state.editView ? this.editInfo() : this.showInfo() }
      </div>
    );
  }
}

export default PersonalInformation;
