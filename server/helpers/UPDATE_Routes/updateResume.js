const updateResume = (req, res, knex, user_id) => {

  const determineFileName = () => new Promise((resolve, reject) => {
    if (req.file && req.file.filename) {
      resolve(req.file.filename);
    } else {
      knex('resumes').where('id', req.params.resume_id).andWhere('owner_id', user_id).select('file_name')
      .then(resume => resolve(resume[0].file_name))
      .catch(err => reject('could not find the file_name for resume: ', err));
    }
  });

  const updateResumeDb = resumeObj => knex('resumes')
    .where('id', req.params.resume_id)
    .andWhere('owner_id', user_id)
    .whereNull('deleted_at')
    .update(resumeObj);

  determineFileName()
  .then(file_name => updateResumeDb({
    title: req.body.title.trim() || null,
    intent: req.body.intent.trim() || 'Generic resume - no specifc intent.',
    file_name,
    audience_filter_id: req.session.inst_prog_id,
    audience_filter_id: req.session.inst_prog_id,
    audience_filter_table: 'institution_program',
    owner_id: user_id
  }))
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside updateResume.js', err);
    res.send(false);
  });

};

module.exports = updateResume;
