const getDocPageRevs = (req, res, knex, user_id) => {

  const validateParams = () => knex('docs')
    .where('id', req.params.doc_id)
    .andWhere('course_id', req.params.course_id)
    .whereNull('deleted_at')
    .limit(1)
    .count('id as valid');

  const getRevisions = () => knex('revisions')
    .select('id', 'created_at', 'rev_desc', 'poster_id', 'title')
    .where('doc_id', req.params.doc_id)
    .whereNull('deleted_at')
    .orderBy('created_at', 'desc')
    .limit(10)
    .offset(parseInt(req.query.revsOffset));

  validateParams()
  .then(result => {
    if (parseInt(result[0].valid)) { return getRevisions(); }
    else { throw 'Invalid params.'; }
  })
  .then(revs => {
    revs.forEach(rev => rev.editable = rev.poster_id === user_id);
    res.send({ revs });
  })
  .catch(err => {
    console.error('Error inside getDocPageRevs.js: ', err);
    res.send(false);
  });

};

module.exports = getDocPageRevs;
