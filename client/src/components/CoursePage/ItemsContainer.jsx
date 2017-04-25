import React, {Component} from 'react';
import ItemCard from './ItemCard.jsx';

class ItemsContainer extends Component {
  render() {
    return (
      <div className='items-container'>
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
              composeNewEmail={this.props.composeNewEmail}
            /> ) }
          { !this.props.items[0] && <p>No items for sale or trade yet...</p> }
        </div>
      </div>
    );
  }
}

export default ItemsContainer;
