const postNewCourseReview = (req, res, knex, user_id) => {

  let inst_id;

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      [2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006].includes(parseInt(req.body.startYear)) &&
      ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].includes(req.body.startMonth) &&
      [1, 2, 3].includes(parseInt(req.body.workloadRating)) &&
      [1, 2, 3].includes(parseInt(req.body.fairnessRating)) &&
      [1, 2, 3, 4, 5].includes(parseInt(req.body.profRating)) &&
      [1, 2, 3, 4, 5].includes(parseInt(req.body.overallRating)) &&
      req.body.reviewDesc.trim().length <= 500 &&
      req.body.profName.trim().length <= 60
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const getInstId = trx => knex('courses')
    .transacting(trx)
    .select('inst_id')
    .where('id', req.params.course_id)
    .whereNull('deleted_at')
    .limit(1);

  const getProfId = (instId, trx) => knex('profs')
    .transacting(trx)
    .select('id')
    .where('inst_id', instId)
    .andWhere(knex.raw('LOWER("name") = ?', req.body.profName.trim().toLowerCase() || 'unknown'))
    .whereNull('deleted_at')
    .limit(1);

  const createNewProf = (newProfObj, trx) => knex('profs')
    .transacting(trx)
    .insert(newProfObj)
    .returning('id');

  const createNewCourseReview = (newCourseReviewObj, trx) => knex('course_reviews')
    .transacting(trx)
    .insert(newCourseReviewObj)
    .returning('id');

  const adminAddToCourseFeed = (adminFeedObj, trx) => knex('course_feed')
    .transacting(trx)
    .insert(adminFeedObj);

  knex.transaction(trx => {
    validateInputs()
    .then(() => getInstId(trx))
    .then(instId => {
      inst_id = instId[0].inst_id;
      return getProfId(inst_id, trx);
    })
    .then(profId => profId[0] ? [profId[0].id] : createNewProf({ inst_id, name: req.body.profName.trim() }, trx))
    .then(profId => {
      let courseReviewObj = {
        course_id: req.params.course_id,
        reviewer_id: user_id,
        prof_id: profId[0],
        start_year: req.body.startYear,
        start_month: req.body.startMonth.trim(),
        workload_rating: req.body.workloadRating,
        fairness_rating: req.body.fairnessRating,
        prof_rating: req.body.profRating,
        overall_rating: req.body.overallRating,
        review_desc: req.body.reviewDesc.trim() || 'No detail provided'
      };
      return createNewCourseReview(courseReviewObj, trx);
    })
    .then(reviewId => {
      let adminFeedObj = {
        commenter_id: user_id,
        course_id: req.params.course_id,
        course_review_id: reviewId[0],
        category: 'new_course_review',
        header: 'new_course_review',
        anonymous: true,
        content: `Overall Rating: ${req.body.overallRating}/5.`
      };
      return adminAddToCourseFeed(adminFeedObj, trx);
    })
    .then(() => trx.commit())
    .catch(err => {
      console.error('Error inside postNewCourseReview.js', err);
      trx.rollback();
    });
  })
  .then(() => res.send(true))
  .catch(() => res.send(false));

};

module.exports = postNewCourseReview;
