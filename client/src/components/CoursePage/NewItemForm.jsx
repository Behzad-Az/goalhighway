import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';
import ImageCropper from '../partials/ImageCropper.jsx';

class NewItemForm extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.formData = new FormData();
    this.formLimits = {
      title: 60,
      itemDesc: 250,
      price: 10
    };
    this.state = {
      title: '',
      itemDesc: '',
      price: ''
    };
    this._handleChange = this._handleChange.bind(this);
    this._validateForm = this._validateForm.bind(this);
    this._deleteFormData = this._deleteFormData.bind(this);
    this._handleNewItemPost = this._handleNewItemPost.bind(this);
  }

  _handleChange(e) {
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  _validateForm() {
    return this.state.title &&
           this.state.title.length <= this.formLimits.title &&
           this.state.itemDesc &&
           this.state.itemDesc.length <= this.formLimits.itemDesc &&
           this.state.price &&
           this.state.price.length <= this.formLimits.price;
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
    .then(this.props.toggleModal);
  }

  render() {
    return (
      <div className={this.props.showModal ? 'modal is-active' : 'modal'}>
        <div className='modal-background' onClick={this.props.toggleModal}></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>New Item For Sale or Trade</p>
            <button className='delete' onClick={this.props.toggleModal}></button>
          </header>
          <section className='modal-card-body'>
            <label className='label'>
              Item Title:
              { this.state.title.length > this.formLimits.title && <span className='char-limit'>too long!</span> }
            </label>
            <p className='control'>
              <input
                className='input'
                type='text'
                name='title'
                placeholder='Enter item title here'
                onChange={this._handleChange}
                style={{ borderColor: this.state.title.length > this.formLimits.title ? '#9D0600' : '' }} />
            </p>
            <label className='label'>
              Item Description:
              { this.state.itemDesc.length > this.formLimits.itemDesc && <span className='char-limit'>too long!</span> }
            </label>
            <p className='control'>
              <textarea
                className='textarea'
                name='itemDesc'
                placeholder='Enter description of item here'
                onChange={this._handleChange}
                style={{ borderColor: this.state.itemDesc.length > this.formLimits.itemDesc ? '#9D0600' : '' }} />
            </p>
            <div className='control'>
              <label className='label'>Upload Photo (Recommended):</label>
              <ImageCropper formData={this.formData} />
            </div>
            <label className='label'>
              Item Price:
              { this.state.price.length > this.formLimits.price && <span className='char-limit'>too long!</span> }
            </label>
            <p className='control has-icon has-icon-left'>
              <input
                className='input'
                type='text'
                name='price'
                placeholder='Enter price here'
                onChange={this._handleChange}
                style={{ borderColor: this.state.price.length > this.formLimits.price ? '#9D0600' : '' }} />
              <span className='icon'><i className='fa fa-dollar' /></span>
            </p>
          </section>
          <footer className='modal-card-foot'>
            <button className='button is-primary' disabled={!this._validateForm()} onClick={this._handleNewItemPost}>Submit</button>
            <button className='button' onClick={this.props.toggleModal}>Cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default NewItemForm;
