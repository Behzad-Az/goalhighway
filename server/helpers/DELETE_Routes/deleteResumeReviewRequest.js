const deleteResumeReviewRequest = (req, res, knex, user_id) => {

  const updateResumeDb = () => knex('resumes')
    .where('id', req.params.resume_id)
    .andWhere('owner_id', user_id)
    .whereNotNull('review_requested_at')
    .whereNull('deleted_at')
    .update({ review_requested_at: null });

  updateResumeDb()
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside deleteResumeReviewRequest.js: ', err);
    res.send(false);
  });
};

module.exports = deleteResumeReviewRequest;
