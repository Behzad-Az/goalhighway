import React, {Component} from 'react';
import {Link} from 'react-router';
import SingleSelect from '../partials/SingleSelect.jsx';
import ReactAlert from '../partials/ReactAlert.jsx';
import ImageCropper from '../partials/ImageCropper.jsx';

class PersonalInformation extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.academicYears = [ { value: 1, label: 'Year 1'}, { value: 2, label: 'Year 2'}, { value: 2, label: 'Year 2'}, { value: 3, label: 'Year 3'}, { value: 4, label: 'Year 4'}, { value: 5, label: 'Year 5'}, { value: 6, label: 'Year 6'} ];
    this.formData = new FormData();
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
    this._conditionData = this._conditionData.bind(this);
    this._toggleView = this._toggleView.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._handleUpdateProfile = this._handleUpdateProfile.bind(this);
    this._showInfo = this._showInfo.bind(this);
    this._editInfo = this._editInfo.bind(this);
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
    .then(resJSON => this._conditionData(resJSON))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  _conditionData(resJSON) {
    if (resJSON) {
      const instProgDropDownList = resJSON.insts.map(inst => {
        const programs = inst.programs.map(prog => {
          return { value: prog.id, label: prog.prog_display_name };
        });
        return { value: inst.id, label: inst.inst_display_name, programs };
      });
      this.setState({ instProgDropDownList, dataLoaded: true });
    } else {
      throw 'Server returned false';
    }
  }

  _handleChange(e) {
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  _toggleView() {
    this.setState({ editView: !this.state.editView });
  }

  _handleUpdateProfile() {
    this.formData.set('type', 'profile');
    this.formData.set('username', this.state.username.trim().toLowerCase());
    this.formData.set('email', this.state.email.trim().toLowerCase());
    this.formData.set('userYear', this.state.userYear);
    this.formData.set('instId', this.state.instId);
    this.formData.set('progId', this.state.progId);

    fetch('/api/users/currentuser', {
      method: 'PUT',
      credentials: 'same-origin',
      body: this.formData
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) { this.reactAlert.showAlert('User profile saved', 'info'); }
      else { throw 'Server returned false'; }
    })
    .catch(() => this.reactAlert.showAlert('Could not save user profile', 'error'))
    .then(() => this._toggleView());
  }

  _showInfo() {
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
                onClick={this._toggleView}>
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

  _editInfo() {
    const programList = this.state.instId ? this.state.instProgDropDownList.find(item => item.value == this.state.instId).programs : [];
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
              <label className='label'>Profile Picture:</label>
              <ImageCropper formData={this.formData} />
            </div>

            <div className='control'>
              <label className='label'>Username:</label>
              <input type='text'
                     className='input'
                     placeholder='Enter username'
                     name='username'
                     defaultValue={this.state.username}
                     onChange={this._handleChange} />
            </div>

            <div className='control'>
              <label className='label'>Email:</label>
              <input type='text'
                     className='input'
                     placeholder='Enter email'
                     name='email'
                     defaultValue={this.state.email}
                     onChange={this._handleChange} />
            </div>

            <div className='control'>
              <label className='label'>Primary Institution:</label>
              <SingleSelect
                disabled={false}
                initialValue={this.state.instId}
                options={this.state.instProgDropDownList}
                name='instId'
                handleChange={(instId, instDisplayName) => this.setState({ instId, instDisplayName })} />
            </div>

            <div className='control'>
              <label className='label'>Primary Program:</label>
              <SingleSelect
                disabled={false}
                initialValue={this.state.progId}
                options={programList}
                name='progId'
                handleChange={(progId, progDisplayName) => this.setState({ progId, progDisplayName })} />
            </div>

            <div className='control'>
              <label className='label'>Primary Academic Year:</label>
              <SingleSelect
                disabled={false}
                initialValue={this.state.userYear}
                options={this.academicYears}
                name='userYear'
                handleChange={userYear => this.setState({ userYear })} />
            </div>
          </div>

          <footer className='card-footer'>
            <Link className='card-footer-item' onClick={this._handleUpdateProfile}>Save</Link>
            <Link className='card-footer-item' onClick={this._toggleView}>Cancel</Link>
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
            <Link className='card-footer-item' onClick={this._toggleView}>View Profile</Link>
          </footer>
        </div>
      );
    }
  }

  render() {
    return (
      <div className='personal-info-container'>
        { this.state.editView ? this._editInfo() : this._showInfo() }
      </div>
    );
  }
}

export default PersonalInformation;
