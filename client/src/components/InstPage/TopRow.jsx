import React, {Component} from 'react';
import NewInstForm from './NewInstForm.jsx';
import SingleSelect from '../partials/SingleSelect.jsx';

class TopRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNewInstForm: false
    };
    this._toggleNewInstForm = this._toggleNewInstForm.bind(this);
  }

  _toggleNewInstForm() {
    this.setState({ showNewInstForm: !this.state.showNewInstForm });
  }

  render() {
    return (
      <div className='top-row'>
        <NewInstForm
          reload={this.props.reload}
          showModal={this.state.showNewInstForm}
          toggleModal={this._toggleNewInstForm}
        />
        <h1 className='header'>
          Institution:
          <button className='button' onClick={this._toggleNewInstForm}>Don't see your institution?</button>
        </h1>
        <div className='inst-dropdown control'>
          <SingleSelect
            disabled={false}
            initialValue={this.props.instId}
            name='instList'
            options={this.props.instList}
            handleChange={this.props.reload} />
        </div>
      </div>
    );
  }
}

export default TopRow;
