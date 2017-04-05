const postNewResume = (req, res, knex, user_id) => {
  const newResumeObj = {
    title: req.body.title || null,
    intent: req.body.intent || 'Generic resume - no specifc intent.',
    file_name: req.file.filename || null,
    user_id
  };

  knex('resumes')
  .insert(newResumeObj)
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewRevision.js', err);
    res.send(false);
  });
};

module.exports = postNewResume;
