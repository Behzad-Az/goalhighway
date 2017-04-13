const deleteResumeReviewRequest = (req, res, knex, user_id) => {

  const cancelRequest = () => knex('resume_review_feed')
    .where('resume_id', req.params.resume_id)
    .andWhere('owner_id', user_id)
    .update({ deleted_at: knex.fn.now() });

  cancelRequest()
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside deleteResumeReviewRequest.js: ', err);
    res.send(false);
  });
};

module.exports = deleteResumeReviewRequest;
