const updateResume = (req, res, knex, user_id) => {

  const title = req.body.title.trim();
  const intent = req.body.intent.trim();

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      title.length >= 3 && title.length <= 60 &&
      title.search(/[^a-zA-Z0-9\ \#\&\*\(\)\_\-\\/\\~\:\"\'\,\.\[\]\|]/) == -1 &&
      intent.length >= 3 && intent.length <= 250 &&
      intent.search(/[^a-zA-Z0-9\ \#\&\*\(\)\_\-\\/\\~\:\"\'\,\.\[\]\|]/) == -1 &&
      req.session.inst_prog_id &&
      req.params.resume_id
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

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

  validateInputs()
  .then(() => determineFileName())
  .then(file_name => updateResumeDb({
    title,
    intent,
    file_name,
    audience_filter_id: req.session.inst_prog_id
  }))
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside updateResume.js: ', err);
    res.send(false);
  });

};

module.exports = updateResume;
