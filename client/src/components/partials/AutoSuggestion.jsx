import React, {Component} from 'react';
import Autosuggest from 'react-autosuggest';

const escapeRegexCharacters = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = suggestion => <span>{suggestion.name}</span>;

class AutoSuggestion extends Component {
  constructor(props) {
    super(props);
    this.options = this.props.options || [];
    this.getSuggestions = this.getSuggestions.bind(this);
    this.state = {
      value: '',
      suggestions: this.getSuggestions('')
    };
  }

  componentWillReceiveProps(nextProps) {
    this.options = nextProps.options;
  }

  getSuggestions(value) {
    const escapedValue = escapeRegexCharacters(value.trim());
    if (escapedValue === '') { return []; }
    const regex = new RegExp(escapedValue, 'ig');
    return this.options.filter(option => regex.test(option.name));
  }

  onChange = (event, { newValue }) => {
    getSuggestionValue(newValue);
    this.setState({
      value: newValue
    });
    this.props.onChange(newValue);
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "We'll auto-suggest some results :)",
      value,
      onChange: this.onChange
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

export default AutoSuggestion;
