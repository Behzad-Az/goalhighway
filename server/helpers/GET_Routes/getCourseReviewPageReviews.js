const getCourseReviewPageReviews = (req, res, knex, user_id) => {

  const getReviews = () => knex('profs')
    .innerJoin('course_reviews', 'profs.id', 'course_reviews.prof_id')
    .select(
      'course_reviews.course_id', 'course_reviews.created_at', 'course_reviews.fairness_rating', 'course_reviews.id',
      'course_reviews.overall_rating', 'course_reviews.review_desc', 'course_reviews.start_month', 'course_reviews.start_year',
      'course_reviews.workload_rating', 'course_reviews.prof_rating', 'profs.name'
    )
    .where('course_reviews.course_id', req.params.course_id)
    .whereNull('course_reviews.deleted_at')
    .orderBy('course_reviews.created_at', 'desc')
    .limit(10)
    .offset(parseInt(req.query.reviewsoffset));

  getReviews()
  .then(reviews => res.send({ reviews }))
  .catch(err => {
    console.error('Error inside getCourseReviewPageReviews.js: ', err);
    res.send(false);
  });

};

module.exports = getCourseReviewPageReviews;
