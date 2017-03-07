const deleteRevision = (req, res, knex, user_id, esClient) => {
  let course_id = req.params.course_id;
  let doc_id = req.params.doc_id;
  let rev_id = req.params.rev_id;

  const checkIfAuthorized = () => knex('revisions').where('user_id', user_id).andWhere('id', rev_id).andWhere('id', rev_id).count('id as auth');

  const deleteRev = () => knex('revisions').where('id', rev_id).update({ rev_deleted_at: knex.fn.now() });

  const getRemainingRevCount = () => knex('revisions').where('doc_id', doc_id).whereNull('rev_deleted_at').count('id');

  const getDocRevs = () => knex('revisions').select('id', 'title', 'type').where('doc_id', doc_id).whereNull('rev_deleted_at').orderBy('rev_created_at', 'desc');

  const deleteDoc = () => knex('docs').where('id', doc_id).update({ doc_deleted_at: knex.fn.now() });

  const deleteObj = { delete: { _index: 'search_catalogue', _type: 'document', _id: doc_id } };

  const deleteElasticDoc = () => esClient.bulk({ body: [deleteObj] });

  const updateElasticSearch = (title, type) => {
    const indexObj = {
      update: {
        _index: 'search_catalogue',
        _type: 'document',
        _id: doc_id
      }
    };

    let kind;
    switch (type) {
      case "asg_report":
        kind = "assignment assingments report reports";
        break;
      case "lecture_note":
        kind = "lecture lectures note notes";
        break;
      case "sample_question":
        kind = "sample question questions quiz quizzes exam exams final finals midterm midterms";
        break;
      default:
        kind = "other_kind_not_specified";
        break;
    };

    const bodyObj = {
      doc: {
        "title": title,
        "kind": kind
      }
    };
    return esClient.bulk({ body: [indexObj, bodyObj] });
  };


  checkIfAuthorized()
  .then(auth => {
    if (parseInt(auth[0].auth)) { return getDocRevs(); }
    else { throw "user not authorized to delete revision"; }
  })
  .then(revs => (revs[0].id == rev_id && revs[1]) ? Promise.all([ deleteRev(), updateElasticSearch(revs[1].title, revs[1].type) ]) : deleteRev() )
  .then(() => getRemainingRevCount())
  .then(revCount => parseInt(revCount[0].count) ? "no_need_to_delete_doc" : Promise.all([ deleteDoc(), deleteElasticDoc() ]))
  .then(deleted => deleted === "no_need_to_delete_doc" ? res.send(`/courses/${course_id}/docs/${doc_id}`) : res.send(`/courses/${course_id}`))
  .catch(err => {
    console.error("Error inside deleteRevision: ", err);
    res.send(false);
  });

}

module.exports = deleteRevision;
