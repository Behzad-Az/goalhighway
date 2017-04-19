const deleteResume = (req, res, knex, user_id) => {

  const updateResumeDb = () => knex('resumes')
    .where('id', req.params.resume_id)
    .andWhere('owner_id', user_id)
    .whereNull('deleted_at')
    .update({
      deleted_at: knex.fn.now(),
      review_requested_at: null
    });

  updateResumeDb()
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside deleteResume.js', err);
    res.send(false);
  });

};

module.exports = deleteResume;
