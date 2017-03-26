import React, {Component} from 'react';

class FilterInputBox extends Component {
  render() {
    return (
      <div className='filter-box'>
        <p className='control has-icon'>
          <input className='input' name='courseFilter' type='text' placeholder='Search courses here...' onChange={this.props.handleFilter} />
          <span className='icon'>
            <i className='fa fa-filter' />
          </span>
        </p>
      </div>
    );
  }
}

export default FilterInputBox;
