
import React from 'react';
import {Router, Route, browserHistory} from 'react-router';

import IndexPage from './IndexPage/IndexPage.jsx';
import CoursePage from './CoursePage/CoursePage.jsx';
import DocPage from './DocPage/DocPage.jsx';
import CourseReviewPage from './CourseReviewPage/CourseReviewPage.jsx';
import UserProfilePage from './UserProfilePage/UserProfilePage.jsx';
import InstPage from './InstPage/InstPage.jsx';
import RegisterLoginPage from './RegisterLoginPage/RegisterLoginPage.jsx';
import CareerPage from './CareerPage/CareerPage.jsx';
import CompanyPage from './CompanyPage/CompanyPage.jsx';
import FeedPage from './FeedPage/FeedPage.jsx';

class App extends React.Component {
  constructor() {
    super();
    this.validateAuth = this.validateAuth.bind(this);
  }

  validateAuth(nextState, replace, callPage) {
    fetch('/api/login/check', {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => {
      console.log("userInfo: ", resJSON.userInfo);
      if (!resJSON.authorized) {
        replace('/login');
        callPage();
      } else {
        switch (nextState.routes[0].path) {
          case '/':
            replace('/home');
            callPage();
            break;

          case '/users/:user_id':
            if (nextState.params.user_id != resJSON.userInfo.username) { replace(`/users/${resJSON.userInfo.username}`); }
            callPage();
            break;

          default:
            callPage();
            break;
        }
      }
    })
    .catch(err => console.error(err));
  }

  render() {
    return (
      <Router history={browserHistory}>
        <Route path={'/'} onEnter={this.validateAuth} />
        <Route path={'/home'} component={IndexPage} onEnter={this.validateAuth} />
        <Route path={'/courses/:course_id'} component={CoursePage} onEnter={this.validateAuth} />
        <Route path={'/courses/:course_id/docs/:doc_id'} component={DocPage} onEnter={this.validateAuth} />
        <Route path={'/courses/:course_id/reviews'} component={CourseReviewPage} onEnter={this.validateAuth} />
        <Route path={'/institutions/:inst_id'} component={InstPage} onEnter={this.validateAuth} />
        <Route path={'/users/:user_id'} component={UserProfilePage} onEnter={this.validateAuth} />
        <Route path={'/jobs'} component={CareerPage} onEnter={this.validateAuth} />
        <Route path={'/companies/:company_id'} component={CompanyPage} onEnter={this.validateAuth} />
        <Route path={'/feed'} component={FeedPage} onEnter={this.validateAuth} />
        <Route path={'/login'} component={RegisterLoginPage} />
        <Route path={'*'} component={IndexPage} onEnter={this.validateAuth} />
      </Router>
    );
  }
}

export default App;
