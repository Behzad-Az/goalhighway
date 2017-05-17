'use strict';

// ***************************************************
// DEPENDENCIES
// ***************************************************
const express = require('express');
const url = require('url');
const app = express();
const bodyParser = require('body-parser');
const bcryptJs = require('bcryptjs');
const session = require('express-session');
const connection = require('./db/knexfile.js').development;
const knex = require('knex')(connection);
const fs = require('fs');
const path = require('path');
const elasticsearch = require('elasticsearch');
const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyAf8NX2LPzDPLTwLeHX9IgJ3LuvDQXiiEI'
});

// ***************************************************
// NODE MAILER SETUP
// ***************************************************
// const nodemailer = require('nodemailer');
// const mailer = nodemailer.createTransport({
//   host: 'mailtrap.io',
//   port: 2525,
//   auth: {
//     user: '12d82a5ce210c8',
//     pass: '2b5b44e86ab965'
//   }
// });

const blacklist = ['/api/home', '/api/courses', '/api/users', '/api/docs', '/api/institutions', '/images'];

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
    console.error('Error inside server.js - invalid req.session.user_id');
    res.send(false);
  }
});
app.use(express.static(path.join(__dirname, 'public')));


// ***************************************************
// DOCUMENT STORAGE
// ***************************************************
const documentUpload = require('./helpers/Upload_Helpers/documentUpload.js');
const resumeUpload = require('./helpers/Upload_Helpers/resumeUpload.js');
const userPhotoUpload = require('./helpers/Upload_Helpers/userPhotoUpload.js');
const itemForSaleUpload = require('./helpers/Upload_Helpers/itemForSaleUpload.js');

// ***************************************************
// PORT
// ***************************************************
const PORT = process.env.PORT || 19001;
const server = app.listen(PORT, '127.0.0.1', 'localhost', () => console.log(`Listening on ${ PORT }`));

// ***************************************************
// HELPERS
// ***************************************************
const getIndexPageData = require('./helpers/GET_Routes/getIndexPageData.js');
const getUserProfileData = require('./helpers/GET_Routes/getUserProfileData.js');
const getCoursePageData = require('./helpers/GET_Routes/getCoursePageData.js');
const getCoursePageFeed = require('./helpers/GET_Routes/getCoursePageFeed.js');
const getCoursePageDocs = require('./helpers/GET_Routes/getCoursePageDocs.js');
const getCoursePageItems = require('./helpers/GET_Routes/getCoursePageItems.js');
const getDocPageData = require('./helpers/GET_Routes/getDocPageData.js');
const getDocPageRevisions = require('./helpers/GET_Routes/getDocPageRevisions.js');
const getCourseReviewPageData = require('./helpers/GET_Routes/getCourseReviewPageData.js');
const getCourseReviewPageReviews = require('./helpers/GET_Routes/getCourseReviewPageReviews.js');
const getInstPageData = require('./helpers/GET_Routes/getInstPageData.js');
const getRevisionData = require('./helpers/GET_Routes/getRevisionData.js');
const getJobPageData = require('./helpers/GET_Routes/getJobPageData.js');
const getUserNavBarData = require('./helpers/GET_Routes/getUserNavBarData.js');
const getInstitutionsAndPrograms = require('./helpers/GET_Routes/getInstitutionsAndPrograms.js');
const getInstList = require('./helpers/GET_Routes/getInstList.js');
const getLoginCheck = require('./helpers/GET_Routes/getLoginCheck.js');
const getRightSideBarData = require('./helpers/GET_Routes/getRightSideBarData.js');
const getLeftSideBarData = require('./helpers/GET_Routes/getLeftSideBarData.js');
const getCompanyPageData = require('./helpers/GET_Routes/getCompanyPageData.js');
const getFeedPageData = require('./helpers/GET_Routes/getFeedPageData.js');
const getResumeData = require('./helpers/GET_Routes/getResumeData.js');
const getConversationPageData = require('./helpers/GET_Routes/getConversationPageData.js');

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
const postNewResume = require('./helpers/POST_Routes/postNewResume.js');
const postNewResumeReviewFeed = require('./helpers/POST_Routes/postNewResumeReviewFeed.js');
const postNewConversation = require('./helpers/POST_Routes/postNewConversation.js');
const postNewConvMessage = require('./helpers/POST_Routes/postNewConvMessage.js');

const updateUserProfile = require('./helpers/UPDATE_Routes/updateUserProfile.js');
const updateCourseUserTutorStatus = require('./helpers/UPDATE_Routes/updateCourseUserTutorStatus.js');
const updateTutorLog = require('./helpers/UPDATE_Routes/updateTutorLog.js');
const updateItemForSale = require('./helpers/UPDATE_Routes/updateItemForSale.js');
const updateResume = require('./helpers/UPDATE_Routes/updateResume.js');

const deleteRevision = require('./helpers/DELETE_Routes/deleteRevision.js');
const deleteCourseFeed = require('./helpers/DELETE_Routes/deleteCourseFeed.js');
const deleteCourseUser = require('./helpers/DELETE_Routes/deleteCourseUser.js');
const deleteResume = require('./helpers/DELETE_Routes/deleteResume.js');
const deleteResumeReviewRequest = require('./helpers/DELETE_Routes/deleteResumeReviewRequest.js');
const deleteItemForSale = require('./helpers/DELETE_Routes/deleteItemForSale.js');
const deleteConversation = require('./helpers/DELETE_Routes/deleteConversation.js');


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

app.get('/api/courses/:course_id/feed', (req, res) => {
  getCoursePageFeed(req, res, knex, req.session.user_id);
});

