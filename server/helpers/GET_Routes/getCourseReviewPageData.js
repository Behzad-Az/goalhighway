const getCourseReviewPageData = (req, res, knex, user_id) => {

  const getProfs = () => knex('courses')
    .innerJoin('profs', 'courses.inst_id', 'profs.inst_id')
    .select('profs.name')
    .where('courses.id', req.params.course_id);

  const getCourseInfo = () => knex('courses')
    .innerJoin('institutions', 'inst_id', 'institutions.id')
    .select('inst_display_name', 'short_display_name', 'inst_id', 'courses.id')
    .where('courses.id', req.params.course_id)
    .whereNull('courses.deleted_at')
    .whereNull('institutions.deleted_at');

  const getCourseReviews = () => knex('profs')
    .innerJoin('course_reviews', 'profs.id', 'course_reviews.prof_id')
    .select(
      'course_reviews.course_id', 'course_reviews.created_at', 'course_reviews.fairness_rating', 'course_reviews.id',
      'course_reviews.overall_rating', 'course_reviews.review_desc', 'course_reviews.start_month', 'course_reviews.start_year',
      'course_reviews.workload_rating', 'course_reviews.prof_rating', 'profs.name'
    )
    .where('course_reviews.course_id', req.params.course_id)
    .whereNull('course_reviews.deleted_at')
    .orderBy('course_reviews.created_at', 'desc');

  Promise.all([
    getCourseInfo(),
    getCourseReviews(),
    getProfs()
  ])
  .then(results => res.send({ courseInfo: results[0][0], courseReviews: results[1], profs: results[2] }))
  .catch(err => {
    console.error('Error inside getCourseReviewPageData.js: ', err);
    res.send(false);
  });

};

module.exports = getCourseReviewPageData;
