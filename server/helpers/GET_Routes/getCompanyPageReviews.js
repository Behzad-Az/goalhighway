const getCompanyPageReviews = (req, res, knex, user_id) => {

  const getReviews = () => knex('company_reviews')
    .select(
      'id', 'position', 'position_type', 'reviewer_background', 'start_year', 'start_month',
      'work_duration', 'training_rating', 'relevancy_rating', 'pay_rating', 'overall_rating',
      'pros', 'cons', 'created_at'
    )
    .where('company_id', req.params.company_id)
    .whereNull('deleted_at')
    .orderBy('created_at', 'desc')
    .limit(5)
    .offset(parseInt(req.query.reviewsoffset));

  getReviews()
  .then(reviews => res.send({ reviews }))
  .catch(err => {
    console.error('Error inside getCompanyPageReviews.js: ', err);
    res.send(false);
  });

};

module.exports = getCompanyPageReviews;
