import React, { Component } from 'react';
import {Router, Route, browserHistory} from 'react-router';
import { animateScroll } from 'react-scroll';
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
import ConversationPage from './ConversationPage/ConversationPage.jsx';
import RegisterConfirmPage from './RegisterConfirmPage/RegisterConfirmPage.jsx';
import ForgotPasswordPage from './ForgotPasswordPage/ForgotPasswordPage.jsx';
import ResetPasswordPage from './ForgotPasswordPage/ResetPasswordPage.jsx';
import NewJobPage from './NewJobPage/NewJobPage.jsx';

browserHistory.listen(location => {
  if (location.hash) {
    setTimeout(() => {
      const offset = document.getElementById(location.hash.slice(1)).getBoundingClientRect().top;
      animateScroll.scrollMore(offset - 55);
    }, 75);
  } else {
    animateScroll.scrollToTop();
  }
});

class App extends Component {
  constructor() {
    super();
    this._validateAuth = this._validateAuth.bind(this);
  }

  _validateAuth(nextState, replace, callPage) {
    fetch('/api/login/check', {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => {
      if (!resJSON.authorized) {
        if (nextState.routes[0].path !== '/login') { replace('/login'); }
        callPage();
      } else {
        switch (nextState.routes[0].path) {
          case '/':
            replace('/index');
            callPage();
            break;
          case '/login':
            replace('/index');
            callPage();
            break;
          default:
            callPage();
            break;
        }
      }
    })
    .catch(err => console.error('error while authenticating user', err));
  }

  render() {
    return (
      <Router history={browserHistory}>
        <Route path='/' onEnter={this._validateAuth} />
        <Route path='/login' component={RegisterLoginPage} onEnter={this._validateAuth} />
        <Route path='/index' component={IndexPage} onEnter={this._validateAuth} />
        <Route path='/profile' component={UserProfilePage} onEnter={this._validateAuth} />
        <Route path='/jobs' component={CareerPage} onEnter={this._validateAuth} />
        <Route path='/feed' component={FeedPage} onEnter={this._validateAuth} />
        <Route path='/courses/:course_id' component={CoursePage} onEnter={this._validateAuth} />
        <Route path='/courses/:course_id/docs/:doc_id' component={DocPage} onEnter={this._validateAuth} />
        <Route path='/courses/:course_id/reviews' component={CourseReviewPage} onEnter={this._validateAuth} />
        <Route path='/institutions/:inst_id' component={InstPage} onEnter={this._validateAuth} />
        <Route path='/companies/:company_id' component={CompanyPage} onEnter={this._validateAuth} />
        <Route path='/conversations' component={ConversationPage} onEnter={this._validateAuth} />
        <Route path='/confirm_register' component={RegisterConfirmPage} />
        <Route path='/forgot_account' component={ForgotPasswordPage} />
        <Route path='/reset_password' component={ResetPasswordPage} />
        <Route path='/post_job' component={NewJobPage} onEnter={this._validateAuth} />
        <Route path='*' component={IndexPage} onEnter={this._validateAuth} />
      </Router>
    );
  }
}

export default App;
