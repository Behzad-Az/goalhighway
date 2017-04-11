const getFeedPageData = (req, res, knex, user_id) => {

  const getCourseIds = () => knex('users')
    .innerJoin('course_user', 'users.id', 'user_id')
    .select('course_id')
    .where('users.id', user_id);

  const getCourseFeeds = courseIds => knex('course_feed')
    .innerJoin('courses', 'course_id', 'courses.id')
    .select('course_feed.id', 'short_display_name', 'commenter_name', 'category', 'content', 'course_id', 'doc_id', 'tutor_log_id')
    .whereIn('course_id', courseIds);

  const getResumeFeeds = () => knex('resume_review_feed')
    .where('audience_filter_id', req.session.inst_prog_id)
    .andWhere('audience_filter_table', 'institution_program')
    .whereNull('feed_deleted_at');

  getCourseIds()
  .then(courses => Promise.all([ getCourseFeeds(courses.map(course => course.course_id)), getResumeFeeds() ]))
  .then(results => res.send({ courseFeeds: results[0], resumeReviewFeeds: results[1] }))
  .catch(err => {
    console.error('Error inside getFeedPageData.js: ', err);
    res.send(false);
  });

};

module.exports = getFeedPageData;
