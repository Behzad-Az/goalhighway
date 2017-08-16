import React, {Component} from 'react';

class SocialNumbers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      courseCount: 0,
      revCount: 0,
      jobCount: 0
    };
    this._conditionData = this._conditionData.bind(this);
    this._commaSeparateNumber = this._commaSeparateNumber.bind(this);
  }

  componentDidMount() {
    fetch('/api/front_page_numbers', {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  _conditionData(resJSON) {
    if (resJSON) {
      this.setState({
        courseCount: this._commaSeparateNumber(parseInt(resJSON.courseCount)),
        revCount: this._commaSeparateNumber(parseInt(resJSON.revCount)),
        jobCount: this._commaSeparateNumber(parseInt(resJSON.jobCount)),
        dataLoaded: true
      });
    } else {
      throw 'Server returned false';
    }
  }

  _commaSeparateNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  render() {
    return (
      <div className='social-numbers'>

        <div className='social-number'>
          <p className='value'>{this.state.courseCount}</p>
          <p className='type'>Courses</p>
        </div>
        <div className='social-number'>
          <p className='value'>{this.state.revCount}</p>
          <p className='type'>Documents</p>
        </div>
        <div className='social-number'>
          <p className='value'>{this.state.jobCount}</p>
          <p className='type'>Jobs</p>
        </div>
      </div>
    );
  }
}

export default SocialNumbers;
