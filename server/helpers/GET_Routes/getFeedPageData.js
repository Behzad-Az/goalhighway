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
      'course_feed.commenter_name', 'course_feed.commenter_id', 'course_feed.category', 'course_feed.content', 'course_feed.header',
      'course_feed.doc_id', 'courses.short_display_name'
    )
    .whereIn('courses.id', courseIds)
    .orderBy('course_feed.created_at', 'desc')
    .limit(10)
    .offset(parseInt(req.query.coursefeedoffset));

  const getResumeFeeds = () => knex('resume_review_feed')
    .select('id', 'additional_info', 'created_at', 'owner_name', 'owner_id', 'resume_id', 'title')
    .where('audience_filter_id', req.session.inst_prog_id)
    .andWhere('audience_filter_table', 'institution_program')
    .whereNull('deleted_at')
    .orderBy('created_at', 'desc')
    .limit(2)
    .offset(parseInt(req.query.resumefeedoffset));

  const updateUserFeedDate = () => knex('users')
    .where('id', user_id)
    .update('last_feed_at', knex.fn.now());

  const categorizeFeed = (feedArr, feedType) => feedArr.map(feed => {
    feed.type = feedType;
    return feed;
  });

  getCourseIds()
  .then(courses => Promise.all([ getCourseFeeds(courses.map(course => course.course_id)), getResumeFeeds() ]))
  .then(results => {
    req.session.unviewed_notif = false;
    let feeds = categorizeFeed(results[0], 'courseFeed')
                .concat(categorizeFeed(results[1], 'resumeReviewFeed'));
    res.send({ feeds, instId: req.session.inst_id });
  })
  .then(() => updateUserFeedDate())
  .catch(err => {
    console.error('Error inside getFeedPageData.js: ', err);
    res.send(false);
  });

};

module.exports = getFeedPageData;
