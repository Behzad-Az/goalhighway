const deleteResume = (req, res, knex, user_id) => {

  const updateResumeDb = trx => knex('resumes')
    .transacting(trx)
    .where('id', req.params.resume_id)
    .andWhere('owner_id', user_id)
    .update({ deleted_at: knex.fn.now() });

  const deleteResumeFeed = trx => knex('resume_review_feed')
    .transacting(trx)
    .where('resume_id', req.params.resume_id)
    .andWhere('commenter_id', user_id)
    .del();

  knex.transaction(trx => {
    Promise.all([
      deleteResumeFeed(trx),
      updateResumeDb(trx)
    ])
    .then(() => trx.commit())
    .catch(err => {
      trx.rollback();
      throw err;
    });
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside deleteResume.js', err);
    res.send(false);
  });

};

module.exports = deleteResume;
