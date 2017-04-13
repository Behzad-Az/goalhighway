postNewResumeReviewFeed = (req, res, knex, user_id) => {

  const newResumeFeedObj = {
    owner_id: user_id,
    owner_name: req.session.username,
    title: req.body.title,
    additional_info: req.body.additionalInfo,
    resume_id: req.params.resume_id,
    audience_filter_id: req.session.inst_prog_id,
    audience_filter_table: 'institution_program'
  };

  const authenticateRequest = () => knex('resumes')
    .where('id', req.params.resume_id)
    .andWhere('user_id', user_id)
    .whereNull('deleted_at')
    .count('id as auth');

  const checkForDuplicates = () => knex('resume_review_feed')
    .where('resume_id', req.params.resume_id)
    .andWhere('owner_id', user_id)
    .whereNull('deleted_at')
    .count('id as duplicate');

  const postNewResumeFeed = () => knex('resume_review_feed').insert(newResumeFeedObj);

  Promise.all([
    authenticateRequest(),
    checkForDuplicates()
  ])
  .then(validations => {
    if (parseInt(validations[0][0].auth) && !parseInt(validations[1][0].duplicate)) {
      return postNewResumeFeed();
    } else {
      throw 'Unauthorized user or duplicate request.';
    }
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewResumeReviewFeed.js: ', err);
    res.send(false);
  });

};

module.exports = postNewResumeReviewFeed;
