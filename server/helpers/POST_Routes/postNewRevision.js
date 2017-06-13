const postNewRevision = (req, res, knex, user_id, esClient) => {

  const title = req.body.title.trim();
  const rev_desc = req.body.revDesc.trim();
  const type = req.body.type;
  const course_id = req.params.course_id;
  const doc_id = req.params.doc_id;

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      title.length >= 3 && title.length <= 60 &&
      title.search(/[^a-zA-Z0-9\ \#\&\*\(\)\_\-\\/\\~\:\"\'\,\.\[\]\|]/) == -1 &&
      rev_desc.length >= 3 && rev_desc.length <= 250 &&
      rev_desc.search(/[^a-zA-Z0-9\ \#\&\*\(\)\_\-\\/\\~\:\"\'\,\.\[\]\|]/) == -1 &&
      ['asg_report', 'lecture_note', 'sample_question'].includes(type) &&
      course_id &&
      doc_id
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const determineFileName = () => new Promise((resolve, reject) => {
    if (req.file && req.file.filename) {
      resolve(req.file.filename);
    } else {
      knex('revisions').where('doc_id', doc_id).orderBy('created_at', 'desc').limit(1)
      .then(lastRevision => resolve(lastRevision[0].file_name))
      .catch(err => reject('could not find the file_name for last revision: ', err));
    }
  });

  const determineCategory = type => {
    let output;
    switch (type) {
      case 'asg_report':
        output = 'revised_asg_report';
        break;
      case 'lecture_note':
        output = 'revised_lecture_note';
        break;
      case 'sample_question':
        output = 'revised_sample_question';
        break;
      default:
        output = 'revised_document';
        break;
    }
    return output;
  }

  const updateElasticSearch = () => {
    let kind;
    const indexObj = {
      update: {
        _index: 'GoalHwyEsDb',
        _type: 'document',
        _id: doc_id
      }
    };
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
        title,
        kind
      }
    };
    return esClient.bulk({ body: [indexObj, bodyObj] });
  };

  const updateDoc = (updatedDocObj, trx) => knex('docs')
    .transacting(trx)
    .where('id', doc_id)
    .andWhere('course_id', course_id)
    .whereNull('deleted_at')
    .update(updatedDocObj);

  const insertNewRevision = (newRevObj, trx) => knex('revisions')
    .transacting(trx)
    .insert(newRevObj)
    .returning('id');

  const adminAddToCourseFeed = (adminFeedObj, trx) => knex('course_feed')
    .transacting(trx)
    .insert(adminFeedObj);

  knex.transaction(trx => {
    validateInputs()
    .then(() => determineFileName())
    .then(file_name => {
      let newRevObj = {
        title,
        type,
        rev_desc,
        doc_id,
        poster_id: user_id,
        file_name
      };
      let updatedDocObj = {
        latest_type: type,
        latest_title: title,
        latest_rev_desc: rev_desc,
        latest_file_name: file_name,
        rev_count: knex.raw('rev_count + 1'),
        updated_at: knex.fn.now()
      };
      return Promise.all([ insertNewRevision(newRevObj, trx), updateDoc(updatedDocObj, trx) ]);
    })
    .then(results => {
      let adminFeedObj = {
        commenter_id: user_id,
        course_id,
        doc_id,
        rev_id: results[0][0],
        category: determineCategory(type),
        anonymous: true,
        header: title,
        content: rev_desc
      };
      return adminAddToCourseFeed(adminFeedObj, trx);
    })
    .then(() => updateElasticSearch())
    .then(response => {
      let errorCount = response.items.reduce((count, item) => item.index && item.index.error ? 1 : 0, 0);
      if (errorCount) { throw 'Could not update elastic search db'; }
      else { trx.commit(); }
    })
    .catch(err => {
      console.error('Error inside postNewRevision.js', err);
      trx.rollback();
    });
  })
  .then(() => res.send(true))
  .catch(() => res.send(false));

};

module.exports = postNewRevision;
