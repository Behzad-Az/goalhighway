import React, {Component} from 'react';
import DocCard from './DocCard.jsx';
import CSSTransitionGroup from 'react-addons-css-transition-group';

class DocsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showContainer: true
    };
  }

  render() {
    return (
      <div className='docs-container'>
        <h1 className='header'>
          { this.props.header }:
          <i
            className={this.state.showContainer ? 'fa fa-angle-down' : 'fa fa-angle-up'}
            aria-hidden='true'
            onClick={() => this.setState({ showContainer: !this.state.showContainer })}
          />
        </h1>
        <div className={this.state.showContainer ? 'docs-row' : 'docs-row is-hidden'}>
          { this.props.docs.map(doc => <DocCard key={doc.id} doc={doc} /> ) }
          { !this.props.docs[0] && <p>No related document uploaded yet...</p> }
        </div>
      </div>
    );
  }
}

export default DocsContainer;
