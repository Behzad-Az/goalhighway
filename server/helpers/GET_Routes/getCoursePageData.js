const getCoursePageData = (req, res, knex, user_id) => {

  let docs, courseInfo, itemsForSale;

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
    .andWhere('course_id', req.params.course_id)
    .whereNull('unsub_date')
    .whereNull('unsub_reason')
    .orderBy('sub_date')
    .limit(1);

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

  const getLikeCount = (item, tableName) => knex('user_likes')
      .where('foreign_table', tableName)
      .andWhere('foreign_id', item.id)
      .sum('like_or_dislike as likeCount');

  const getAlreadyLiked = (item, tableName) => knex('user_likes')
      .where('foreign_table', tableName)
      .andWhere('foreign_id', item.id)
      .andWhere('user_id', user_id)
      .sum('like_or_dislike as likeCount');

  const getLikesInfo = (item, tableName) => new Promise((resolve, reject) => {
    Promise.all([ getLikeCount(item, tableName), getAlreadyLiked(item, tableName) ])
    .then(results => {
      item.likeCount = results[0][0].likeCount ? parseInt(results[0][0].likeCount) : 0;
      item.alreadyLiked = results[1][0].likeCount ? parseInt(results[1][0].likeCount) : 0;
      resolve();
    })
    .catch(err => reject(err));
  });

  Promise.all([
    getDocs(),
    getCourseInfo(),
    getCourseUserInfo(),
    getTutorLogInfo(),
    getItemsForSale(),
    getAvgCourseRating()
  ])
  .then(results => {
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
      promiseArr.push(getLikesInfo(doc, 'docs'));
    });

    return Promise.all(promiseArr);
  })
  .then(() => res.send({ docs, courseInfo, itemsForSale }))
  .catch(err => {
    console.error('Error inside getCoursePageData.js: ', err);
    res.send(false);
  });

};

module.exports = getCoursePageData;
