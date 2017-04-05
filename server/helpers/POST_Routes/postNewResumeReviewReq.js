postNewResumeReviewReq = (req, res, knex, user_id) => {

  const newResumeFeedObj = {
    commenter_id: user_id,
    commenter_name: req.session.username,
    content: `I am requesting a peer review of my resume - '${req.body.resumeTitle}'\n${req.body.additionalInfo}`,
    type: 'resume_review_request',
    discussion_bool: false,
    ref_id: req.params.resume_id,
    ref_table: 'resumes',
    audience_filter_id: req.session.inst_prog_id,
    audience_filter_table: 'institution_program'
  };

  const authenticateRequest = () => knex('resumes')
    .where('id', req.params.resume_id)
    .andWhere('user_id', user_id)
    .whereNull('resume_deleted_at')
    .count('id as auth');

  const checkForDuplicates = () => knex('feed')
    .where('type', 'resume_review_request')
    .andWhere('ref_id', req.params.resume_id)
    .andWhere('ref_table', 'resumes')
    .whereNull('feed_deleted_at')
    .count('id as duplicate');

  const postNewResumeFeed = () => knex('feed').insert(newResumeFeedObj);

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
    console.error('Error inside postNewResumeReviewReq.js: ', err);
    res.send(false);
  });

};

module.exports = postNewResumeReviewReq;
