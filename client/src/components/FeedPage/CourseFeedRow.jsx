import React, {Component} from 'react';
import { Link } from 'react-router';

class CourseFeedRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flagRequest: false,
      flagReason: '',
      showReplyBox: false,
      replyContent: ''
    };
    this._handleFlagClick = this._handleFlagClick.bind(this);
    this._handleFlagSubmit = this._handleFlagSubmit.bind(this);
    this._renderFlagSelect = this._renderFlagSelect.bind(this);
    this._prepareFeed = this._prepareFeed.bind(this);
    this._renderDocumentFeed = this._renderDocumentFeed.bind(this);
    this._renderCommentFeed = this._renderCommentFeed.bind(this);
    this._renderTutorFeed = this._renderTutorFeed.bind(this);
    this._renderItemFeed = this._renderItemFeed.bind(this);
    this._renderCourseReviewFeed = this._renderCourseReviewFeed.bind(this);
    this._displayReplyBox = this._displayReplyBox.bind(this);
    this._handleReplyChange = this._handleReplyChange.bind(this);
  }

  _handleFlagClick() {
    let flagRequest = !this.state.flagRequest;
    this.setState({ flagRequest });
  }

  _handleFlagSubmit(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    // fetch(`/api/flags/jobs/${this.props.feed.id}`, {
    //   method: 'POST',
    //   credentials: 'same-origin',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(state)
    // })
    // .then(response => response.json())
    // .then(resJSON => { if (!resJSON) throw 'Server returned false' })
    // .catch(err => console.error('Unable to post flag - ', err))
    // .then(() => this.setState(state));
  }

  _renderFlagSelect() {
    return (
      <small className='control flag-submission'>
        <span className='select is-small'>
          <select name='flagReason' onChange={this._handleFlagSubmit}>
            <option value=''>select reason</option>
            <option value='expired link'>Expired link</option>
            <option value='poor categorization'>Poor categorization</option>
            <option value='other'>Other</option>
          </select>
        </span>
      </small>
    );
  }

  _prepareFeed() {
    switch (this.props.feed.category) {
      case 'new_asg_report':
        return this._renderDocumentFeed(`New Assingment / Report - ${this.props.feed.header}`);
      case 'new_lecture_note':
        return this._renderDocumentFeed(`New Lecture Note - ${this.props.feed.header}`);
      case 'new_sample_question':
        return this._renderDocumentFeed(`New Sample Question - ${this.props.feed.header}`);
      case 'new_document':
        return this._renderDocumentFeed(`New Document - ${this.props.feed.header}`);
      case 'revised_asg_report':
        return this._renderDocumentFeed(`Revised Assignment / Report - ${this.props.feed.header}`);
      case 'revised_lecture_note':
        return this._renderDocumentFeed(`Revised Lecture Note - ${this.props.feed.header}`);
      case 'revised_sample_question':
        return this._renderDocumentFeed(`Revised Sample Question - ${this.props.feed.header}`);
      case 'revised_document':
        return this._renderDocumentFeed(`Revised Document - ${this.props.feed.header}`);
      case 'new_tutor_request':
        return this._renderTutorFeed(` - Tutor Request by ${this.props.feed.commenter_name}`);
      case 'new_comment':
        return this._renderCommentFeed(` - New Comment by ${this.props.feed.commenter_name}`);
      case 'new_item_for_sale':
        return this._renderItemFeed(`- New Item for Sale - ${this.props.feed.header}`);
      case 'new_course_review':
        return this._renderCourseReviewFeed(' - New Course Review!');
      default:
        return <p></p>;
    }
  }

  _renderDocumentFeed(header) {
    return (
      <article className='media course-row'>
        <figure className='media-left'>
          <p className='image is-64x64'>
            <img src={`http://localhost:19001/images/userphotos/${this.props.feed.photo_name}`} />
          </p>
        </figure>
        <div className='media-content'>
          <div className='content'>
            <Link to={`/courses/${this.props.feed.course_id}/docs/${this.props.feed.doc_id}`}>
              <button className='button'>Download Document</button>
            </Link>
            <p>
              <strong>
                <Link to={`/courses/${this.props.feed.course_id}`}>@{this.props.feed.short_display_name}</Link>
              </strong>
              <br />
              <strong>
                <Link to={`/courses/${this.props.feed.course_id}/docs/${this.props.feed.doc_id}`}>{header}</Link>
              </strong>
              <br />
              {this.props.feed.content}
              <br />
              <small>
                <Link to={`/courses/${this.props.feed.course_id}/docs/${this.props.feed.doc_id}`}>Document Histroy</Link>
              </small>
              <br />
              <small>
                {this.props.feed.created_at.slice(0, 10)}
                <i className='fa fa-flag' aria-hidden='true' onClick={this._handleFlagClick} style={{ color: this.state.flagRequest ? '#9D0600' : 'inherit' }} />
                {this.state.flagRequest && this._renderFlagSelect()}
                <i className='fa fa-heart' aria-hidden='true' />
              </small>
            </p>
          </div>
        </div>
      </article>
    );
  }

  _renderCommentFeed(header) {
    return (
      <article className='media course-row'>
        <figure className='media-left'>
          <p className='image is-64x64'>
            <img src={`http://localhost:19001/images/userphotos/${this.props.feed.photo_name}`} />
          </p>
        </figure>
        <div className='media-content'>
          <div className='content'>
            <Link to={`/courses/${this.props.feed.course_id}`}>
              <button className='button'>Course Page</button>
            </Link>
            <p>
              <strong>
                <Link to={`/courses/${this.props.feed.course_id}`}>@{this.props.feed.short_display_name}</Link>
                {header}
              </strong>
              <br />
              {this.props.feed.content}
              <br />
              <small>
                <Link onClick={() => this.setState({ showReplyBox: !this.state.showReplyBox })}>Comment</Link>
              </small>
              <br />
              <small>
                {this.props.feed.created_at.slice(0, 10)}
                <i className={this.props.feed.editable ? 'fa fa-trash' : 'fa fa-flag'}
                  aria-hidden='true'
                  onClick={this._handleFlagClick}
                  style={{ color: this.state.flagRequest ? '#9D0600' : 'inherit' }} />
                {this.state.flagRequest && this._renderFlagSelect()}
                <i className='fa fa-heart' aria-hidden='true' />
              </small>
            </p>
          </div>
          { this._displayReplyBox() }
        </div>
      </article>
    );
  }

  _renderTutorFeed(header) {
    return (
      <article className='media course-row'>
        <figure className='media-left'>
          <p className='image is-64x64'>
            <img src={`http://localhost:19001/images/userphotos/${this.props.feed.photo_name}`} />
          </p>
        </figure>
        <div className='media-content'>
          <div className='content'>
            <Link onClick={() => this.props.composeNewEmail({
              toId: this.props.feed.commenter_id,
              objId: this.props.feed.tutor_log_id,
              type: 'tutorReq',
              subject: 'RE: 1 on 1 Tutor Request' })} >
              <button className='button'>Answer {this.props.feed.commenter_name}</button>
            </Link>
            <p>
              <strong>
                <Link to={`/courses/${this.props.feed.course_id}`}>@{this.props.feed.short_display_name}</Link>
                {header}
              </strong>
              <br />
              {this.props.feed.content}
              <br />
              <small>
                <Link to={`/courses/${this.props.feed.course_id}`}>Go to Course Page</Link>
              </small>
              <br />
              <small>
                {this.props.feed.created_at.slice(0, 10)}
                <i className='fa fa-flag' aria-hidden='true' onClick={this._handleFlagClick} style={{ color: this.state.flagRequest ? '#9D0600' : 'inherit' }} />
                {this.state.flagRequest && this._renderFlagSelect()}
                <i className='fa fa-heart' aria-hidden='true' />
              </small>
            </p>
          </div>
        </div>
      </article>
    );
  }

  _renderItemFeed(header) {
    return (
      <article className='media course-row'>
        <figure className='media-left'>
          <p className='image is-64x64'>
            <img src={`http://localhost:19001/images/userphotos/${this.props.feed.photo_name}`} />
          </p>
        </figure>
        <div className='media-content'>
          <div className='content'>
            <Link onClick={() => this.props.composeNewEmail({
              toId: this.props.feed.commenter_id,
              objId: this.props.feed.item_for_sale_id,
              type: 'itemForSale',
              subject: 'RE: Interested in your item for sale / trade' })}>
              <button className='button'>Contact Owner</button>
            </Link>
            <p>
              <strong>
                <Link to={`/courses/${this.props.feed.course_id}`}>@{this.props.feed.short_display_name}</Link>
                {header}
              </strong>
              <br />
              {this.props.feed.content}
              <br />
              <small>
                <Link to={`/courses/${this.props.feed.course_id}`}>Go to Course Page</Link>
              </small>
              <br />
              <small>
                {this.props.feed.created_at.slice(0, 10)}
                <i className='fa fa-flag' aria-hidden='true' onClick={this._handleFlagClick} style={{ color: this.state.flagRequest ? '#9D0600' : 'inherit' }} />
                {this.state.flagRequest && this._renderFlagSelect()}
                <i className='fa fa-heart' aria-hidden='true' />
              </small>
            </p>
          </div>
        </div>
      </article>
    );
  }

  _renderCourseReviewFeed(header) {
    return (
      <article className='media course-row'>
        <figure className='media-left'>
          <p className='image is-64x64'>
            <img src={`http://localhost:19001/images/userphotos/${this.props.feed.photo_name}`} />
          </p>
        </figure>
        <div className='media-content'>
          <div className='content'>
            <Link to={`/courses/${this.props.feed.course_id}/reviews`}>
              <button className='button'>See Details</button>
            </Link>
            <p>
              <strong>
                <Link to={`/courses/${this.props.feed.course_id}`}>@{this.props.feed.short_display_name}</Link>
                {header}
              </strong>
              <br />
              {this.props.feed.content}
              <br />
              <small>
                <Link to={`/courses/${this.props.feed.course_id}`}>Go to Course Page</Link>
              </small>
              <br />
              <small>
                {this.props.feed.created_at.slice(0, 10)}
                <i className='fa fa-flag' aria-hidden='true' onClick={this._handleFlagClick} style={{ color: this.state.flagRequest ? '#9D0600' : 'inherit' }} />
                {this.state.flagRequest && this._renderFlagSelect()}
                <i className='fa fa-heart' aria-hidden='true' />
              </small>
            </p>
          </div>
        </div>
      </article>
    );
  }

  _displayReplyBox() {
    if (this.state.showReplyBox) {
      return (
        <div className='control is-grouped'>
          <p className='control is-expanded'>
            <textarea className='textarea' style={{minHeight: '40px'}} name='replyContent' placeholder='Enter your comment here...' onChange={this._handleReplyChange} />
          </p>
          <p className='control'>
            <a className='button is-info'>
              Send
            </a>
          </p>
        </div>
      );
    }
  }

  _handleReplyChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  render() {
    return this._prepareFeed();
  }
}

export default CourseFeedRow;
