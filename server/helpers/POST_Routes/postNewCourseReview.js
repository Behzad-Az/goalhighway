const postNewCourseReview = (req, res, knex, user_id, randIdString) => {

  const profName = req.body.profName.trim() || 'Unknown';
  const review_desc = req.body.reviewDesc.trim() || 'No detail provided.';
  const course_id = req.params.course_id;
  let inst_id;

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      [2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006].includes(parseInt(req.body.startYear)) &&
      ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].includes(req.body.startMonth) &&
      [1, 2, 3].includes(parseInt(req.body.workloadRating)) &&
      [1, 2, 3].includes(parseInt(req.body.fairnessRating)) &&
      [1, 2, 3, 4, 5].includes(parseInt(req.body.profRating)) &&
      [1, 2, 3, 4, 5].includes(parseInt(req.body.overallRating)) &&
      review_desc.length <= 500 &&
      review_desc.search(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/) == -1 &&
      profName.length <= 60 &&
      profName.search(/[^a-zA-Z\ \_\-\'\,\.\`]/) &&
      course_id.length === 11
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const getInstId = trx => knex('courses')
    .transacting(trx)
    .select('inst_id')
    .where('id', course_id)
    .whereNull('deleted_at')
    .limit(1);

  const getProfId = (instId, trx) => knex('profs')
    .transacting(trx)
    .select('id')
    .where('inst_id', instId)
    .andWhere(knex.raw('LOWER("name") = ?', profName.toLowerCase()))
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
    .then(profId => profId[0] ? [profId[0].id] : createNewProf({ id: randIdString(11), inst_id, name: profName }, trx))
    .then(profId => {
      const courseReviewObj = {
        id: randIdString(11),
        course_id,
        reviewer_id: user_id,
        prof_id: profId[0],
        start_year: req.body.startYear,
        start_month: req.body.startMonth.trim(),
        workload_rating: req.body.workloadRating,
        fairness_rating: req.body.fairnessRating,
        prof_rating: req.body.profRating,
        overall_rating: req.body.overallRating,
        review_desc
      };
      return createNewCourseReview(courseReviewObj, trx);
    })
    .then(reviewId => {
      const adminFeedObj = {
        id: randIdString(11),
        commenter_id: user_id,
        course_id,
        course_review_id: reviewId[0],
        category: 'new_course_review',
        header: 'new_course_review',
        anonymous: true,
        content: `Overall Rating: ${req.body.overallRating}/5. - ${review_desc}.`
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
