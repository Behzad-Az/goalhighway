import React, {Component} from 'react';
import { Link } from 'react-router';
import ReactAlert from '../partials/ReactAlert.jsx';
import ImageCropper from '../partials/ImageCropper.jsx';
import InvalidCharChecker from '../partials/InvalidCharChecker.jsx';

class ItemCard extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.formData = new FormData();
    this.formLimits = {
      title: { min: 3, max: 60 },
      itemDesc: { min: 3, max: 250 },
      price: { min: 1, max: 10 }
    };
    this.state = {
      editCard: false,
      title: this.props.item.title,
      itemDesc: this.props.item.item_desc,
      price: this.props.item.price,
      editCardError: ''
    };
    this._handleChange = this._handleChange.bind(this);
    this._validateForm = this._validateForm.bind(this);
    this._handleEdit = this._handleEdit.bind(this);
    this._handleDelete = this._handleDelete.bind(this);
    this._toggleView = this._toggleView.bind(this);
    this._editCardView = this._editCardView.bind(this);
    this._showCardView = this._showCardView.bind(this);
    this._deleteFormData = this._deleteFormData.bind(this);
  }

  _handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  _validateForm() {
    return this.state.title.length >= this.formLimits.title.min &&
           !InvalidCharChecker(this.state.title, this.formLimits.title.max, 'itemTitle') &&
           this.state.itemDesc.length >= this.formLimits.itemDesc.min &&
           !InvalidCharChecker(this.state.itemDesc, this.formLimits.itemDesc.max, 'itemDesc') &&
           this.state.price.length >= this.formLimits.price.min &&
           !InvalidCharChecker(this.state.price, this.formLimits.price.max, 'itemPrice');
  }

  _handleEdit() {
    if (!this._validateForm()) {
      this.setState({ editCardError: 'Please fill all the fields correctly.' });
    } else {
      this.formData.append('title', this.state.title);
      this.formData.append('itemDesc', this.state.itemDesc);
      this.formData.append('price', this.state.price);

      fetch(`/api/courses/${this.props.item.course_id}/items/${this.props.item.id}`, {
        method: 'POST',
        credentials: 'same-origin',
        body: this.formData
      })
      .then(response => response.json())
      .then(resJSON => {
        if (resJSON) {
          this.reactAlert.showAlert('Item updated', 'info');
          this._deleteFormData();
          this.props.reload();
        } else {
          throw 'Server returned false';
        }
      })
      .catch(() => {
        this.reactAlert.showAlert('Unable to update item', 'error');
        this._deleteFormData();
      })
      .then(this._toggleView);
    }
  }

  _handleDelete() {
    fetch(`/api/courses/${this.props.item.course_id}/items/${this.props.item.id}`, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/string',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) {
        this.reactAlert.showAlert('Item deleted', 'info');
        this.props.reload();
      }
      else { throw 'Server returned false'; }
    })
    .catch(() => this.reactAlert.showAlert('Unable to delete item', 'error'));
  }

  _toggleView() {
    this.setState({ editCard: !this.state.editCard });
  }

  _deleteFormData() {
    this.formData.delete('file');
    this.formData.delete('title');
    this.formData.delete('itemDesc');
    this.formData.delete('price');
  }

  _editCardView() {
    return (
      <div className='item-index card' style={{ minWidth: '300px' }}>
        <div className='card-content'>
          <label className='label'>
            Item Title:
            { InvalidCharChecker(this.state.title, this.formLimits.title.max, 'itemTitle') && <span className='char-limit'>Invalid</span> }
          </label>
          <p className='control'>
            <input
              className='input'
              type='text'
              name='title'
              placeholder='Enter item title here'
              defaultValue={this.state.title}
              onChange={this._handleChange}
              style={{ borderColor: InvalidCharChecker(this.state.title, this.formLimits.title.max, 'itemTitle') || !this.state.title ? '#9D0600' : '' }} />
          </p>
          <label className='label'>
            Item Description:
            { InvalidCharChecker(this.state.itemDesc, this.formLimits.itemDesc.max, 'itemDesc') && <span className='char-limit'>Invalid</span> }
          </label>
          <p className='control'>
            <textarea
              className='textarea'
              name='itemDesc'
              placeholder='Enter description of item here'
              defaultValue={this.state.itemDesc}
              onChange={this._handleChange}
              style={{ borderColor: InvalidCharChecker(this.state.itemDesc, this.formLimits.itemDesc.max, 'itemDesc') || !this.state.itemDesc ? '#9D0600' : '' }} />
          </p>

          <div className='control'>
            <label className='label'>Photo:</label>
            <ImageCropper formData={this.formData} />
          </div>

          <label className='label'>
            Item Price:
            { InvalidCharChecker(this.state.price, this.formLimits.price.max, 'itemPrice') && <span className='char-limit'>Invalid</span> }
          </label>
          <p className='control has-icon has-icon-left'>
            <input
              className='input'
              type='text'
               name='price'
               placeholder='Enter price here'
               defaultValue={this.props.item.price}
               onChange={this._handleChange}
               style={{ borderColor: InvalidCharChecker(this.state.price, this.formLimits.price.max, 'itemPrice') || !this.state.price ? '#9D0600' : '' }} />
            <span className='icon is-small'><i className='fa fa-dollar' aria-hidden='true'/></span>
          </p>
          <p className='char-limit'>{this.state.editCardError}</p>
        </div>
        <footer className='card-footer'>
          <Link className='card-footer-item is-link' onClick={this._handleEdit}>Save</Link>
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
            <figure className='image item-img is-128x128'>
              <img src={`http://localhost:19001/images/itemsforsale/${this.props.item.photo_name}`} alt='picture' />
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
              { this.props.item.editable ?
                  <Link onClick={this._toggleView}>Edit</Link> :
                  <Link
                    onClick={() => this.props.composeNewEmail({
                      toId: this.props.item.owner_id,
                      objId: this.props.item.id,
                      type: 'itemForSale',
                      subject: `RE: Item for Sale - ${this.props.item.title}` })}
                    >Contact Owner
                  </Link> }
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
