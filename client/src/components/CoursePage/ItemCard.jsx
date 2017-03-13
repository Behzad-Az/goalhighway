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
    this.handleChange = this.handleChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.toggleView = this.toggleView.bind(this);
    this.editCard = this.editCard.bind(this);
    this.viewCard = this.viewCard.bind(this);
  }

  handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  handleEdit() {
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
    .then(this.toggleView);
  }

  handleDelete() {
    this.state.deleted = true;
    this.handleEdit();
  }

  toggleView() {
    this.setState({ editCard: !this.state.editCard });
  }

  editCard() {
    return (
      <div className='edit-item-index card'>
        <div className='card-content'>
          <label className='label'>Item Title:</label>
          <p className='control'>
            <input className='input' type='text' name='title' placeholder='Enter item title here' defaultValue={this.state.title} onChange={this.handleChange} />
          </p>
          <label className='label'>Item Description:</label>
          <p className='control'>
            <textarea className='textarea' name='itemDesc' placeholder='Enter description of item here' defaultValue={this.state.itemDesc} onChange={this.handleChange} />
          </p>
          <label className='label'>Upload photo (optional but recommended):</label>
          <p className='control'>
            <input className='upload' type='file' name='photoPath' onChange={this.handleChange} />
          </p>
          <label className='label'>Item Price:</label>
          <p className='control has-icon has-icon-left'>
            <input className='input' type='text' name='price' placeholder='Enter price here' defaultValue={this.props.item.price} onChange={this.handleChange} />
            <span className='icon is-small'><i className='fa fa-dollar' aria-hidden='true'/></span>
          </p>
        </div>
          <button className='button is-info' onClick={this.handleEdit}>Save</button>
          <button className='button is-link' onClick={this.toggleView}>Cancel</button>
          <button className='button is-danger' onClick={this.handleDelete}>Delete</button>
      </div>
    );
  }

  viewCard() {
    return (
      <div className='item-index card'>
        <div className='card-content'>
          <div className='card-image'>
            { this.props.item.editable && <button className='button is-info' onClick={this.toggleView}>Edit</button> }
            <figure className='image is-96x96'>
              <img src='../../images/camera-logo.png' alt='picture' />
            </figure>
          </div>
          <div className='card-text'>
            <p className='name title is-6'>{this.props.item.title}</p>
            <p className='description title is-6'>'{this.props.item.item_desc}'</p>
            <p className='price title is-6'>$ {this.props.item.price}</p>
            <p className='date title is-6'>Upload Date: {this.props.item.item_created_at.slice(0, 10)}</p>
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
    return this.state.editCard ? this.editCard() : this.viewCard();
  }
}

export default ItemCard;
