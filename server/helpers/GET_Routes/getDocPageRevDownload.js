const getDocPageRevDownload = (req, res, knex, user_id) => {

  const locateRevision = () => knex('revisions')
    .where('doc_id', req.params.doc_id)
    .andWhere('id', req.params.rev_id)
    .whereNull('deleted_at');

  const insertDownloadLog = downloadLogObj => knex('download_log')
    .insert(downloadLogObj);

  locateRevision()
  .then(revision => {
    if (!revision[0]) {
      throw 'file could not be found in pg db';
    } else {
      res.download(`../../goalhwy_docs/uploads/documents/${revision[0].file_name}`, 'report.pdf', err => {
        if (err) {
          console.error('Error inside getResumeDownload.js: file found in pg db but not located on hard drive');
          res.status(404).end();
        } else {
          insertDownloadLog({
            user_id,
            file_id: revision[0].id,
            file_type: 'revisions'
          })
          .catch(err => console.error('Error inside getDocPageRevDownload.js: unable to insertDownloadLog: ', err));
        }
      });
    }
  })
  .catch(err => {
    console.error('Error inside getReivisionData.js: ', err);
    res.status(404).end();
  });

};

module.exports = getDocPageRevDownload;
