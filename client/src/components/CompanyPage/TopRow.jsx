import React, {Component} from 'react';
import HandleModal from '../partials/HandleModal.js';

class TopRow extends Component {
  constructor(props) {
    super(props);
    this.createBtnDiv = this.createBtnDiv.bind(this);
  }

  createBtnDiv(dfltClassName, truePhrase, trueCb, trueColor, validation, enable, falsePhrase, falseCb) {
    let className = enable ? dfltClassName : dfltClassName + ' disabled';
    if (validation) {
      return (
        <div className='top-row-button'>
          <i onClick={trueCb} className={className} aria-hidden='true' style={{ color: trueColor }} />
          {truePhrase}
        </div>
      );
    } else {
      return (
        <div className='top-row-button'>
          <i onClick={falseCb} className={className} aria-hidden='true' />
          {falsePhrase}
        </div>
      );
    }
  }

  render() {
    return (
      <div className='top-row'>
        <h1 className='header'>
          {this.props.companyInfo.name}
        </h1>
        <div className='row-container'>
          { this.createBtnDiv('fa fa-upload', <p>New Interview<br/>Question</p>, () => HandleModal('new-question-form'), 'inherit', true, true) }
        </div>
      </div>
    );
  }
}

export default TopRow;
