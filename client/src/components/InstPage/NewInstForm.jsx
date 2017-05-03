import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';
import SingleSelect from '../partials/SingleSelect.jsx';

class NewInstForm extends Component {
  constructor(props) {
    super(props);
    this.countryList = [ { value: 'canada', label: 'Canada' }, { value: 'united_states', label: 'United State of America (USA)' } ];
    this.provinceList = {
      canada: [ { value: '', label: '-' },
        { value: 'Alberta', label: 'Alberta' }, { value: 'British Columbia', label: 'British Columbia' }, { value: 'Manitoba', label: 'Manitoba' },
        { value: 'New Brunswick', label: 'New Brunswick' }, { value: 'Newfoundland and Labrador', label: 'Newfoundland and Labrador' },
        { value: 'Northwest Territories', label: 'Northwest Territories' }, { value: 'Nova Scotia', label: 'Nova Scotia' }, { value: 'Nunavut', label: 'Nunavut' },
        { value: 'Ontario', label: 'Ontario' }, { value: 'Prince Edward Island', label: 'Prince Edward Island' }, { value: 'Quebec', label: 'Quebec' },
        { value: 'Saskatchewan', label: 'Saskatchewan' }, { value: 'Yukon', label: 'Yukon' }
      ],
      united_states: [ { value: '', label: '-' },
        { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' }, { value: 'AS', label: 'American Samoa' }, { value: 'AZ', label: 'Arizona' }, { value: 'AR', label: 'Arkansas' },
        { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' }, { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' }, { value: 'DC', label: 'District Of Columbia' },
        { value: 'FM', label: 'Federated States Of Micronesia' }, { value: 'FL', label: 'Florida' }, { value: 'GA', label: 'Georgia' }, { value: 'GU', label: 'Guam' },
        { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' }, { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' }, { value: 'IA', label: 'Iowa' }, { value: 'KS', label: 'Kansas' },
        { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' }, { value: 'ME', label: 'Maine' }, { value: 'MH', label: 'Marshall Islands' }, { value: 'MD', label: 'Maryland' },
        { value: 'MA', label: 'Massachusetts' }, { value: 'MI', label: 'Michigan' }, { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' }, { value: 'MO', label: 'Missouri' },
        { value: 'MT', label: 'Montana' }, { value: 'NE', label: 'Nebraska' }, { value: 'NV', label: 'Nevada' }, { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
        { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' }, { value: 'NC', label: 'North Carolina' }, { value: 'ND', label: 'North Dakota' }, { value: 'MP', label: 'Northern Mariana Islands' },
        { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' }, { value: 'OR', label: 'Oregon' }, { value: 'PW', label: 'Palau' }, { value: 'PA', label: 'Pennsylvania' },
        { value: 'PR', label: 'Puerto Rico' }, { value: 'RI', label: 'Rhode Island' }, { value: 'SC', label: 'South Carolina' }, { value: 'SD', label: 'South Dakota' },
        { value: 'TN', label: 'Tennessee' }, { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' }, { value: 'VT', label: 'Vermont' }, { value: 'VI', label: 'Virgin Islands' },
        { value: 'VA', label: 'Virginia' }, { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' }, { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' }
      ]
    };
    this.reactAlert = new ReactAlert();
    this.formLimits = {
      instLongName: 60,
      instShortName: 10
    };
    this.state = {
      instLongName: '',
      instShortName: '',
      country: '',
      province: ''
    };
    this._handleChange = this._handleChange.bind(this);
    this._validateForm = this._validateForm.bind(this);
    this._handleCountrySelect = this._handleCountrySelect.bind(this);
    this._handleProvinceSelect = this._handleProvinceSelect.bind(this);
    this._handleNewInstPost = this._handleNewInstPost.bind(this);
  }

  _handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  _validateForm() {
    return this.state.instLongName && this.state.instLongName.length <= this.formLimits.instLongName &&
           this.state.instShortName.length <= this.formLimits.instShortName &&
           this.state.country &&
           this.state.province;
  }

  _handleCountrySelect(country) {
    this.setState({ country });
  }

  _handleProvinceSelect(province) {
    this.setState({ province });
  }

  _handleNewInstPost() {
    let data = {
      country: this.state.country,
      province:  this.state.province,
      instLongName: this.state.instLongName,
      instShortName: this.state.instShortName
    };

    fetch('/api/institutions', {
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
      if (resJSON) {
        this.reactAlert.showAlert('New institution added.', 'info');
        this.props.reload();
      }
      else { throw 'Server returned false'; }
    })
    .catch(() => this.reactAlert.showAlert('Unable to add new institution', 'error'))
    .then(this.props.toggleModal);
  }

  render() {
    return (
      <div className={this.props.showModal ? 'modal is-active' : 'modal'}>
        <div className='modal-background' onClick={this.props.toggleModal}></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>New Institution</p>
            <button className='delete' onClick={this.props.toggleModal}></button>
          </header>
          <section className='modal-card-body'>

            <label className='label'>
              Institution Full Name:
              { this.state.instLongName.length > this.formLimits.instLongName && <span className='char-limit'>too long!</span> }
            </label>
            <p className='control'>
              <input
                className='input'
                type='text'
                name='instLongName'
                placeholder='Example: University of British Columbia'
                onChange={this._handleChange}
                style={{ borderColor: this.state.instLongName.length > this.formLimits.instLongName ? '#9D0600' : '' }} />
            </p>

            <label className='label'>
              Institution Given Name (optional):
              { this.state.instShortName.length > this.formLimits.instShortName && <span className='char-limit'>too long!</span> }
            </label>
            <p className='control'>
              <input
                className='input'
                type='text'
                name='instShortName'
                placeholder='Example (optional): UBC'
                onChange={this._handleChange}
                style={{ borderColor: this.state.instShortName.length > this.formLimits.instShortName ? '#9D0600' : '' }} />
            </p>

            <label className='label'>Country:</label>
            <SingleSelect disabled={false} initialValue={this.state.country} name='country' options={this.countryList} handleChange={this._handleCountrySelect} />

            <label className='label'>State / Province:</label>
            <SingleSelect disabled={false} initialValue={this.state.province} name='province' options={this.provinceList[this.state.country]} handleChange={this._handleProvinceSelect} />

          </section>
          <footer className='modal-card-foot'>
            <button className='button is-primary' disabled={!this._validateForm()} onClick={this._handleNewInstPost}>Submit</button>
            <button className='button' onClick={this.props.toggleModal}>Cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default NewInstForm;
