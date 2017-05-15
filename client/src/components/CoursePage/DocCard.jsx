import React, {Component} from 'react';
import { Link } from 'react-router';

class DocCard extends Component {
  constructor(props) {
    super(props);
    this.originalLikeCount = props.doc.likeCount;
    this.images = [
      'png.png', 'jpeg.png', 'pdf.png',
      'doc.png', 'docx.png', 'docm.png', 'xls.png', 'xlsx.png', 'xlsm.png',
      'ppt.png', 'pptx.png', 'pptm.png', 'zip.png', 'gzip.png', 'default.png'
    ];
    this._findImageLink = this._findImageLink.bind(this);
    this.state = {
      likeCount: parseInt(this.props.doc.likeCount),
      likeColor: this.props.doc.alreadyLiked ? 'rgb(0, 78, 137)' : '',
      imageLink: this._findImageLink(this.props.doc.revisions[0].file_name)
    };
    this._sendLikeDislike = this._sendLikeDislike.bind(this);
  }

  _findImageLink(fileName) {
    let directoryPath = '../../images/doccard_icons/';
    let extension = fileName.substr(fileName.lastIndexOf('.') + 1) + '.png';
    return this.images.includes(extension) ? `${directoryPath}${extension}` : `${directoryPath}default.png`;
  }

  _sendLikeDislike() {
    let likeOrDislike = this.state.likeColor === 'rgb(0, 78, 137)' ? -1 : 1;

    fetch(`/api/likes/docs/${this.props.doc.id}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ likeOrDislike })
    })
    .then(response => response.json())
    .then(resJSON => {
      if (!resJSON) { throw 'Server returned false.'; }
    })
    .catch(err => console.error('Unable to like / dislike document - ', err))
    .then(() => this.setState({
      likeCount: this.state.likeCount + likeOrDislike,
      likeColor: this.state.likeColor === 'rgb(0, 78, 137)' ? '' : 'rgb(0, 78, 137)'
    }));
  }

  render() {
    return (
      <div className='doc-index card'>
        <p className='heart'>
          <i onClick={this._sendLikeDislike} className='fa fa-heart' aria-hidden='true' style={{ cursor: 'pointer', color: this.state.likeColor }} />
          {this.state.likeCount}
        </p>
        <div className='card-content'>
          <div className='card-image'>
            <Link to={`/courses/${this.props.doc.course_id}/docs/${this.props.doc.id}`}>
              <figure className='image is-64x64'>
                <img src={this.state.imageLink} alt='doc-type' />
              </figure>
            </Link>
          </div>
          <div className='card-text'>
            <p className='name title is-6'>{this.props.doc.title}</p>
            <p className='description title is-6'>'{this.props.doc.revisions[0].rev_desc}'</p>
            <p className='date title is-6'>Upload Date: {this.props.doc.created_at.slice(0, 10)}</p>
            <p className='date title is-6'>Revision: {this.props.doc.revisions.length} - {this.props.doc.revisions[0].created_at.slice(0, 10)}</p>
          </div>
          <p className='card-foot title is-6'>
            <Link to={`/courses/${this.props.doc.course_id}/docs/${this.props.doc.id}`}>See All Revisions</Link>
          </p>
        </div>
      </div>
    );
  }
}

export default DocCard;
