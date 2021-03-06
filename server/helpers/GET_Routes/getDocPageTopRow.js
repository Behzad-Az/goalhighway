const getDocPageTopRow = (req, res, knex, user_id) => {

  const getDocInfo = () => knex('docs')
    .select('id', 'course_id', 'latest_type as type', 'latest_title as title')
    .where('course_id', req.params.course_id)
    .andWhere('id', req.params.doc_id)
    .whereNull('deleted_at')
    .limit(1);

  const getCourseInfo = () => knex('courses')
    .innerJoin('institutions', 'inst_id', 'institutions.id')
    .select('institutions.inst_display_name', 'courses.short_display_name', 'courses.inst_id', 'courses.id')
    .where('courses.id', req.params.course_id)
    .whereNull('courses.deleted_at')
    .limit(1);

  const getCourseUserInfo = () => knex('course_user')
    .select('sub_date', 'tutor_status')
    .where('user_id', user_id)
    .andWhere('course_id', req.params.course_id)
    .whereNull('unsub_date')
    .whereNull('unsub_reason')
    .orderBy('sub_date')
    .limit(1);

  const getTutorLogInfo = () => knex('tutor_log')
    .select('closed_at', 'issue_desc')
    .where('student_id', user_id)
    .andWhere('course_id', req.params.course_id)
    .whereNull('closed_at')
    .whereNull('closure_reason')
    .limit(1);

  const getAvgCourseRating = () => knex('course_reviews')
    .where('course_id', req.params.course_id)
    .whereNull('deleted_at')
    .avg('overall_rating');

  Promise.all([
    getDocInfo(),
    getCourseInfo(),
    getCourseUserInfo(),
    getTutorLogInfo(),
    getAvgCourseRating()
  ])
  .then(results => {
    let courseInfo = results[1][0];
    const userInfo = results[2][0];
    const latestTutorLog = results[3][0];
    courseInfo.subscriptionStatus = (userInfo && userInfo.sub_date) || false;
    courseInfo.tutorStatus = (userInfo && userInfo.tutor_status) || false;
    courseInfo.assistReqOpen = (latestTutorLog && !latestTutorLog.closed_at) || false;
    courseInfo.latestAssistRequest = latestTutorLog ? latestTutorLog.issue_desc : '';
    courseInfo.avgRating = results[4][0] ? Math.round(results[4][0].avg / 5 * 100) : 0;
    res.send({ docInfo: results[0][0], courseInfo });
  })
  .catch(err => {
    console.error('Error inside getDocPageTopRow.js: ', err);
    res.send(false);
  });

};

module.exports = getDocPageTopRow;
