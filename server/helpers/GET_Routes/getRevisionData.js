const getRevisionData = (req, res, knex) => {
  knex('revisions').where('doc_id', req.params.doc_id).andWhere('id', req.params.rev_id).then((revision) => {
    res.send(revision);
  }).catch((err) => {
    console.error(err);
    res.send(false);
  });
};

module.exports = getRevisionData;
