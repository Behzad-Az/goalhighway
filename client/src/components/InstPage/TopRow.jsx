import React, {Component} from 'react';
import HandleModal from '../partials/HandleModal.js';
import SingleSelect from '../partials/SingleSelect.jsx';

class TopRow extends Component {
  render() {
    return (
      <div className='top-row'>
        <h1 className='header'>
          Institution:
          <button className='button' onClick={() => HandleModal('new-inst-form')}>Don't see your institution?</button>
        </h1>
        <div className='inst-dropdown control'>
          <SingleSelect
            disabled={false}
            initialValue={parseInt(this.props.instId)}
            name='instList'
            options={this.props.instList}
            handleChange={this.props.reload} />
        </div>
      </div>
    );
  }
}

export default TopRow;
