import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';
import HandleModal from '../partials/HandleModal.js';
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

    this.state = {
      instLongName: '',
      instShortName: '',
      country: '',
      province: ''
    };
    this.reactAlert = new ReactAlert();
    this.handleChange = this.handleChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleCountrySelect = this.handleCountrySelect.bind(this);
    this.handleProvinceSelect = this.handleProvinceSelect.bind(this);
    this.handleNewInstPost = this.handleNewInstPost.bind(this);
  }

  handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  };

  validateForm() {
    return this.state.instLongName &&
           this.state.country &&
           this.state.province
  }

  handleCountrySelect(country) {
    this.setState({ country });
  }

  handleProvinceSelect(province) {
    this.setState({ province });
  }

  handleNewInstPost() {
    let data = {
      country: this.state.country,
      province:  this.state.province,
      inst_long_name: this.state.instLongName,
      inst_short_name: this.state.instShortName
    };
    $.ajax({
      method: 'POST',
      url: '/api/institutions',
      data: data,
      success: response => {
        response ? this.reactAlert.showAlert("New institude added.", "info") : this.reactAlert.showAlert("could not add new institude", "error");
      }
    }).always(() => {
      HandleModal('new-inst-form');
      this.props.reload();
    });
  }

  render() {
    return (
      <div id="new-inst-form" className="modal">
        <div className="modal-background" onClick={() => HandleModal('new-inst-form')}></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">New Institution</p>
            <button className="delete" onClick={() => HandleModal('new-inst-form')}></button>
          </header>
          <section className="modal-card-body">

            <label className="label">Institution Full Name:</label>
            <p className="control">
              <input className="input" type="text" name="instLongName" placeholder="Example: University of British Columbia" onChange={this.handleChange} />
            </p>

            <label className="label">Institution Given Name (optional):</label>
            <p className="control">
              <input className="input" type="text" name="instShortName" placeholder="Example (optional): UBC" onChange={this.handleChange} />
            </p>

            <label className="label">Country:</label>
            <SingleSelect disabled={false} initialValue={this.state.country} name="country" options={this.countryList} handleChange={this.handleCountrySelect} />

            <label className="label">State / Province:</label>
            <SingleSelect disabled={false} initialValue={this.state.province} name="province" options={this.provinceList[this.state.country]} handleChange={this.handleProvinceSelect} />

          </section>
          <footer className="modal-card-foot">
            <button className="button is-primary" disabled={!this.validateForm()} onClick={this.handleNewInstPost}>Submit</button>
            <button className="button" onClick={() => HandleModal('new-inst-form')}>Cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default NewInstForm;
