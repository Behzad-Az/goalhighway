import React, {Component} from 'react';
import RevisionRow from './RevisionRow.jsx';

class RevisionsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      courseId: this.props.courseId,
      docId: this.props.docId,
      revs: [],
      noMoreFeeds: false,
      parentState: this.props.parentState
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._renderLoadMoreBtn = this._renderLoadMoreBtn.bind(this);
    this._renderCompAfterData = this._renderCompAfterData.bind(this);
  }

  componentDidMount() {
    this._loadComponentData(false);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.courseId !== this.state.courseId || nextProps.docId  !== this.state.docId) {
      this.setState({ courseId: nextProps.courseId, docId: nextProps.docId });
      this._loadComponentData(true, nextProps.courseId, nextProps.docId);
    } else if (nextProps.parentState !== this.state.parentState) {
      this.setState({ parentState: nextProps.parentState });
      this._loadComponentData(true);
    }
  }

  _loadComponentData(freshReload, courseId, docId) {
    fetch(`/api/courses/${courseId || this.state.courseId}/docs/${docId || this.state.docId}/revisions?revsOffset=${freshReload ? 0 : this.state.revs.length}`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON, freshReload))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  _conditionData(resJSON, freshReload) {
    if (resJSON) {
      this.setState({
        revs: freshReload ? resJSON.revs : this.state.revs.concat(resJSON.revs),
        dataLoaded: true,
        noMoreFeeds: !resJSON.revs.length
      });
    } else {
      throw 'Server returned false';
    }
  }

  _renderLoadMoreBtn() {
    if (this.state.revs.length) {
      const btnContent = this.state.noMoreFeeds && this.state.revs.length ? 'All revisions loaded' : 'Load more';
      return (
        <p className='end-msg'>
          <button className='button' disabled={this.state.noMoreFeeds} onClick={() => this._loadComponentData(false)}>{btnContent}</button>
        </p>
      );
    } else {
      return <p>Error in loading the document revisions.</p>;
    }
  }

  _renderCompAfterData() {
    if (this.state.dataLoaded && this.state.pageError) {
      return (
        <p className='page-msg'>
          <i className='fa fa-exclamation-triangle' aria-hidden='true' />
          Error in loading up the page
        </p>
      );
    } else if (this.state.dataLoaded) {
      return (
        <div className='revisions-container'>
          <h1 className='header'>
            Document Revisions:
            <i className='fa fa-angle-down' aria-hidden='true' />
          </h1>
          { this.state.revs.map(rev =>
              <RevisionRow
                key={rev.id}
                rev={rev}
                courseId={this.state.courseId}
                docId={this.state.docId}
                reload={() => this._loadComponentData(true)} />
            )}
          { this._renderLoadMoreBtn() }
        </div>
      );
    } else {
      return (
        <p className='page-msg'>
          <i className='fa fa-spinner fa-spin fa-3x fa-fw'></i>
          <span className='sr-only'>Loading...</span>
        </p>
      );
    }
  }

  render() {
    return this._renderCompAfterData();
  }
}

export default RevisionsContainer;
