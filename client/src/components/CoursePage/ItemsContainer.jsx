import React, {Component} from 'react';
import ItemCard from './ItemCard.jsx';

class ItemsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showContainer: true
    };
  }

  render() {
    return (
      <div className='items-container'>
        <h1 className='header'>
          Items for Sale or Trade:
          <i
            className={this.state.showContainer ? 'fa fa-angle-down' : 'fa fa-angle-up'}
            aria-hidden='true'
            onClick={() => this.setState({ showContainer: !this.state.showContainer })}
          />
        </h1>
        <div className={this.state.showContainer ? 'items-row' : 'items-row is-hidden'}>
          { this.props.items.map(item =>
            <ItemCard
              key={item.id}
              item={item}
              reload={this.props.reload}
              composeNewConv={this.props.composeNewConv}
            /> ) }
          { !this.props.items[0] && <p>No items for sale or trade yet...</p> }
        </div>
      </div>
    );
  }
}

export default ItemsContainer;
