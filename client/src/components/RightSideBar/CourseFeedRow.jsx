import React, {Component} from 'react';
import { Link } from 'react-router';

class CourseFeedRow extends Component {
  constructor(props) {
    super(props);
    this._prepareFeed = this._prepareFeed.bind(this);
    this._renderDocumentFeed = this._renderDocumentFeed.bind(this);
    this._renderCommentFeed = this._renderCommentFeed.bind(this);
    this._renderTutorFeed = this._renderTutorFeed.bind(this);
  }

  _prepareFeed() {
    switch(this.props.feed.category) {
      case 'new_asg_report':
        return this._renderDocumentFeed('New Assingment / Report - ');
      case 'new_lecture_note':
        return this._renderDocumentFeed('New Lecture Note - ');
      case 'new_sample_question':
        return this._renderDocumentFeed('New Sample Question - ');
      case 'new_document':
        return this._renderDocumentFeed('New Document - ');
      case 'revised_asg_report':
        return this._renderDocumentFeed('Revised Assingment / Report - ');
      case 'revised_lecture_note':
        return this._renderDocumentFeed('Revised Lecture Note - ');
      case 'revised_sample_question':
        return this._renderDocumentFeed('Revised Sample Question - ');
      case 'revised_document':
        return this._renderDocumentFeed('Revised Document - ');
      case 'tutor_request':
        return this._renderTutorFeed(` - Tutor Request by ${this.props.feed.commenter_name}`);
      case 'new_comment':
        return this._renderCommentFeed(` - New Comment by ${this.props.feed.commenter_name}`);
      default:
        return <p></p>;
    }
  }

  _renderDocumentFeed(headerPrefix) {
    return (
      <article className='media course-row'>
        <div className='media-content'>
          <div className='content'>
            <strong>
              <Link to={`/courses/${this.props.feed.course_id}`}>@{this.props.feed.short_display_name}</Link>
            </strong>
            <br />
            <strong>
              <Link to={`/courses/${this.props.feed.course_id}/docs/${this.props.feed.doc_id}`}>{headerPrefix}'{this.props.feed.header}'</Link>
            </strong>
            <br />
            {this.props.feed.content}
            <br />
            <small>
              By {this.props.feed.commenter_name} on {this.props.feed.created_at.slice(0, 10)}
            </small>
          </div>
        </div>
      </article>
    );
  }

  _renderCommentFeed(header) {
    return (
      <article className='media course-row'>
        <div className='media-content'>
          <div className='content'>
            <strong>
              <Link to={`/courses/${this.props.feed.course_id}`}>@{this.props.feed.short_display_name}</Link>
              {header}
            </strong>
            <br />
            {this.props.feed.content}
            <br />
            <small>
              Posted on {this.props.feed.created_at.slice(0, 10)}
            </small>
          </div>
        </div>
      </article>
    );
  }

  _renderTutorFeed(header) {
    return (
      <article className='media course-row'>
        <div className='media-content'>
          <div className='content'>
            <p>
              <strong>
                <Link to={`/courses/${this.props.feed.course_id}`}>@{this.props.feed.short_display_name}</Link>
                {header}
              </strong>
              <br />
              {this.props.feed.content}
              <br />
              <small>
                Posted on {this.props.feed.created_at.slice(0, 10)} |
                <Link> Answer</Link>
              </small>
            </p>
          </div>
        </div>
      </article>
    );
  }

  render() {
    return this._prepareFeed();
  }
}

export default CourseFeedRow;
