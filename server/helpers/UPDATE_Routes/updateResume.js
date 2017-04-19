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

  const updateResumeDb = (resumeObj, trx) => knex('resumes')
    .transacting(trx)
    .where('id', req.params.resume_id)
    .andWhere('owner_id', user_id)
    .update(resumeObj);

  const updateReusmeFeed = (resumeFeedObj, trx) => knex('resume_review_feed')
    .transacting(trx)
    .where('resume_id', req.params.resume_id)
    .andWhere('commenter_id', user_id)
    .update(resumeFeedObj);

  knex.transaction(trx => {
    determineFileName()
    .then(file_name => {
      let resumeObj = {
        title: req.body.title.trim() || null,
        intent: req.body.intent.trim() || 'Generic resume - no specifc intent.',
        file_name
      };
      let resumeFeedObj = {
        commenter_name: req.session.username,
        title: req.body.title.trim() || null,
        additional_info: req.body.intent.trim() || 'Generic resume - no specifc intent.',
        audience_filter_id: req.session.inst_prog_id
      };
      return Promise.all([ updateResumeDb(resumeObj, trx), updateReusmeFeed(resumeFeedObj, trx) ]);
    })
    .then(() => trx.commit())
    .catch(err => {
      trx.rollback();
      throw err;
    });
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside updateResume.js', err);
    res.send(false);
  });

};

module.exports = updateResume;
