const getFeedPageData = (req, res, knex, user_id) => {

  const getCourseIds = () => knex('users')
    .innerJoin('course_user', 'users.id', 'user_id')
    .select('course_id')
    .where('users.id', user_id)
    .whereNull('unsub_date');

  const getCourseFeeds = courseIds => knex('course_feed')
    .innerJoin('courses', 'course_feed.course_id', 'courses.id')
    .select(
      'course_feed.id', 'course_feed.created_at', 'course_feed.tutor_log_id', 'course_feed.course_id',
      'course_feed.commenter_name', 'course_feed.category', 'course_feed.content', 'course_feed.header',
      'course_feed.doc_id', 'courses.short_display_name'
    )
    .whereIn('courses.id', courseIds)
    .limit(200);

  const getResumeFeeds = () => knex('resume_review_feed')
    .where('audience_filter_id', req.session.inst_prog_id)
    .andWhere('audience_filter_table', 'institution_program')
    .whereNull('deleted_at');

  getCourseIds()
  .then(courses => Promise.all([ getCourseFeeds(courses.map(course => course.course_id)), getResumeFeeds() ]))
  .then(results => res.send({ courseFeeds: results[0], resumeReviewFeeds: results[1], instId: req.session.inst_id }))
  .catch(err => {
    console.error('Error inside getFeedPageData.js: ', err);
    res.send(false);
  });

};

module.exports = getFeedPageData;
