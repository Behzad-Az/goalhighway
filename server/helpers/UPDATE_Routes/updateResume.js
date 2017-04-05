const updateResume = (req, res, knex, user_id) => {

  const updatedResumeObj = {
    title: req.body.title || null,
    intent: req.body.intent || 'Generic resume - no specifc intent.',
    resume_deleted_at: JSON.parse(req.body.deleted) ? knex.fn.now() : null
  };

  if (req.file) { updatedResumeObj.file_name = req.file.filename; }

  knex('resumes')
  .where('id', req.params.resume_id)
  .andWhere('user_id', user_id)
  .update(updatedResumeObj)
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside updateResume.js', err);
    res.send(false);
  });
};

module.exports = updateResume;
