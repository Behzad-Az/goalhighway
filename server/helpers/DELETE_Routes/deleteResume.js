const deleteResume = (req, res, knex, user_id) => {

  updateResumeDb = () => knex('resumes')
    .where('id', req.params.resume_id)
    .andWhere('user_id', user_id)
    .update({ resume_deleted_at: knex.fn.now() });

  knex('resumes').where('id', req.params.resume_id).andWhere('user_id', user_id)
  .update({ resume_deleted_at: knex.fn.now() })
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside deleteResume.js: ', err);
    res.send(false);
  });
};

module.exports = deleteResume;
