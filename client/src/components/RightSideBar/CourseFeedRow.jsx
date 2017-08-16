import React, {Component} from 'react';
import { Link } from 'react-router';

class CourseFeedRow extends Component {
  constructor(props) {
    super(props);
    this._prepareFeed = this._prepareFeed.bind(this);
    this._renderDocumentFeed = this._renderDocumentFeed.bind(this);
    this._renderCommentFeed = this._renderCommentFeed.bind(this);
    this._renderTutorFeed = this._renderTutorFeed.bind(this);
    this._renderItemFeed = this._renderItemFeed.bind(this);
    this._renderCourseReviewFeed = this._renderCourseReviewFeed.bind(this);
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
        return this._renderItemFeed(` - New Item for Sale or Trade - ${this.props.feed.header}`);
      case 'new_course_review':
        return this._renderCourseReviewFeed(' - New Course Review!');
      default:
        return <p></p>;
    }
  }

  _renderDocumentFeed(header) {
    return (
      <article className='media course-feed-row'>
        <div className='media-content'>
          <div className='content'>
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
              {this.props.feed.created_at.slice(0, 10)}
            </small>
          </div>
        </div>
      </article>
    );
  }

  _renderCommentFeed(header) {
    return (
      <article className='media course-feed-row'>
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
              {this.props.feed.created_at.slice(0, 10)}
            </small>
          </div>
        </div>
      </article>
    );
  }

  _renderTutorFeed(header) {
    return (
      <article className='media course-feed-row'>
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
                {this.props.feed.created_at.slice(0, 10)} | <Link onClick={() => this.props.composeNewConv({
                  toId: this.props.feed.commenter_id,
                  objId: this.props.feed.tutor_log_id,
                  type: 'tutorReq',
                  subject: 'RE: 1 on 1 Tutor Request' })}>Answer {this.props.feed.commenter_name}</Link>
              </small>
            </p>
          </div>
        </div>
      </article>
    );
  }

  _renderItemFeed(header) {
    return (
      <article className='media course-feed-row'>
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
                {this.props.feed.created_at.slice(0, 10)} | <Link onClick={() => this.props.composeNewConv({
                  toId: this.props.feed.commenter_id,
                  objId: this.props.feed.item_for_sale_id,
                  type: 'itemForSale',
                  subject: 'RE: Interested in your item for sale / trade' })}>Contact Owner</Link>
              </small>
            </p>
          </div>
        </div>
      </article>
    );
  }

  _renderCourseReviewFeed(header) {
    return (
      <article className='media course-feed-row'>
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
                {this.props.feed.created_at.slice(0, 10)} | <Link to={`/courses/${this.props.feed.course_id}/reviews`}>See Details</Link>
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
