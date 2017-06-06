const getUserNavBarData = (req, res, knex, user_id) => {

  const getCourseIds = () => knex('users')
    .innerJoin('course_user', 'users.id', 'user_id')
    .select('course_user.course_id')
    .where('users.id', user_id)
    .whereNull('users.deleted_at')
    .whereNull('users.deleted_at')
    .whereNull('course_user.unsub_date')
    .whereNull('course_user.unsub_reason');

  const getCourseFeeds = courseIds => knex('course_feed')
    .select('created_at')
    .whereIn('course_id', courseIds)
    .orderBy('created_at', 'desc')
    .limit(1);

  const getResumeFeeds = () => knex('resumes')
    .select('resumes.review_requested_at as created_at')
    .where('audience_filter_id', req.session.inst_prog_id)
    .andWhere('audience_filter_table', 'institution_program')
    .whereNotNull('review_requested_at')
    .whereNull('deleted_at')
    .orderBy('review_requested_at', 'desc')
    .limit(1);

  const getLastUserFeedDate = () => knex('users')
    .select('last_feed_at')
    .where('id', user_id)
    .whereNull('deleted_at');

  getCourseIds()
  .then(courseIds => Promise.all([
    getCourseFeeds(courseIds.map(course => course.course_id)),
    getResumeFeeds(),
    getLastUserFeedDate()
  ]))
  .then(results => {
    let lastCourseFeedAt = results[0][0] ? results[0][0].created_at : '';
    let lastResumeFeedAt = results[1][0] ? results[1][0].created_at : '';
    let lastSeenAt = results[2][0].last_feed_at;
    const userInfo = {
      id: req.session.user_id,
      username: req.session.username,
      email: req.session.email,
      user_year: req.session.user_year,
      inst_prog_id: req.session.inst_prog_id,
      inst_id: req.session.inst_id,
      prog_id: req.session.prog_id,
      unviewed_notif: lastResumeFeedAt > lastSeenAt || lastCourseFeedAt > lastSeenAt
    };
    res.send({ userInfo });
  })
  .catch(err => {
    console.error('Error inside getUserNavBarData.js: ', err);
    res.send(false);
  });

};

module.exports = getUserNavBarData;
