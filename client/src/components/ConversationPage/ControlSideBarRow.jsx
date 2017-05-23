import React, {Component} from 'react';

class ControlSideBarRow extends Component {
  constructor(props) {
    super(props);
    this._determinePreviewText = this._determinePreviewText.bind(this);
  }

  _determinePreviewText() {
    let content = this.props.conversation.messages[0].content;
    return content.length < 90 ? content : `${content.slice(0, 87)}...`;
  }

  render() {
    return (
      <article className='media control-bar-row' onClick={() => this.props.selectConversation(this.props.conversation.id)}>
        <figure className='media-left'>
          <p className='image is-48x48'>
            <img src={`/imagesapi/users/${this.props.conversation.messages[0].photo_name}`} />
          </p>
        </figure>
        <div className='media-content'>
          <div className='content'>
            <strong>{this.props.conversation.subject}</strong>
            <br />
            <strong>@{this.props.conversation.messages[0].sender_name}</strong>
            <br />
            { this._determinePreviewText() }
            <br />
            <small>{this.props.conversation.messages[0].sent_at.slice(0, 10)}</small>
            <br />
          </div>
        </div>
      </article>
    );
  }
}

export default ControlSideBarRow;
