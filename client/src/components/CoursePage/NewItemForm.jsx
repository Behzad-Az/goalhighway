import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';
import HandleModal from '../partials/HandleModal.js';
import ImageCropper from '../partials/ImageCropper.jsx';

class NewItemForm extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.formData = new FormData();
    this.state = {
      title: '',
      itemDesc: '',
      photoPath: '',
      price: ''
    };
    this._handleChange = this._handleChange.bind(this);
    this._validateForm = this._validateForm.bind(this);
    this._deleteFormData = this._deleteFormData.bind(this);
    this._handleNewItemPost = this._handleNewItemPost.bind(this);
  }

  _handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  _validateForm() {
    return this.state.title &&
           this.state.itemDesc &&
           this.state.price;
  }

  _deleteFormData() {
    this.formData.delete('file');
    this.formData.delete('title');
    this.formData.delete('itemDesc');
    this.formData.delete('price');
  }

  _handleNewItemPost() {
    this.formData.append('title', this.state.title);
    this.formData.append('itemDesc', this.state.itemDesc);
    this.formData.append('price', this.state.price);

    fetch(`/api/courses/${this.props.courseId}/items`, {
      method: 'POST',
      credentials: 'same-origin',
      body: this.formData
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) {
        this.reactAlert.showAlert('New item posted', 'info');
        this._deleteFormData();
        this.props.reload();
      }
      else { throw 'Server returned false'; }
    })
    .catch(() => {
      this.reactAlert.showAlert('error in posting item', 'error');
      this._deleteFormData();
    })
    .then(() => HandleModal('new-item-form'));
  }

  render() {
    return (
      <div id='new-item-form' className='modal'>
        <div className='modal-background' onClick={() => HandleModal('new-item-form')}></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>New Item For Sale or Trade</p>
            <button className='delete' onClick={() => HandleModal('new-item-form')}></button>
          </header>
          <section className='modal-card-body'>
            <label className='label'>Item Title:</label>
            <p className='control'>
              <input className='input' type='text' name='title' placeholder='Enter item title here' onChange={this._handleChange} />
            </p>
            <label className='label'>Item Description:</label>
            <p className='control'>
              <textarea className='textarea' name='itemDesc' placeholder='Enter description of item here' onChange={this._handleChange} />
            </p>
            <div className='control'>
              <label className='label'>Upload Photo (Recommended):</label>
              <ImageCropper formData={this.formData} />
            </div>
            <label className='label'>Item Price:</label>
            <p className='control has-icon has-icon-left'>
              <input className='input' type='text' name='price' placeholder='Enter price here' onChange={this._handleChange} />
              <span className='icon'><i className='fa fa-dollar' /></span>
            </p>
          </section>
          <footer className='modal-card-foot'>
            <button className='button is-primary' disabled={!this._validateForm()} onClick={this._handleNewItemPost}>Submit</button>
            <button className='button' onClick={() => HandleModal('new-item-form')}>Cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default NewItemForm;
