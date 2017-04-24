import React, {Component} from 'react';

class TopRow extends Component {
  constructor(props) {
    super(props);
    this._createBtnDiv = this._createBtnDiv.bind(this);
  }

  _createBtnDiv(dfltClassName, truePhrase, trueCb, trueColor, validation, enable, falsePhrase, falseCb) {
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
        { this._createBtnDiv('fa fa-upload', <p>New Interview<br/>Question</p>, this.props.toggleNewQuestionForm, 'inherit', true, true) }
      </div>
    );
  }
}

export default TopRow;
