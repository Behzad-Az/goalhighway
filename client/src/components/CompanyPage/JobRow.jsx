import React, {Component} from 'react';
import { Link } from 'react-router';

class JobRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flagRequest: false,
      flagReason: ''
    };
    this.handleFlagClick = this.handleFlagClick.bind(this);
    this.handleFlagSubmit = this.handleFlagSubmit.bind(this);
    this.renderFlagSelect = this.renderFlagSelect.bind(this);
  }

  handleFlagClick() {
    let flagRequest = !this.state.flagRequest;
    this.setState({ flagRequest });
  }

  handleFlagSubmit(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    fetch(`/api/flags/jobs/${this.props.job.id}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(state)
    })
    .then(response => response.json())
    .then(resJSON => { if (!resJSON) throw 'Server returned false' })
    .catch(err => console.error('Unable to post flag - ', err))
    .then(() => this.setState(state));
  }

  renderFlagSelect() {
    return (
      <small className='control flag-submission'>
        <span className='select is-small'>
          <select name='flagReason' onChange={this.handleFlagSubmit}>
            <option value=''>select reason</option>
            <option value='expired link'>Expired link</option>
            <option value='poor categorization'>Poor categorization</option>
            <option value='other'>Other</option>
          </select>
        </span>
      </small>
    );
  }

  render() {
    return (
      <article className='media job-row'>
        <figure className='media-left'>
          <p className='image is-64x64'>
            <img src='http://bulma.io/images/placeholders/128x128.png' />
          </p>
        </figure>
        <div className='media-content'>
          <div className='content'>
            <p>
              <strong>{this.props.job.title}</strong>
              <br />
              Job Level: {this.props.job.kind}
              <br />
              {this.props.job.tags.map((tag, index) => <span key={index} className='tag'>{tag}</span>)}
              <br />
              <small><Link>Apply Now!</Link></small>
              <i className='fa fa-flag' aria-hidden='true' onClick={this.handleFlagClick} style={{ color: this.state.flagRequest ? '#9D0600' : 'inherit' }} />
              {this.state.flagRequest && this.renderFlagSelect()}
            </p>
          </div>
        </div>
      </article>
    );
  }
}

export default JobRow;
