const getCoursePageData = (req, res, knex, user_id) => {

  let docs, courseInfo, itemsForSale, courseFeed;

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
    .where('course_id', req.params.course_id)
    .whereNull('deleted_at');

  const getAvgCourseRating = () => knex('course_reviews')
    .where('course_id', req.params.course_id)
    .avg('overall_rating');

  const getCourseFeed = () => knex('course_feed')
    .where('course_id', req.params.course_id)
    .orderBy('created_at', 'desc');

  Promise.all([
    getDocs(),
    getCourseInfo(),
    getCourseUserInfo(),
    getTutorLogInfo(),
    getItemsForSale(),
    getAvgCourseRating(),
    getCourseFeed()
  ])
  .then(results => {
    courseFeed = results[6];
    courseFeed.forEach(feed => feed.editable = feed.commenter_id === user_id);

    let avgRating = results[5][0] ?  Math.round(results[5][0].avg / 5 * 100) : 0;

    itemsForSale = results[4];
    itemsForSale.forEach(item => item.editable = item.owner_id === user_id);

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
  .then(() => res.send({ docs, courseInfo, itemsForSale, courseFeed }))
  .catch(err => {
    console.error('Error inside getCoursePageData.js: ', err);
    res.send(false);
  });

};

module.exports = getCoursePageData;
