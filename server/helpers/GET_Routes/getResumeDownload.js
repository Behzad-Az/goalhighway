const getResumeDownload = (req, res, knex, user_id) => {

  const locateResume = () => knex('resumes')
    .where('id', req.params.resume_id)
    .whereNull('deleted_at')
    .where(function() {
      this.whereNot('review_requested_at', null).orWhere('owner_id', user_id)
    });

  const insertDownloadLog = downloadLogObj => knex('download_log')
    .insert(downloadLogObj);

  locateResume()
  .then(resume => {
    if (!resume[0]) {
      throw 'file could not be found in pg db';
    } else {
      res.download(`../../goalhwy_docs/uploads/resumes/${resume[0].file_name}`, 'resume.pdf', err => {
        if (err) {
          console.error('Error inside getResumeDownload.js: file found in pg db but not located on hard drive');
          res.status(404).end();
        } else {
          insertDownloadLog({
            user_id,
            file_id: resume[0].id,
            file_type: 'resumes'
          })
          .catch(err => console.error('Error inside getResumeDownload.js: unable to insertDownloadLog: ', err));
        }
      });
    }
  })
  .catch(err => {
    console.error('Error inside getResumeDownload.js: ', err);
    res.status(404).end();
  });

};

module.exports = getResumeDownload;
