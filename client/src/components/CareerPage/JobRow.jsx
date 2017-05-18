import React, {Component} from 'react';
import { Link } from 'react-router';

class JobRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flagRequest: false,
      flagReason: ''
    };
    this._handleFlagClick = this._handleFlagClick.bind(this);
    this._handleFlagSubmit = this._handleFlagSubmit.bind(this);
    this._renderFlagSelect = this._renderFlagSelect.bind(this);
  }

  _handleFlagClick() {
    let flagRequest = !this.state.flagRequest;
    this.setState({ flagRequest });
  }

  _handleFlagSubmit(e) {
    if (e.target.value) {
      let newState = {};
      newState[e.target.name] = e.target.value;
      fetch(`/api/flags/jobs/${this.props.job.id}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newState)
      })
      .then(response => response.json())
      .then(resJSON => { if (!resJSON) throw 'Server returned false' })
      .catch(err => console.error('Unable to post flag - ', err))
      .then(() => this.setState(newState));
    }
  }

  _renderFlagSelect() {
    return (
      <small className='control flag-submission'>
        <span className='select is-small'>
          <select name='flagReason' onChange={this._handleFlagSubmit}>
            <option value=''>select reason</option>
            <option value='expired link'>Expired link</option>
            <option value='poor categorization'>Poor categorization</option>
            <option value='spam'>Spam</option>
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
            <img src={`http://localhost:19001/images/companies/${this.props.job.photo_name}`} />
          </p>
        </figure>
        <div className='media-content'>
          <div className='content'>
            <p>
              <Link><button className='button'>Apply Now!</button></Link>
              <strong>{this.props.job.title}</strong>
              <br />
              <Link to={`/companies/${this.props.job.company_id}`}>@{this.props.job.company}</Link>
              <br />
              Job Level: {this.props.job.kind}
              <br />
              {this.props.job.tags.map((tag, index) => <span key={index} className='tag'>{tag}</span>)}
              <br />
              <small><Link to={`/companies/${this.props.job.company_id}`}>Company Page</Link></small>
              <i className='fa fa-flag expandable' aria-hidden='true' onClick={this._handleFlagClick} style={{ color: this.state.flagRequest ? '#9D0600' : 'inherit' }} />
              {this.state.flagRequest && this._renderFlagSelect()}
            </p>
          </div>
        </div>
      </article>
    );
  }
}

export default JobRow;
