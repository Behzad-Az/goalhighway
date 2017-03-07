import React, {Component} from 'react';
import Select from 'react-select';

const SingleSelect = React.createClass({
  getInitialState () {
    return {
      disabled: this.props.disabled,
      searchable: true,
      selectValue: this.props.initialValue,
      clearable: true
    };
  },

  updateValue(value) {
    this.setState({
      selectValue: value
    });
    let label = value ? this.props.options.find(option => option.value === value).label : '';
    this.props.handleChange(value, label);
  },

  render() {
    return <Select options={this.props.options}
              simpleValue clearable={this.state.clearable} name={this.props.name}
              disabled={this.props.disabled} value={this.props.initialValue}
              onChange={this.updateValue} searchable={this.state.searchable} />
  }
});

module.exports = SingleSelect;
