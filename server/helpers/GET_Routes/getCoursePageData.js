const getCoursePageData = (req, res, knex, user_id) => {

  let docs, courseInfo, itemsForSale, courseFeeds;

  const getDocRevisions = doc => new Promise((resolve, reject) => {
    knex('revisions').where('doc_id', doc.id).whereNull('deleted_at').orderBy('created_at', 'desc')
    .then(revisions => {
      doc.revisions = revisions;
      doc.title = revisions[0].title;
      doc.type = revisions[0].type;
      resolve();
    })
    .catch(err => reject('Unable to get revisions for course: ', err));
  });

  const getDocLikeCount = doc => new Promise((resolve, reject) => {
    knex('doc_user_likes').where('doc_id', doc.id)
    .then(rows => {
      doc.likeCount = rows.reduce((a, b) => {
        return { like_count: parseInt(a.like_count) + parseInt(b.like_count) };
      }, {like_count : 0}).like_count;
      resolve();
    })
    .catch(err => reject('Unable to get doc like count: ', err));
  });

  const getDocs = () => knex('docs')
    .where('course_id', req.params.course_id)
    .whereNull('deleted_at')
    .orderBy('created_at', 'desc');

  const getCourseInfo = () => knex('courses')
    .innerJoin('institutions', 'inst_id', 'institutions.id')
    .select('inst_display_name', 'short_display_name', 'full_display_name', 'course_desc', 'inst_id', 'courses.id')
    .where('courses.id', req.params.course_id);

  const getCourseUserInfo = () => knex('course_user')
    .where('user_id', user_id)
    .andWhere('course_id', req.params.course_id);

  const getTutorLogInfo = () => knex('tutor_log')
    .where('student_id', user_id)
    .andWhere('course_id', req.params.course_id)
    .whereNull('closed_at');

  const getItemsForSale = () => knex('items_for_sale')
    .select('id', 'owner_id', 'course_id', 'price', 'photo_name', 'title', 'item_desc', 'created_at')
    .where('course_id', req.params.course_id)
    .whereNull('deleted_at');

  const getAvgCourseRating = () => knex('course_reviews')
    .where('course_id', req.params.course_id)
    .avg('overall_rating');

  const getCourseFeeds = () => knex('course_feed')
    .innerJoin('users', 'course_feed.commenter_id', 'users.id')
    .select(
      'course_feed.id', 'course_feed.created_at', 'course_feed.tutor_log_id', 'course_feed.course_id', 'course_feed.item_for_sale_id', 'course_feed.course_review_id',
      'course_feed.anonymous', 'course_feed.commenter_id', 'course_feed.category', 'course_feed.content', 'course_feed.header',
      'course_feed.doc_id', 'users.photo_name', 'users.username as commenter_name'
    )
    .where('course_feed.course_id', req.params.course_id)
    .orderBy('course_feed.created_at', 'desc');

  const categorizeFeed = feedArr => feedArr.map(feed => {
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
    feed.editable = feed.commenter_id === user_id;
    return feed;
  });

  Promise.all([
    getDocs(),
    getCourseInfo(),
    getCourseUserInfo(),
    getTutorLogInfo(),
    getItemsForSale(),
    getAvgCourseRating(),
    getCourseFeeds()
  ])
  .then(results => {
    courseFeeds = categorizeFeed(results[6]);
    itemsForSale = results[4].map(item => {
      item.editable = item.owner_id === user_id;
      return item;
    });
    let avgRating = results[5][0] ?  Math.round(results[5][0].avg / 5 * 100) : 0;
    let latestTutorLog = results[3][0];
    let userInfo = results[2][0];
    courseInfo = results[1][0];
    docs = results[0];
    courseInfo.subscriptionStatus = (userInfo && userInfo.sub_date) || false;
    courseInfo.tutorStatus = (userInfo && userInfo.tutor_status) || false;
    courseInfo.assistReqOpen = (latestTutorLog && !latestTutorLog.closed_at) || false;
    courseInfo.latestAssistRequest = latestTutorLog ? latestTutorLog.issue_desc : '';
    courseInfo.avgRating = avgRating;

    let promiseArr = [];
    docs.forEach(doc => {
      promiseArr.push(getDocRevisions(doc));
      promiseArr.push(getDocLikeCount(doc));
    });

    return Promise.all(promiseArr);
  })
  .then(() => res.send({ docs, courseInfo, itemsForSale, courseFeeds }))
  .catch(err => {
    console.error('Error inside getCoursePageData.js: ', err);
    res.send(false);
  });

};

module.exports = getCoursePageData;
