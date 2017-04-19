const getUserNavBarData = (req, res, knex, user_id) => {

  const getCourseIds = () => knex('users')
    .innerJoin('course_user', 'users.id', 'user_id')
    .select('course_id')
    .where('users.id', user_id)
    .whereNull('unsub_date');

  const getCourseFeeds = courseIds => knex('course_feed')
    .innerJoin('courses', 'course_feed.course_id', 'courses.id')
    .select(
      'course_feed.id', 'course_feed.created_at', 'course_feed.tutor_log_id', 'course_feed.course_id',
      'course_feed.commenter_name', 'course_feed.commenter_id', 'course_feed.category', 'course_feed.content', 'course_feed.header',
      'course_feed.doc_id', 'courses.short_display_name'
    )
    .whereIn('courses.id', courseIds)
    .orderBy('course_feed.created_at', 'desc')
    .limit(1);

  const getResumeFeeds = () => knex('resume_review_feed')
    .where('audience_filter_id', req.session.inst_prog_id)
    .andWhere('audience_filter_table', 'institution_program')
    .orderBy('created_at', 'desc')
    .limit(1);

  const getLastUserFeedDate = () => knex('users')
    .select('last_feed_at')
    .where('id', user_id);

  Promise.all([
    getCourseIds(),
    getLastUserFeedDate()
  ])
  .then(results => Promise.all([
    getCourseFeeds(results[0].map(course => course.course_id)),
    getResumeFeeds(),
    getLastUserFeedDate()
  ]))
  .then(results => {
    let lastCourseFeed = results[0][0] ? results[0][0].created_at : '';
    let lastResumeFeed = results[1][0] ? results[1][0].created_at : '';
    let lastFeedAt = results[2][0].last_feed_at;
    const userInfo = {
      id: req.session.user_id,
      username: req.session.username,
      email: req.session.email,
      user_year: req.session.user_year,
      inst_prog_id: req.session.inst_prog_id,
      inst_id: req.session.inst_id,
      prog_id: req.session.prog_id,
      unviewed_notif: lastResumeFeed > lastFeedAt || lastCourseFeed > lastFeedAt
    };
    res.send({ userInfo });
  })
  .catch(err => {
    console.error('Error inside getUserNavBarData.js: ', err);
    res.send(false);
  });

};

module.exports = getUserNavBarData;
