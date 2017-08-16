import React, {Component} from 'react';
import { Link } from 'react-router';

class Footer extends Component {

  render() {
    return (
      <footer className='footer-login'>
        <div className='container'>
          <div className='content has-text-centered'>
            <p>© 2017 GoalHighway Inc.</p>
            <p>
              <Link to='https://github.com/jgthms/bulma' target='_blank'><i className='fa fa-facebook' /></Link>
              <Link to='https://github.com/jgthms/bulma' target='_blank'><i className='fa fa-twitter' /></Link>
            </p>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
