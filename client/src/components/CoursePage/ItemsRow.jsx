import React, {Component} from 'react';
import ItemCard from './ItemCard.jsx';

class ItemsRow extends Component {
  constructor(props) {
    super(props);
    this.populateRow = this.populateRow.bind(this);
  }

  populateRow() {
    return this.props.items[0] ?
      this.props.items.map(item => <ItemCard key={item.id} item={item} reload={this.props.reload} /> ) :
      <p>No items for sale or trade at the moment...</p>
  }

  render() {
    return (
      <div className="row-container">
        <h1 className="header">
          Items for Sale or Trade:
          <i className="fa fa-angle-down" aria-hidden="true" />
        </h1>
        <div className="items-row">
          { this.populateRow() }
        </div>
      </div>
    );
  }
}

export default ItemsRow;
