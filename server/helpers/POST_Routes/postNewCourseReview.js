const postNewCourseReview = (req, res, knex, user_id) => {

  const getInstId = () => knex('courses')
    .select('inst_id')
    .where('id', req.params.course_id);

  const getProfId = () => knex('profs')
    .select('id')
    .where('name', req.body.profName || 'unknown');

  const createNewProf = (newProfObj, trx) => knex('profs')
    .transacting(trx)
    .insert(newProfObj)
    .returning('id');

  const createNewCourseReview = (newCourseReviewObj, trx) => knex('course_reviews')
    .transacting(trx)
    .insert(newCourseReviewObj);

  knex.transaction(trx => {
    Promise.all([
      getInstId(),
      getProfId()
    ])
    .then(results => {
      if (results[0][0]) { return results[1][0] ? [results[1][0].id] : createNewProf({ inst_id: results[0][0].inst_id, name: req.body.profName }, trx); }
      else { throw 'Could not find valid inst_id'; }
    })
    .then(profId => {
      let courseReviewObj = {
        course_id: req.params.course_id,
        reviewer_id: user_id,
        prof_id: profId[0],
        start_year: req.body.startYear,
        start_month: req.body.startMonth,
        workload_rating: req.body.workloadRating,
        fairness_rating: req.body.fairnessRating,
        prof_rating: req.body.profRating,
        overall_rating: req.body.overallRating,
        review_desc: req.body.reviewDesc,
      };
      return createNewCourseReview(courseReviewObj, trx);
    })
    .then(() => trx.commit())
    .catch(err => {
      trx.rollback();
      throw err;
    });
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewCourseReview.js', err);
    res.send(false);
  });

};

module.exports = postNewCourseReview;