app.get('/api/courses/:course_id/docs/types/:doc_type', (req, res) => {
  getCoursePageDocs(req, res, knex, req.session.user_id);
});

app.get('/api/courses/:course_id/items', (req, res) => {
  getCoursePageItems(req, res, knex, req.session.user_id);
});

app.get('/api/courses/:course_id/reviews/toprow', (req, res) => {
  getCourseReviewPageData(req, res, knex, req.session.user_id);
});

app.get('/api/courses/:course_id/reviews/reviews', (req, res) => {
  getCourseReviewPageReviews(req, res, knex, req.session.user_id);
});

app.get('/api/courses/:course_id/docs/:doc_id', (req, res) => {
  getDocPageData(req, res, knex, req.session.user_id);
});

app.get('/api/courses/:course_id/docs/:doc_id/revisions', (req, res) => {
  getDocPageRevisions(req, res, knex, req.session.user_id);
});

app.get('/api/courses/:course_id/docs/:doc_id/revisions/:rev_id', (req, res) => {
  getRevisionData(req, res, knex);
});

app.get('/api/institutions', (req, res) => {
  getInstList(req, res, knex, req.session.user_id);
});

app.get('/api/institutions/:inst_id', (req, res) => {
  getInstPageData(req, res, knex, req.session.user_id);
});

app.get('/api/jobs', (req, res) => {
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

app.get('/api/resumes/:resume_id', (req, res) => {
  getResumeData(req, res, knex, req.session.user_id);
});

app.get('/api/chatroom', (req, res) => {
  res.send({text: 'Hello world'});
});

app.get('/api/conversations', (req, res) => {
  getConversationPageData(req, res, knex, req.session.user_id);
});


// ***************************************************
// ROUTES - POST
// ***************************************************
app.post('/api/courses', (req, res) => {
  postNewCourse(req, res, knex, req.session.user_id, esClient);
});

app.post('/api/courses/:course_id/docs', documentUpload.single('file'), (req, res) => {
  req.file ? postNewDoc(req, res, knex, req.session.user_id, esClient) : res.send(false);
});

app.post('/api/courses/:course_id/items', itemForSaleUpload.single('file'), (req, res) => {
  postNewItemForSale(req, res, knex, req.session.user_id);
});

app.post('/api/courses/:course_id/reviews', (req, res) => {
  postNewCourseReview(req, res, knex, req.session.user_id);
});

app.post('/api/courses/:course_id/docs/:doc_id', documentUpload.single('file'), (req, res) => {
  postNewRevision(req, res, knex, req.session.user_id, esClient);
});

app.post('/api/likes/:foreign_table/:foreign_id', (req, res) => {
  postNewLikeDislike(req, res, knex, req.session.user_id);
});

app.post('/api/courses/:course_id/feed', (req, res) => {
  postNewCourseFeed(req, res, knex, req.session.user_id);
});

app.post('/api/users/:user_id/courses/:course_id', (req, res) => {
  postNewCourseUser(req, res, knex, req.session.user_id);
});

app.post('/api/users/:user_id/resumes', resumeUpload.single('file'), (req, res) => {
  req.file ? postNewResume(req, res, knex, req.session.user_id) : res.send(false);
});

app.post('/api/feed/resumes/:resume_id', (req, res) => {
  postNewResumeReviewFeed(req, res, knex, req.session.user_id);
});

app.post('/api/users/:user_id/courses/:course_id/tutorlog', (req, res) => {
  postNewCourseUserAssistReq(req, res, knex, req.session.user_id);
});

app.post('/api/institutions', (req, res) => {
  postNewInst(req, res, knex, req.session.user_id, esClient);
});

app.post('/api/register', (req, res) => {
  postNewUser(req, res, knex, bcryptJs);
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

app.post('/api/conversations', (req, res) => {
  postNewConversation(req, res, knex, req.session.user_id);
});

app.post('/api/conversations/:conversation_id', (req, res) => {
  postNewConvMessage(req, res, knex, req.session.user_id);
});


// ***************************************************
// ROUTES - UPDATE
// ***************************************************
app.post('/api/users/:user_id', userPhotoUpload.single('file'), (req, res) => {
  updateUserProfile(req, res, knex, req.session.user_id, googleMapsClient);
});

app.post('/api/users/:user_id/courses/:course_id/tutor', (req, res) => {
  updateCourseUserTutorStatus(req, res, knex, req.session.user_id);
});

app.post('/api/users/:user_id/courses/:course_id/tutorlog/update', (req, res) => {
  updateTutorLog(req, res, knex, req.session.user_id);
});

app.post('/api/courses/:course_id/items/:item_id', itemForSaleUpload.single('file'), (req, res) => {
  updateItemForSale(req, res, knex, req.session.user_id);
});

app.post('/api/login', (req, res) => {
  postLogin(req, res, knex, bcryptJs);
});

app.post('/api/users/:user_id/resumes/:resume_id', resumeUpload.single('file'), (req, res) => {
  updateResume(req, res, knex, req.session.user_id);
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

app.delete('/api/users/:user_id/resumes/:resume_id', (req, res) => {
  deleteResume(req, res, knex, req.session.user_id);
});

app.delete('/api/feed/resumes/:resume_id', (req, res) => {
  deleteResumeReviewRequest(req, res, knex, req.session.user_id);
});

app.delete('/api/courses/:course_id/items/:item_id', (req, res) => {
  deleteItemForSale(req, res, knex, req.session.user_id);
});

app.delete('/api/conversations/:conversation_id', (req, res) => {
  deleteConversation(req, res, knex, req.session.user_id);
});
