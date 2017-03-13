import React, {Component} from 'react';
import { Link } from 'react-router';

class DocCard extends Component {
  constructor(props) {
    super(props);
    this.originalLikeCount = props.doc.likeCount;
    this.images = ['pdf.png', 'docx.png', 'xlsx.png', 'zip.png', 'default.png'];
    this.findImageLink = this.findImageLink.bind(this);
    this.state = {
      likeCount: this.props.doc.likeCount,
      likeColor: '',
      dislikeColor: '',
      imageLink: this.findImageLink(this.props.doc.revisions[0].file_path)
    };
    this.handleLikeSubmission = this.handleLikeSubmission.bind(this);
    this.handleDislikeSubmission = this.handleDislikeSubmission.bind(this);
    this.sendLikeDislike = this.sendLikeDislike.bind(this);
  }

  findImageLink(filePath) {
    let directoryPath = '../../images/';
    let extension = filePath.substr(filePath.lastIndexOf('.') + 1) + '.png';
    return this.images.includes(extension) ? `${directoryPath}${extension}` : `${directoryPath}default.png`;
  }

  handleLikeSubmission(e) {
    let color = e.target.style.color;
    let value = color === 'green' ? -1 : 1;
    let nextState = {
      likeCount: this.state.likeCount + value,
      likeColor: this.state.likeCount === this.originalLikeCount ? 'green' : '',
      dislikeColor: ''
    };
    this.sendLikeDislike(value);
    this.setState(nextState);
  }

  handleDislikeSubmission(e) {
    let color = e.target.style.color;
    let value = color === 'red' ? 1 : -1;
    let nextState = {
      likeCount: this.state.likeCount + value,
      likeColor: '',
      dislikeColor: this.state.likeCount === this.originalLikeCount ? 'red' : ''
    };
    this.sendLikeDislike(value);
    this.setState(nextState);
  }

  sendLikeDislike(value) {
    fetch(`/api/courses/${this.props.doc.course_id}/docs/${this.props.doc.id}/likes`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ like_or_dislike: value })
    })
    .then(response => response.json())
    .then(resJSON => {
      if (!resJSON) { throw 'Server returned false.'; }
    })
    .catch(err => console.error('Unable to like / dislike document - ', err));
  }

  render() {
    return (
      <div className='doc-index card'>
        <div className='card-content'>
          <div className='card-image'>
            <figure className='image is-64x64'>
              <img src={this.state.imageLink} alt='doc-type' />
            </figure>
          </div>
          <div className='card-text'>
            <p className='name title is-6'>{this.props.doc.title}</p>
            <p className='description title is-6'>'{this.props.doc.revisions[0].rev_desc}'</p>
            <p className='date title is-6'>Upload Date: {this.props.doc.doc_created_at.slice(0, 10)}</p>
            <p className='date title is-6'>Revision: {this.props.doc.revisions.length} - {this.props.doc.revisions[0].rev_created_at.slice(0, 10)}</p>
          </div>
          <p className='card-foot title is-6'>
            <i onClick={this.handleLikeSubmission} className='fa fa-thumbs-up' aria-hidden='true' style={{cursor: 'pointer', color: this.state.likeColor}} />
            <span className='text-link'>
              <Link to={`/courses/${this.props.doc.course_id}/docs/${this.props.doc.id}`}>See All Revisions</Link>
            </span>
            <i onClick={this.handleDislikeSubmission} className='fa fa-thumbs-down' aria-hidden='true' style={{cursor: 'pointer', color: this.state.dislikeColor}} />
            {this.state.likeCount}
          </p>
        </div>
      </div>
    );
  }
}

export default DocCard;
