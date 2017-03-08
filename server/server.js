'use strict';

// ***************************************************
// DEPENDENCIES
// ***************************************************
const express = require('express');
const url = require('url');
const app = express();
const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt');
// const bcryptNodeJs = require('bcryptNodeJs');
const bcryptJs = require('bcryptjs');
const session = require('express-session');
const connection = require('./db/knexfile.js').development;
const knex = require('knex')(connection);
const fs = require('fs');
const elasticsearch = require('elasticsearch');
const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyAf8NX2LPzDPLTwLeHX9IgJ3LuvDQXiiEI'
});
const blacklist = ['/api/home', '/api/courses', '/api/users', '/api/docs', '/api/institutions'];


// ***************************************************
// MIDDLEWARE
// ***************************************************
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  // SECRET GOES INTO .ENV FILE
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(blacklist, (req, res, next) => {
  if (req.session.user_id) {
    next();
  } else {
    console.error("Error inside server.js - invalid req.session.user_id");
    res.send(false);
  }
});


// ***************************************************
// PORT
// ***************************************************
const PORT = process.env.PORT || 19001;
const server = app.listen(PORT, '127.0.0.1', 'localhost', () => console.log(`Listening on ${ PORT }`));
// app.listen(PORT, () => {
//   console.log(`listening to http://localhost: ${PORT}`);
// });


// ***************************************************
// HELPERS
// ***************************************************
const getIndexPageData = require('./helpers/GET_Routes/getIndexPageData.js');
const getUserProfileData = require('./helpers/GET_Routes/getUserProfileData.js');
const getCoursePageData = require('./helpers/GET_Routes/getCoursePageData.js');
const getDocPageData = require('./helpers/GET_Routes/getDocPageData.js');
const getCourseReviewPageData = require('./helpers/GET_Routes/getCourseReviewPageData.js');
const getInstPageData = require('./helpers/GET_Routes/getInstPageData.js');
const getRevisionData = require('./helpers/GET_Routes/getRevisionData.js');
const getJobPageData = require('./helpers/GET_Routes/getJobPageData.js');
// const getCourseFeed = require('./helpers/GET_Routes/getCourseFeed.js');
const getUserNavBarData = require('./helpers/GET_Routes/getUserNavBarData.js');
const getInstitutionsAndPrograms = require('./helpers/GET_Routes/getInstitutionsAndPrograms.js');
const getInstList = require('./helpers/GET_Routes/getInstList.js');
const getInstCourses = require('./helpers/GET_Routes/getInstCourses.js');
const getLoginCheck = require('./helpers/GET_Routes/getLoginCheck.js');
const getRightSideBarData = require('./helpers/GET_Routes/getRightSideBarData.js');
const getLeftSideBarData = require('./helpers/GET_Routes/getLeftSideBarData.js');
const getCompanyPageData = require('./helpers/GET_Routes/getCompanyPageData.js');
const getFeedPageData = require('./helpers/GET_Routes/getFeedPageData.js');

const postNewDoc = require('./helpers/POST_Routes/postNewDoc.js');
const postNewRevision = require('./helpers/POST_Routes/postNewRevision.js');
const postNewLikeDislike = require('./helpers/POST_Routes/postNewLikeDislike.js');
const postNewCourseFeed = require('./helpers/POST_Routes/postNewCourseFeed.js');
const postNewCourseUser = require('./helpers/POST_Routes/postNewCourseUser.js');
const postNewCourseUserAssistReq = require('./helpers/POST_Routes/postNewCourseUserAssistReq.js');
const postNewCourseReview = require('./helpers/POST_Routes/postNewCourseReview.js');
const postNewItemForSale = require('./helpers/POST_Routes/postNewItemForSale.js');
const postNewCourse = require('./helpers/POST_Routes/postNewCourse.js');
const postNewInst = require('./helpers/POST_Routes/postNewInst.js');
const postNewUser = require('./helpers/POST_Routes/postNewUser.js');
const postLogin = require('./helpers/POST_Routes/postLogin.js');
const postSearchBarResults = require('./helpers/POST_Routes/postSearchBarResults.js');
const checkUsernameAvailability = require('./helpers/POST_Routes/checkUsernameAvailability.js');
const checkEmailAvailability = require('./helpers/POST_Routes/checkEmailAvailability.js');
const postNewFlag = require('./helpers/POST_Routes/postNewFlag.js');
const postNewInterviewQuestion = require('./helpers/POST_Routes/postNewInterviewQuestion.js');
const postNewInterviewAnswer = require('./helpers/POST_Routes/postNewInterviewAnswer.js');

