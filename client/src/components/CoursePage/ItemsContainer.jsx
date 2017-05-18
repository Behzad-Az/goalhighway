import React, {Component} from 'react';
import ItemCard from './ItemCard.jsx';

class ItemsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      courseId: this.props.courseId,
      showContainer: true,
      items: [],
      noMoreFeeds: false,
      parentState: this.props.parentState
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
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
    fetch(`/api/courses/${courseId}/items?itemoffset=${freshReload ? 0 : this.state.items.length}`, {
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
        items: freshReload ? resJSON.items : this.state.items.concat(resJSON.items),
        dataLoaded: true,
        noMoreFeeds: !resJSON.items.length
      };
      this.setState(newState);
    } else {
      throw 'Server returned false';
    }
  }

  _displayLoadMoreBtn() {
    let btnContent = this.state.noMoreFeeds && this.state.items.length ? 'All items loaded' : 'Load more';
    if (this.state.items.length) {
      return (
        <p className='end-msg'>
          <button className='button is-link' disabled={this.state.noMoreFeeds} onClick={() => this._loadComponentData(false)}>{btnContent}</button>
        </p>
      );
    } else {
      return <p>No item for sale or trade yet.</p>;
    }
  }

  _renderCompAfterData() {
    if (this.state.dataLoaded && this.state.pageError) {
      return (
        <p className='page-msg'>
          <i className='fa fa-exclamation-triangle' aria-hidden='true' />
          Error while loading items
        </p>
      );
    } else if (this.state.dataLoaded) {
      return (
        <div className={this.state.showContainer ? 'items-row' : 'items-row is-hidden'}>
          { this.state.items.map(item => <ItemCard key={item.id} item={item} reload={() => this._loadComponentData(true)} composeNewConv={this.props.composeNewConv} /> ) }
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
      <div id='items' className='items-container'>
        <h1 className='header'>
          Items for Sale or Trade:
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

export default ItemsContainer;
