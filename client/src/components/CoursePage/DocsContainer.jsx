import React, {Component} from 'react';
import DocCard from './DocCard.jsx';

class DocsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      courseId: this.props.courseId,
      showContainer: true,
      docs: [],
      noMoreFeeds: false,
      parentState: this.props.parentState
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._determineHeader = this._determineHeader.bind(this);
    this._displayLoadMoreBtn = this._displayLoadMoreBtn.bind(this);
    this._renderCompAfterData = this._renderCompAfterData.bind(this);
  }

  componentDidMount() {
    this._loadComponentData(true);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.courseId !== this.state.courseId) {
      this.setState({ courseId: nextProps.courseId });
      this._loadComponentData(true, nextProps.courseId);
    } else if (nextProps.parentState !== this.state.parentState) {
      this.setState({ parentState: nextProps.parentState });
      this._loadComponentData(true);
    }
  }

  _loadComponentData(freshReload, courseId) {
    courseId = courseId || this.state.courseId;
    fetch(`/api/courses/${courseId}/docs/types/${this.props.type}?docoffset=${freshReload ? 0 : this.state.docs.length}`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON, freshReload))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  _conditionData(resJSON, freshReload) {
    if (resJSON) {
      let newState = {
        docs: freshReload ? resJSON.docs : this.state.docs.concat(resJSON.docs),
        dataLoaded: true,
        noMoreFeeds: !resJSON.docs.length
      };
      this.setState(newState);
    } else {
      throw 'Server returned false';
    }
  }

  _determineHeader() {
    switch (this.props.type) {
      case 'asg_report':
        return 'Assignments & Reports:';
      case 'lecture_note':
        return 'Lecture Notes:';
      case 'sample_question':
        return 'Sample Questions:';
      default:
        return 'Error!';
    }
  }

  _displayLoadMoreBtn() {
    let btnContent = this.state.noMoreFeeds && this.state.docs.length ? 'All documents loaded' : 'Load more';
    if (this.state.docs.length) {
      return (
        <p className='end-msg'>
          <button className='button is-link' disabled={this.state.noMoreFeeds} onClick={() => this._loadComponentData(false)}>{btnContent}</button>
        </p>
      );
    } else {
      return <p>No document available in this category.</p>;
    }
  }

  _renderCompAfterData() {
    if (this.state.dataLoaded && this.state.pageError) {
      return (
        <p className='page-msg'>
          <i className='fa fa-exclamation-triangle' aria-hidden='true' />
          Error while loading documents
        </p>
      );
    } else if (this.state.dataLoaded) {
      return (
        <div className={this.state.showContainer ? 'docs-row' : 'docs-row is-hidden'}>
          { this.state.docs.map(doc => <DocCard key={doc.id} doc={doc} /> ) }
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
    return (
      <div className='docs-container'>
        <h1 className='header'>
          { this._determineHeader() }
          <i
            className={this.state.showContainer ? 'fa fa-angle-down' : 'fa fa-angle-up'}
            aria-hidden='true'
            onClick={() => this.setState({ showContainer: !this.state.showContainer })}
          />
        </h1>
        { this._renderCompAfterData() }
        { this.state.showContainer && this.state.dataLoaded && !this.state.pageError && this._displayLoadMoreBtn() }
      </div>
    );
  }
}

export default DocsContainer;