const updateUserProfile = require('./helpers/UPDATE_Routes/updateUserProfile.js');
const updateCourseUserTutorStatus = require('./helpers/UPDATE_Routes/updateCourseUserTutorStatus.js');
const updateTutorLog = require('./helpers/UPDATE_Routes/updateTutorLog.js');
const updateViewedNotifications = require('./helpers/UPDATE_Routes/updateViewedNotifications.js');
const updateItemForSale = require('./helpers/UPDATE_Routes/updateItemForSale.js');

const deleteRevision = require('./helpers/DELETE_Routes/deleteRevision.js');
const deleteCourseFeed = require('./helpers/DELETE_Routes/deleteCourseFeed.js');
const deleteCourseUser = require('./helpers/DELETE_Routes/deleteCourseUser.js');


// ***************************************************
// ROUTES - GET
// ***************************************************
app.get('/api/home', (req, res) => {
  getIndexPageData(req, res, knex, req.session.user_id);
});

app.get('/api/users/:user_id', (req, res) => {
  getUserProfileData(req, res, knex, req.session.user_id);
});

app.get('/api/courses/:course_id', (req, res) => {
  getCoursePageData(req, res, knex, req.session.user_id);
});

app.get('/api/courses/:course_id/reviews', (req, res) => {
  getCourseReviewPageData(req, res, knex, req.session.user_id);
});

app.get('/api/courses/:course_id/docs/:doc_id', (req, res) => {
  getDocPageData(req, res, knex, req.session.user_id);
});

app.get('/api/courses/:course_id/docs/:doc_id/revisions/:rev_id', (req, res) => {
  getRevisionData(req, res, knex);
});

// app.get('/api/courses/:course_id/feed', (req, res) => {
//   getCourseFeed(req, res, knex, req.session.user_id);
// });

app.get('/api/institutions', (req, res) => {
  getInstList(req, res, knex, req.session.user_id);
});

app.get('/api/institutions/:inst_id', (req, res) => {
  getInstPageData(req, res, knex, req.session.user_id);
});

app.get('/api/institutions/:inst_id/courses', (req, res) => {
  getInstCourses(req, res, knex, req.session.user_id);
});

app.get('/api/users/:user_id/jobs', (req, res) => {
  getJobPageData(req, res, knex, req.session.user_id, esClient);
});

app.get('/api/companies/:company_id', (req, res) => {
  getCompanyPageData(req, res, knex, req.session.user_id, esClient);
});

app.get('/api/rightsidebar', (req, res) => {
  getRightSideBarData(req, res, knex, req.session.user_id);
});

app.get('/api/leftsidebar', (req, res) => {
  getLeftSideBarData(req, res, knex, req.session.user_id);
});

app.get('/api/login/check', (req, res) => {
  getLoginCheck(req, res);
});

app.get('/api/logout', (req, res) => {
  req.session.destroy();
  res.send(true);
});

app.get('/api/usernavbardata', (req, res) => {
  getUserNavBarData(req, res, knex, req.session.user_id);
});

app.get('/api/institutions_programs', (req, res) => {
  getInstitutionsAndPrograms(req, res, knex, req.session.user_id);
});

app.get('/api/users/:user_id/feed', (req, res) => {
  getFeedPageData(req, res, knex, req.session.user_id);
});

