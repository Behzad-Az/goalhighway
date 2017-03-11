import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';
import HandleModal from '../partials/HandleModal.js';

class NewItemForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      itemDesc: '',
      photoPath: '',
      price: ''
    };
    this.reactAlert = new ReactAlert();
    this.handleChange = this.handleChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleNewItemPost = this.handleNewItemPost.bind(this);
  }

  handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  validateForm() {
    return this.state.title &&
           this.state.itemDesc &&
           this.state.price
  }

  handleNewItemPost() {
    const successFcn = () => {
      this.reactAlert.showAlert('New item posted', 'info');
      this.props.reload();
    };
    let data = {
      title: this.state.title,
      itemDesc: this.state.itemDesc,
      price: this.state.price,
      photoPath: this.state.photoPath
    };
    $.ajax({
      method: 'POST',
      url: `/api/courses/${this.props.courseId}/items`,
      data: data,
      success: response => {
        response ? successFcn() : this.reactAlert.showAlert('error in posting item', 'error');
      }
    }).always(() => HandleModal('new-item-form'));
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
              <input className='input' type='text' name='title' placeholder='Enter item title here' onChange={this.handleChange} />
            </p>
            <label className='label'>Item Description:</label>
            <p className='control'>
              <textarea className='textarea' name='itemDesc' placeholder='Enter description of item here' onChange={this.handleChange} />
            </p>
            <label className='label'>Upload photo (optional but recommended):</label>
            <p className='control'>
              <input className='upload' type='file' name='photoPath' onChange={this.handleChange} />
            </p>
            <label className='label'>Item Price:</label>
            <p className='control has-icon has-icon-left'>
              <input className='input' type='text' name='price' placeholder='Enter price here' onChange={this.handleChange} />
              <span className='icon'><i className='fa fa-dollar' /></span>
            </p>
          </section>
          <footer className='modal-card-foot'>
            <button className='button is-primary' disabled={!this.validateForm()} onClick={this.handleNewItemPost}>Submit</button>
            <button className='button' onClick={() => HandleModal('new-item-form')}>Cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default NewItemForm;
