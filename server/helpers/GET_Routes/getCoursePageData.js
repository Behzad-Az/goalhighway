const getCoursePageData = (req, res, knex, user_id) => {

  const getCourseInfo = () => knex('courses')
    .innerJoin('institutions', 'inst_id', 'institutions.id')
    .select('inst_display_name', 'short_display_name', 'full_display_name', 'course_desc', 'inst_id', 'courses.id')
    .where('courses.id', req.params.course_id)
    .whereNull('courses.deleted_at')
    .limit(1);

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
    .whereNull('closed_at')
    .limit(1);

  const getItemsForSale = () => knex('items_for_sale')
    .select('id', 'owner_id', 'course_id', 'price', 'photo_name', 'title', 'item_desc', 'created_at')
    .where('course_id', req.params.course_id)
    .whereNull('deleted_at');

  const getAvgCourseRating = () => knex('course_reviews')
    .where('course_id', req.params.course_id)
    .whereNull('deleted_at')
    .avg('overall_rating');

  Promise.all([
    getCourseInfo(),
    getCourseUserInfo(),
    getTutorLogInfo(),
    getItemsForSale(),
    getAvgCourseRating()
  ])
  .then(results => {
    let courseInfo = results[0][0];
    let userInfo = results[1][0];
    let latestTutorLog = results[2][0];
    let itemsForSale = results[3].map(item => {
      item.editable = item.owner_id === user_id;
      return item;
    });

    courseInfo.subscriptionStatus = userInfo.sub_date;
    courseInfo.tutorStatus = userInfo.tutor_status;
    courseInfo.assistReqOpen = latestTutorLog;
    courseInfo.latestAssistRequest = latestTutorLog ? latestTutorLog.issue_desc : '';
    courseInfo.avgRating = results[4][0] ?  Math.round(results[4][0].avg / 5 * 100) : 0;

    res.send({ courseInfo, itemsForSale });
  })
  .catch(err => {
    console.error('Error inside getCoursePageData.js: ', err);
    res.send(false);
  });

};

module.exports = getCoursePageData;
