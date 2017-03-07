
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

class App extends React.Component {
  constructor() {
    super();
    this.validateAuth = this.validateAuth.bind(this);
  }

  validateAuth(nextState, replace, callPage) {
    replace('/login');
    callPage();

    // console.log("inside validateAuth");
    // fetch('/api/login/check')
    // .then(response => response.json())
    // .then(resJSON => {
    //   console.log("inside resJSON: ", resJSON);

    //   if (!resJSON.authorized) {
    //     console.log("inide unauthorize");
    //     replace('/login');
    //     callPage();
    //   } else {
    //     switch (nextState.routes[0].path) {
    //       case '/':
    //         console.log("inside /");
    //         replace('/home');
    //         callPage();
    //         break;

    //       case '/users/:user_id':
    //         console.log("inside users/user_id");
    //         if (nextState.params.user_id != resJSON.userInfo.user_id) { replace(`/users/${resJSON.userInfo.user_id}`); }
    //         callPage();
    //         break;

    //       case '/users/:user_id/jobs':
    //         console.log("inside userid/jobs");
    //         if (nextState.params.user_id != resJSON.userInfo.user_id) { replace(`/users/${resJSON.userInfo.user_id}/jobs`); }
    //         callPage();
    //         break;

    //       default:
    //         console.log("inside default");
    //         callPage();
    //         break;
    //     }
    //   }
    // })
    // .catch(err => {
    //   console.log("Error here: ", err);
    // });

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
        <Route path={'/users/:user_id/jobs'} component={CareerPage} onEnter={this.validateAuth} />
        <Route path={'/companies/:company_id'} component={CompanyPage} onEnter={this.validateAuth} />
        <Route path={'/login'} component={RegisterLoginPage} />
        <Route path={'*'} component={IndexPage} onEnter={this.validateAuth} />
      </Router>
    );
  }
}

export default App;
