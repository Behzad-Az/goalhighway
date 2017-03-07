import React, {Component} from 'react';
import { Link } from 'react-router';

class WelcomeBox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="welcome-box">
        <p className="title is-3">Welcome!</p>
        <p className="title is-4">There are tons of courses already here for you to choose from. Click here to start</p>
        <Link to={`/institutions/${this.props.instId}`}>
          <figure className="image">
            <img src="../../public/images/login-page-photo.png" />
          </figure>
        </Link>
      </div>
    );
  }
}

export default WelcomeBox;
