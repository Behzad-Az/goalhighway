import React, {Component} from 'react';
import { Link } from 'react-router';
import ReactAlert from '../partials/ReactAlert.jsx';

class ItemCard extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.state = {
      editCard: false,
      title: this.props.item.title,
      itemDesc: this.props.item.item_desc,
      photoPath: '',
      price: this.props.item.price,
      deleted: false
    };
    this._handleChange = this._handleChange.bind(this);
    this._handleEdit = this._handleEdit.bind(this);
    this._handleDelete = this._handleDelete.bind(this);
    this._toggleView = this._toggleView.bind(this);
    this._editCardView = this._editCardView.bind(this);
    this._showCardView = this._showCardView.bind(this);
  }

  _handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  _handleEdit() {
    let data = {
      photoPath: this.state.photoPath,
      itemDesc: this.state.itemDesc,
      title: this.state.title,
      price: this.state.price,
      deleted: this.state.deleted
    };

    fetch(`/api/courses/${this.props.item.course_id}/items/${this.props.item.id}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) {
        let msg = this.state.deleted ? 'Item deleted' : 'Item updated';
        this.reactAlert.showAlert(msg, 'info');
        this.props.reload();
      } else {
        throw 'Server returned false';
      }
    })
    .catch(() => this.reactAlert.showAlert('Unable to update item', 'error'))
    .then(this._toggleView);
  }

  _handleDelete() {
    this.state.deleted = true;
    this._handleEdit();
  }

  _toggleView() {
    this.setState({ editCard: !this.state.editCard });
  }

  _editCardView() {
    return (
      <div className='item-index card'>
        <div className='card-content'>
          <label className='label'>Item Title:</label>
          <p className='control'>
            <input className='input' type='text' name='title' placeholder='Enter item title here' defaultValue={this.state.title} onChange={this._handleChange} />
          </p>
          <label className='label'>Item Description:</label>
          <p className='control'>
            <textarea className='textarea' name='itemDesc' placeholder='Enter description of item here' defaultValue={this.state.itemDesc} onChange={this._handleChange} />
          </p>
          <label className='label'>Upload Photo (Recommended):</label>
          <p className='control'>
            <input className='upload' type='file' name='photoPath' onChange={this._handleChange} />
          </p>
          <label className='label'>Item Price:</label>
          <p className='control has-icon has-icon-left'>
            <input className='input' type='text' name='price' placeholder='Enter price here' defaultValue={this.props.item.price} onChange={this._handleChange} />
            <span className='icon is-small'><i className='fa fa-dollar' aria-hidden='true'/></span>
          </p>
        </div>
        <footer className='card-footer'>
          <Link className='card-footer-item' onClick={this._handleEdit}>Save</Link>
          <Link className='card-footer-item' onClick={this._toggleView}>Cancel</Link>
          <Link className='card-footer-item' onClick={this._handleDelete}>Delete</Link>
        </footer>
      </div>
    );
  }

  _showCardView() {
    return (
      <div className='item-index card'>
        <div className='card-content'>
          <div className='card-image'>
            { this.props.item.editable && <button className='button is-info' onClick={this._toggleView}>Edit</button> }
            <figure className='image is-96x96'>
              <img src='../../images/camera-logo.png' alt='picture' />
            </figure>
          </div>
          <div className='card-text'>
            <p className='name title is-6'>{this.props.item.title}</p>
            <p className='description title is-6'>'{this.props.item.item_desc}'</p>
            <p className='price title is-6'>$ {this.props.item.price}</p>
            <p className='date title is-6'>Upload Date: {this.props.item.created_at.slice(0, 10)}</p>
          </div>
          <p className='card-foot title is-6'>
            <span className='text-link'>
              <Link>Contact Owner</Link>
            </span>
          </p>
        </div>
      </div>
    );
  }

  render() {
    return this.state.editCard ? this._editCardView() : this._showCardView();
  }
}

export default ItemCard;
