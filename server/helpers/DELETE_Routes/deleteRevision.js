const deleteRevision = (req, res, knex, user_id, esClient) => {
  const course_id = req.params.course_id;
  const doc_id = req.params.doc_id;
  const rev_id = req.params.rev_id;
  let url;

  const deleteRev = trx => knex('revisions')
    .transacting(trx)
    .where('id', rev_id)
    .andWhere('poster_id', user_id)
    .andWhere('doc_id', doc_id)
    .whereNull('deleted_at')
    .update({ deleted_at: knex.fn.now() });

  const updateDoc = (updatedDocObj, trx) => knex('docs')
    .transacting(trx)
    .where('id', doc_id)
    .andWhere('course_id', course_id)
    .whereNull('deleted_at')
    .update(updatedDocObj);

  const getDocRevs = trx => knex('revisions')
    .transacting(trx)
    .select('id', 'title', 'type', 'rev_desc', 'file_name', 'created_at')
    .where('doc_id', doc_id)
    .whereNull('deleted_at')
    .orderBy('created_at', 'desc')
    .limit(2);

  const deleteCourseFeed = trx => knex('course_feed')
    .transacting(trx)
    .andWhere('course_id', course_id)
    .andWhere('doc_id', doc_id)
    .andWhere('rev_id', rev_id)
    .andWhere('commenter_id', user_id)
    .del();

  const deleteElasticDoc = () => esClient.bulk({
    body: [{ delete: { _index: 'goalhwy_es_db', _type: 'document', _id: doc_id } }]
  });

  const updateElasticSearch = (title, kind) => {
    const indexObj = {
      update: {
        _index: 'goalhwy_es_db',
        _type: 'document',
        _id: doc_id
      }
    };

    switch (kind) {
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
        title,
        kind
      }
    };

    return esClient.bulk({ body: [indexObj, bodyObj] });
  };

  knex.transaction(trx => {
    getDocRevs(trx)
    .then(revs => {
      if (revs[0].id == rev_id && revs[1]) {
        url = `/courses/${course_id}/docs/${doc_id}`;
        const latest_title = revs[1].title;
        const latest_type = revs[1].type;
        const updatedDocObj = {
          latest_title,
          latest_type,
          latest_rev_desc: revs[1].rev_desc,
          latest_file_name: revs[1].file_name,
          rev_count: knex.raw('rev_count - 1'),
          updated_at: revs[1].created_at
        };
        return Promise.all([
          deleteRev(trx),
          updateElasticSearch(latest_title, latest_type),
          updateDoc(updatedDocObj, trx),
          deleteCourseFeed(trx)
        ]);
      } else if (revs[0].id == rev_id && !revs[1]) {
        url = `/courses/${course_id}`;
        return Promise.all([
          updateDoc({ deleted_at: knex.fn.now() }, trx),
          deleteElasticDoc()
        ]);
      } else {
        url = `/courses/${course_id}/docs/${doc_id}`;
        return Promise.all([
          deleteRev(trx),
          updateDoc({ rev_count: knex.raw('rev_count - 1') }, trx),
          deleteCourseFeed(trx)
        ]);
      }
    })
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
