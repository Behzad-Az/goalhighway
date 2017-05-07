const deleteRevision = (req, res, knex, user_id, esClient) => {
  let course_id = req.params.course_id;
  let doc_id = req.params.doc_id;
  let rev_id = req.params.rev_id;
  let url;

  const deleteRev = trx => knex('revisions')
    .transacting(trx)
    .where('id', rev_id)
    .andWhere('poster_id', user_id)
    .andWhere('doc_id', doc_id)
    .whereNull('deleted_at')
    .update({ deleted_at: knex.fn.now() });

  const deleteDoc = trx => knex('docs')
    .transacting(trx)
    .where('id', doc_id)
    .andWhere('course_id', course_id)
    .update({ deleted_at: knex.fn.now() });

  const getRemainingRevCount = trx => knex('revisions')
    .transacting(trx)
    .where('doc_id', doc_id)
    .whereNull('deleted_at')
    .count('id');

  const getDocRevs = trx => knex('revisions')
    .transacting(trx)
    .select('id', 'title', 'type')
    .where('doc_id', doc_id)
    .whereNull('deleted_at')
    .orderBy('created_at', 'desc');

  const deleteCourseFeed = trx => knex('course_feed')
    .transacting(trx)
    .andWhere('course_id', course_id)
    .andWhere('doc_id', doc_id)
    .andWhere('rev_id', rev_id)
    .andWhere('commenter_id', user_id)
    .del();

  const deleteElasticDoc = () => esClient.bulk({
    body: [{ delete: { _index: 'search_catalogue', _type: 'document', _id: doc_id } }]
  });

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
      case 'asg_report':
        kind = 'assignment assingments report reports';
        break;
      case 'lecture_note':
        kind = 'lecture lectures note notes';
        break;
      case 'sample_question':
        kind = 'sample question questions quiz quizzes exam exams final finals midterm midterms';
        break;
      default:
        kind = 'other_kind_not_specified';
        break;
    };

    const bodyObj = {
      doc: {
        'title': title,
        'kind': kind
      }
    };
    return esClient.bulk({ body: [indexObj, bodyObj] });
  };

  knex.transaction(trx => {
    getDocRevs(trx)
    .then(revs => revs[0].id == rev_id && revs[1] ? Promise.all([ deleteRev(trx), updateElasticSearch(revs[1].title, revs[1].type), deleteCourseFeed(trx) ]) : Promise.all([ deleteRev(trx), deleteCourseFeed(trx) ]))
    .then(() => getRemainingRevCount(trx))
    .then(revCount => parseInt(revCount[0].count) ? 'no_need_to_delete_doc' : Promise.all([ deleteDoc(trx), deleteElasticDoc() ]))
    .then(deleted => url = deleted === 'no_need_to_delete_doc' ? `/courses/${course_id}/docs/${doc_id}` : `/courses/${course_id}`)
    .then(() => trx.commit())
    .catch(err => {
      console.error('Error inside deleteRevision.js', err);
      trx.rollback();
    });
  })
  .then(() => res.send({ url }))
  .catch(err => res.send(false));

};

module.exports = deleteRevision;
