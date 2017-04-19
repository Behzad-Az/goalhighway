const deleteResumeReviewRequest = (req, res, knex, user_id) => {

  const deleteRequest = () => knex('resume_review_feed')
    .where('resume_id', req.params.resume_id)
    .andWhere('commenter_id', user_id)
    .del();

  deleteRequest()
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside deleteResumeReviewRequest.js: ', err);
    res.send(false);
  });
};

module.exports = deleteResumeReviewRequest;
