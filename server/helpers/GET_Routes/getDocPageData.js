const getDocPageData = (req, res, knex, user_id) => {

  let courseInfo;

  const getDocRevisions = doc => new Promise((resolve, reject) => {
    knex('revisions').where('doc_id', doc.id).whereNull('deleted_at').orderBy('created_at', 'desc')
    .then(revisions => {
      revisions.forEach(revision => revision.deleteable = revision.user_id === user_id);
      doc.revisions = revisions;
      doc.title = revisions[0].title;
      doc.type = revisions[0].type;
      resolve(doc);
    })
    .catch(err => reject('Unable to get revisions for doc: ', err));
  });

  const getCourseInfo = () => knex('courses')
    .innerJoin('institutions', 'inst_id', 'institutions.id')
    .select('inst_display_name', 'short_display_name', 'inst_id', 'courses.id')
    .where('courses.id', req.params.course_id);

  const getCourseUserInfo = () => knex('course_user')
    .where('user_id', user_id)
    .andWhere('course_id', req.params.course_id)
    .whereNull('unsub_date')
    .whereNull('unsub_reason')
    .orderBy('sub_date')
    .limit(1);

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
  ])
  .then(results => {
    let avgRating = results[4][0] ? Math.round(results[4][0].avg / 5 * 100) : 0;
    let latestTutorLog = results[3][0];
    let userInfo = results[2][0];
    courseInfo = results[1][0];
    courseInfo.subscriptionStatus = (userInfo && userInfo.sub_date) || false;
    courseInfo.tutorStatus = (userInfo && userInfo.tutor_status) || false;
    courseInfo.assistReqOpen = (latestTutorLog && !latestTutorLog.closed_at) || false;
    courseInfo.latestAssistRequest = latestTutorLog ? latestTutorLog.issue_desc : '';
    courseInfo.avgRating = avgRating;
    return getDocRevisions(results[0][0]);
  })
  .then(docInfo => res.send({ docInfo, courseInfo }))
  .catch(err => {
    console.error('Error inside getDocPageData.js: ', err);
    res.send(false);
  });

};

module.exports = getDocPageData;
