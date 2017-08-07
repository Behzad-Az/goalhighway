import React, {Component} from 'react';
import NewQuestionForm from './NewQuestionForm.jsx';
import NewCompanyReviewForm from './NewCompanyReviewForm.jsx';

class TopRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      showNewQuestionForm: false,
      showNewCompanyReviewForm: false,
      companyInfo: {
        id: this.props.companyId
      }
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._toggleFormModal = this._toggleFormModal.bind(this);
    this._createBtnDiv = this._createBtnDiv.bind(this);
    this._renderCompAfterData = this._renderCompAfterData.bind(this);
  }

  componentDidMount() {
    document.title = 'Company Panel';
    this._loadComponentData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.companyId !== this.state.companyInfo.id) {
      this._loadComponentData(nextProps.companyId);
    }
  }

  _loadComponentData(companyId) {
    fetch(`/api/companies/${companyId || this.state.companyInfo.id}/toprow`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  _conditionData(resJSON) {
    if (resJSON) {
      document.title = `${resJSON.companyInfo.name} Panel`;
      this.setState({ companyInfo: resJSON.companyInfo, dataLoaded: true });
    } else {
      document.title = 'Company Panel - Error';
      throw 'Server returned false';
    }
  }

  _toggleFormModal(stateName) {
    let newState = {};
    newState[stateName] = !this.state[stateName];
    this.setState(newState);
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

  _renderCompAfterData() {
    if (this.state.dataLoaded && this.state.pageError) {
      return (
        <p className='page-msg'>
          <i className='fa fa-exclamation-triangle' aria-hidden='true' />
          Error in loading up control bar
        </p>
      );
    } else if (this.state.dataLoaded) {
      return (
        <div className='top-row'>
          <NewQuestionForm
            companyInfo={this.state.companyInfo}
            reload={() => this.props.updateCompState('qasState')}
            showModal={this.state.showNewQuestionForm}
            toggleModal={() => this._toggleFormModal('showNewQuestionForm')} />
          <NewCompanyReviewForm
            companyId={this.state.companyInfo.id}
            reload={() => this.props.updateCompState('companyReviewsState')}
            showModal={this.state.showNewCompanyReviewForm}
            toggleModal={() => this._toggleFormModal('showNewCompanyReviewForm')} />
          <h1 className='header'>
            { this.state.companyInfo.name }
          </h1>

          { this._createBtnDiv('fa fa-question', <p>New Interview<br/>Question</p>,
                                () => this._toggleFormModal('showNewQuestionForm'), 'inherit',
                                true, true) }

          <div className='top-row-star' onClick={() => this._toggleFormModal('showNewCompanyReviewForm')}>
            <div className='outer'>
              <i className='fa fa-star-o' aria-hidden='true' />
              <div className='inner' style={{ width: `${this.state.companyInfo.avgRating}%` }}>
                <i className='fa fa-star' aria-hidden='true' />
              </div>
            </div>
            <p>New<br/>Review</p>
          </div>

        </div>
      );
    } else {
      return (
        <p className='page-msg'>
          <i className='fa fa-spinner fa-spin fa-3x fa-fw'></i>
          <span className='sr-only'>Loading...</span>
        </p>
      );
    }
  }

  render() {
    return this._renderCompAfterData();
  }
}

export default TopRow;
