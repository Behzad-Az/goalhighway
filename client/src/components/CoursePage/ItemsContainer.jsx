import React, {Component} from 'react';
import ItemCard from './ItemCard.jsx';
import NewEmailForm from '../EmailPage/NewEmailForm.jsx';

class ItemsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toId: '',
      objId: '',
      type: '',
      showEmailModal: false
    };
    this._updateEmailState = this._updateEmailState.bind(this);
    this._toggleEmailModal = this._toggleEmailModal.bind(this);
  }

  _updateEmailState(newState) {
    newState.showEmailModal = true;
    this.setState(newState);
  }

  _toggleEmailModal() {
    this.setState({ showEmailModal: !this.state.showEmailModal });
  }

  render() {
    return (
      <div className='items-container'>
        <NewEmailForm query={this.state} toggleEmailModal={this._toggleEmailModal} />
        <h1 className='header'>
          Items for Sale or Trade:
          <i className='fa fa-angle-down' aria-hidden='true' />
        </h1>
        <div className='items-row'>
          { this.props.items.map(item => <ItemCard key={item.id} item={item} reload={this.props.reload} updateEmailState={this._updateEmailState} /> ) }
          { !this.props.items[0] && <p>No items for sale or trade yet...</p> }
        </div>
      </div>
    );
  }
}

export default ItemsContainer;
