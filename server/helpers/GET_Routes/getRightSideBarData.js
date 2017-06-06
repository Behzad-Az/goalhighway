const getRightSideBarData = (req, res, knex, user_id) => {

  let instName, instPhoto, studentCount, courseCount, tutorCount, revCount;

  const getInstName = () => knex('institutions')
    .select('inst_long_name', 'photo_name')
    .where('id', req.session.inst_id)
    .whereNull('deleted_at')

  const getStudentCount = () => knex('institution_program')
    .innerJoin('users', 'institution_program.id', 'inst_prog_id')
    .where('inst_id', req.session.inst_id)
    .whereNull('institution_program.deleted_at')
    .whereNull('users.deleted_at')
    .count('username as studentCount');

  const getCourseCount = () => knex('courses')
    .where('inst_id', req.session.inst_id)
    .whereNull('deleted_at')
    .count('id as courseCount');

  const getTutorCount = courseIds => knex('course_user')
    .where('tutor_status', true)
    .whereIn('course_id', courseIds)
    .whereNull('unsub_date')
    .whereNull('unsub_reason')
    .count('user_id as tutorCount');

  const getRevCount = courseIds => knex('revisions')
    .innerJoin('docs', 'doc_id', 'docs.id')
    .innerJoin('courses', 'course_id', 'courses.id')
    .where('courses.inst_id', req.session.inst_id)
    .whereNull('revisions.deleted_at')
    .whereNull('docs.deleted_at')
    .whereNull('courses.deleted_at')
    .count('revisions.id as revCount');

  const getCourseIds = () => knex('users')
    .innerJoin('course_user', 'users.id', 'user_id')
    .select('course_user.course_id')
    .where('users.id', user_id)
    .whereNull('users.deleted_at')
    .whereNull('course_user.unsub_date')
    .whereNull('course_user.unsub_reason');

  const getCourseFeeds = courseIds => knex('course_feed')
    .innerJoin('courses', 'course_feed.course_id', 'courses.id')
    .innerJoin('users', 'course_feed.commenter_id', 'users.id')
    .select(
      'course_feed.id', 'course_feed.created_at', 'course_feed.tutor_log_id', 'course_feed.course_id', 'course_feed.item_for_sale_id', 'course_feed.course_review_id',
      'course_feed.anonymous', 'course_feed.commenter_id', 'course_feed.category', 'course_feed.content', 'course_feed.header',
      'course_feed.doc_id', 'courses.short_display_name', 'users.username as commenter_name'
    )
    .whereIn('courses.id', courseIds)
    .orderBy('course_feed.created_at', 'desc')
    .limit(3);

  const getResumeFeeds = () => knex('resumes')
    .innerJoin('users', 'resumes.owner_id', 'users.id')
    .select('resumes.id', 'resumes.title', 'resumes.intent', 'resumes.review_requested_at as created_at', 'users.id as commenter_id', 'users.username as commenter_name')
    .where('audience_filter_id', req.session.inst_prog_id)
    .andWhere('audience_filter_table', 'institution_program')
    .whereNotNull('resumes.review_requested_at')
    .whereNull('resumes.deleted_at')
    .orderBy('resumes.review_requested_at', 'desc')
    .limit(3);

  const categorizeFeed = (feedArr, feedType) => feedArr.map(feed => {
    if (feed.anonymous) { feed.commenter_name = 'Anonymous'; }
    feed.type = feedType;
    return feed;
  });

  Promise.all([
    getInstName(),
    getStudentCount(),
    getCourseCount(),
    getCourseIds()
  ])
  .then(results => {
    instName = results[0][0].inst_long_name;
    instPhoto = results[0][0].photo_name;
    studentCount = results[1][0].studentCount;
    courseCount = results[2][0].courseCount;
    const courseIds = results[3].map(course => course.course_id);
    return Promise.all([
      getTutorCount(courseIds),
      getRevCount(courseIds),
      getCourseFeeds(courseIds),
      getResumeFeeds()
    ]);
  })
  .then(results => res.send({
    instName,
    instPhoto,
    instId: req.session.inst_id,
    studentCount,
    courseCount,
    tutorCount: results[0][0].tutorCount,
    revCount: results[1][0].revCount,
    feeds: categorizeFeed(results[2], 'courseFeed').concat(categorizeFeed(results[3], 'resumeReviewFeed'))
  }))
  .catch(err => {
    console.error('Error inside getRightSideBarData.js: ', err);
    res.send(false);
  });

};

module.exports = getRightSideBarData;
