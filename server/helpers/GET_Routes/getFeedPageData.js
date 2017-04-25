const getFeedPageData = (req, res, knex, user_id) => {

  const getCourseIds = () => knex('users')
    .innerJoin('course_user', 'users.id', 'user_id')
    .select('course_id')
    .where('users.id', user_id)
    .whereNull('unsub_date');

  const getCourseFeeds = courseIds => knex('course_feed')
    .innerJoin('courses', 'course_feed.course_id', 'courses.id')
    .innerJoin('users', 'course_feed.commenter_id', 'users.id')
    .select(
      'course_feed.id', 'course_feed.created_at', 'course_feed.tutor_log_id', 'course_feed.course_id', 'course_feed.item_for_sale_id', 'course_feed.course_review_id',
      'course_feed.anonymous', 'course_feed.commenter_id', 'course_feed.category', 'course_feed.content', 'course_feed.header',
      'course_feed.doc_id', 'courses.short_display_name', 'users.photo_name', 'users.username as commenter_name'
    )
    .whereIn('courses.id', courseIds)
    .orderBy('course_feed.created_at', 'desc')
    .limit(10)
    .offset(parseInt(req.query.coursefeedoffset));

  const getResumeFeeds = () => knex('resumes')
    .innerJoin('users', 'resumes.owner_id', 'users.id')
    .select(
      'resumes.id', 'resumes.title', 'resumes.intent', 'resumes.review_requested_at as created_at',
      'users.id as commenter_id', 'users.username as commenter_name', 'users.photo_name'
    )
    .where('audience_filter_id', req.session.inst_prog_id)
    .andWhere('audience_filter_table', 'institution_program')
    .whereNotNull('resumes.review_requested_at')
    .whereNull('resumes.deleted_at')
    .orderBy('resumes.review_requested_at', 'desc')
    .limit(2)
    .offset(parseInt(req.query.resumefeedoffset));

  const updateUserFeedDate = () => knex('users')
    .where('id', user_id)
    .update('last_feed_at', knex.fn.now());

  const categorizeFeed = (feedArr, feedType) => feedArr.map(feed => {
    let documentFeedCategories = [
      'new_asg_report', 'new_lecture_note', 'new_sample_question', 'new_document', 'revised_asg_report',
      'revised_lecture_note', 'revised_sample_question', 'revised_document'
    ];
    if (feed.anonymous) {
      feed.commenter_name = 'Anonymous';
      if (feed.category === 'new_comment') { feed.photo_name = 'anonymous_user_photo.png'; }
      else if (feed.category === 'new_item_for_sale') { feed.photo_name = 'item_for_sale.png'; }
      else if (feed.category === 'new_course_review') { feed.photo_name = 'course_review.png'; }
      else if (documentFeedCategories.includes(feed.category)) { feed.photo_name = 'document.png'; }
    }
    feed.type = feedType;
    feed.editable = feed.commenter_id === user_id;
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
