import React, {Component} from 'react';

class ControlSideBarRow extends Component {
  constructor(props) {
    super(props);
    this._determineEmailPreviewText = this._determineEmailPreviewText.bind(this);
  }

  _determineEmailPreviewText() {
    let content = this.props.email.conversations[0].content;
    return content.length < 90 ? content : `${content.slice(0, 87)}...`;
  }

  render() {
    return (
      <article className='media control-bar-row' onClick={() => this.props.selectEmail(this.props.email.id)}>
        <figure className='media-left'>
          <p className='image is-48x48'>
            <img src={`http://localhost:19001/images/userphotos/${this.props.email.conversations[0].photo_name}`} />
          </p>
        </figure>
        <div className='media-content'>
          <div className='content'>
            <strong>{this.props.email.subject}</strong>
            <br />
            <strong>@{this.props.email.conversations[0].sender_name}</strong>
            <br />
            { this._determineEmailPreviewText() }
            <br />
            <small>{this.props.email.conversations[0].sent_at.slice(0, 10)}</small>
            <br />
          </div>
        </div>
      </article>
    );
  }
}

export default ControlSideBarRow;