app.get('/api/chatroom', (req, res) => {
  res.send({text: 'Hello world'});
});


// ***************************************************
// ROUTES - POST
// ***************************************************
app.post('/api/courses', (req, res) => {
  postNewCourse(req, res, knex, req.session.user_id, esClient);
});

app.post('/api/courses/:course_id', (req, res) => {
  postNewDoc(req, res, knex, req.session.user_id, esClient);
});

app.post('/api/courses/:course_id/items', (req, res) => {
  postNewItemForSale(req, res, knex, req.session.user_id);
});

app.post('/api/courses/:course_id/reviews', (req, res) => {
  postNewCourseReview(req, res, knex, req.session.user_id);
});

app.post('/api/courses/:course_id/docs/:doc_id', (req, res) => {
  postNewRevision(req, res, knex, req.session.user_id, esClient);
});

app.post('/api/courses/:course_id/docs/:doc_id/likes', (req, res) => {
  postNewLikeDislike(req, res, knex, req.session.user_id);
});

app.post('/api/courses/:course_id/comments', (req, res) => {
  postNewCourseFeed(req, res, knex, req.session.user_id);
});

app.post('/api/users/:user_id/courses/:course_id', (req, res) => {
  postNewCourseUser(req, res, knex, req.session.user_id);
});

app.post('/api/users/:user_id/courses/:course_id/tutorlog', (req, res) => {
  postNewCourseUserAssistReq(req, res, knex, req.session.user_id);
});

app.post('/api/institutions', (req, res) => {
  postNewInst(req, res, knex, req.session.user_id);
});

app.post('/api/register', (req, res) => {
  postNewUser(req, res, knex, bcryptJs, esClient);
});

app.post('/api/searchbar', (req, res) => {
  postSearchBarResults(req, res, knex, req.session.user_id, esClient);
});

app.post('/api/username_availability', (req, res) => {
  checkUsernameAvailability(req, res, knex, req.session.user_id);
});

app.post('/api/email_availability', (req, res) => {
  checkEmailAvailability(req, res, knex, req.session.user_id);
});

app.post('/api/flags/:foreign_table/:foreign_id', (req, res) => {
  postNewFlag(req, res, knex, req.session.user_id);
});

app.post('/api/companies/:company_id', (req, res) => {
  postNewInterviewQuestion(req, res, knex, req.session.user_id);
});

app.post('/api/companies/:company_id/questions/:question_id', (req, res) => {
  postNewInterviewAnswer(req, res, knex, req.session.user_id);
});


// ***************************************************
// ROUTES - UPDATE
// ***************************************************
app.post('/api/users/:user_id', (req, res) => {
  updateUserProfile(req, res, knex, req.session.user_id, googleMapsClient);
});

app.post('/api/users/:user_id/courses/:course_id/tutor', (req, res) => {
  updateCourseUserTutorStatus(req, res, knex, req.session.user_id);
});

app.post('/api/users/:user_id/courses/:course_id/tutorlog/update', (req, res) => {
  updateTutorLog(req, res, knex, req.session.user_id);
});

app.post('/api/users/:user_id/notifications/viewed', (req, res) => {
  updateViewedNotifications(req, res, knex, req.session.user_id);
});

app.post('/api/courses/:course_id/items/:item_id', (req, res) => {
  updateItemForSale(req, res, knex, req.session.user_id);
});

app.post('/api/login', (req, res) => {
  postLogin(req, res, knex, bcryptJs);
});


// ***************************************************
// ROUTES - DELETE
// ***************************************************
app.delete('/api/courses/:course_id/docs/:doc_id/revisions/:rev_id', (req, res) => {
  deleteRevision(req, res, knex, req.session.user_id, esClient);
});

app.delete('/api/courses/:course_id/feed/:feed_id', (req, res) => {
  deleteCourseFeed(req, res, knex, req.session.user_id);
});

app.delete('/api/users/:user_id/courses/:course_id', (req, res) => {
  deleteCourseUser(req, res, knex, req.session.user_id);
});
