const getRevisionData = (req, res, knex) => {
  knex('revisions').where('doc_id', req.params.doc_id).andWhere('id', req.params.rev_id)
  .then(revision => {
    if (!revision[0]) {
      throw 'file could not be found';
    } else {
      const fileName = revision[0].file_name;
      const downloadPath = './uploads/' + fileName;
      res.download(downloadPath, 'report.pdf');
    }
  })
  .catch(err => {
    console.error('Error inside getReivisionData.js: ', err);
    res.download('no_file_could_be_found');
  });

};

module.exports = getRevisionData;
