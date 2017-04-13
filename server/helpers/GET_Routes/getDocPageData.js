const getDocPageData = (req, res, knex, user_id) => {

  let docInfo, courseInfo;

  const getDocRevisions = doc => new Promise((resolve, reject) => {
    knex('revisions').where('doc_id', doc.id).whereNull('deleted_at').orderBy('created_at', 'desc')
    .then(revisions => {
      revisions.forEach(revision => revision.deleteable = revision.user_id === user_id);
      doc.revisions = revisions;
      doc.title = revisions[0].title;
      doc.type = revisions[0].type;
      resolve();
    }).catch((err) => {
      reject('Could not get revisions for course');
    });
  });

  const getCourseInfo = () => knex('courses')
    .innerJoin('institutions', 'inst_id', 'institutions.id')
    .select('inst_display_name', 'short_display_name', 'inst_id', 'courses.id')
    .where('courses.id', req.params.course_id);

  const getCourseUserInfo = () => knex('course_user')
    .where('user_id', user_id)
    .andWhere('course_id', req.params.course_id);

  const getDocInfo = () => knex('docs')
    .where('course_id', req.params.course_id)
    .andWhere('id', req.params.doc_id)
    .whereNull('deleted_at');

  const getTutorLogInfo = () => knex('tutor_log')
    .where('student_id', user_id)
    .andWhere('course_id', req.params.course_id)
    .whereNull('closed_at');

  const getSubscriptionStatus = () => knex('course_user')
    .where('user_id', user_id)
    .andWhere('course_id', req.params.course_id);

  const getAvgCourseRating = () => knex('course_reviews')
    .where('course_id', req.params.course_id)
    .avg('overall_rating');

  Promise.all([
    getDocInfo(),
    getCourseInfo(),
    getCourseUserInfo(),
    getTutorLogInfo(),
    getAvgCourseRating()
  ]).then(results => {
    let avgRating = results[4][0] ? Math.round(results[4][0].avg / 5 * 100) : 0;
    let latestTutorLog = results[3][0];
    let userInfo = results[2][0];
    courseInfo = results[1][0];
    docInfo = results[0][0];
    courseInfo.subscriptionStatus = (userInfo && userInfo.sub_date) || false;
    courseInfo.tutorStatus = (userInfo && userInfo.tutor_status) || false;
    courseInfo.assistReqOpen = (latestTutorLog && !latestTutorLog.closed_at) || false;
    courseInfo.latestAssistRequest = latestTutorLog ? latestTutorLog.issue_desc : '';
    courseInfo.avgRating = avgRating;

    return getDocRevisions(docInfo);

  }).then(() => {
    res.send({ docInfo, courseInfo });
  }).catch(err => {
    console.error('Error inside getDocPageData.js: ', err);
    res.send(false);
  });

};

module.exports = getDocPageData;
