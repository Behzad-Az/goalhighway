const postNewResumeReviewFeed = (req, res, knex, user_id) => {

  const validateInputs = () => new Promise((resolve, reject) => {
    req.params.resume_id ? resolve() : reject('Invalid form entries');
  });

  const updateResumeDb = () => knex('resumes')
    .where('id', req.params.resume_id)
    .andWhere('owner_id', user_id)
    .whereNull('review_requested_at')
    .whereNull('deleted_at')
    .update({
      review_requested_at: knex.fn.now(),
      audience_filter_id: req.session.inst_prog_id
    });

  validateInputs()
  .then(() => updateResumeDb())
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewResumeReviewFeed.js: ', err);
    res.send(false);
  });

};

module.exports = postNewResumeReviewFeed;
