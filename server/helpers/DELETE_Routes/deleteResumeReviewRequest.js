const deleteResumeReviewRequest = (req, res, knex, user_id) => {
  const cancelRequest = () => knex('feed')
    .where('type', 'resume_review_request')
    .andWhere('ref_id', req.params.resume_id)
    .andWhere('ref_table', 'resumes')
    .andWhere('commenter_id', user_id)
    .update({ feed_deleted_at: knex.fn.now() });

  cancelRequest()
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside deleteResumeReviewRequest.js: ', err);
    res.send(false);
  });
};

module.exports = deleteResumeReviewRequest;
