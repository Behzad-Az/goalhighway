const postNewResume = (req, res, knex, user_id) => {

  knex('resumes')
  .insert({
    title: req.body.title.trim() || null,
    intent: req.body.intent.trim() || 'Generic resume - no specifc intent.',
    file_name: req.file.filename || null,
    audience_filter_id: req.session.inst_prog_id,
    audience_filter_id: req.session.inst_prog_id,
    audience_filter_table: 'institution_program',
    owner_id: user_id
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewResume.js', err);
    res.send(false);
  });

};

module.exports = postNewResume;
