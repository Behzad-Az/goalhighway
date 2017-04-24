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
      showNewEmailForm: false
    };
    this._composeNewEmail = this._composeNewEmail.bind(this);
    this._toggleEmailModal = this._toggleEmailModal.bind(this);
  }

  _composeNewEmail(newState) {
    newState.showNewEmailForm = true;
    this.setState(newState);
  }

  _toggleEmailModal() {
    this.setState({ showNewEmailForm: !this.state.showNewEmailForm });
  }

  render() {
    return (
      <div className='items-container'>
        <NewEmailForm
          query={this.state}
          showModal={this.state.showNewEmailForm}
          toggleModal={this._toggleEmailModal}
        />
        <h1 className='header'>
          Items for Sale or Trade:
          <i className='fa fa-angle-down' aria-hidden='true' />
        </h1>
        <div className='items-row'>
          { this.props.items.map(item =>
            <ItemCard
              key={item.id}
              item={item}
              reload={this.props.reload}
              composeNewEmail={this._composeNewEmail}
            /> ) }
          { !this.props.items[0] && <p>No items for sale or trade yet...</p> }
        </div>
      </div>
    );
  }
}

export default ItemsContainer;
