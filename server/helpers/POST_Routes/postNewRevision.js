const postNewRevision = (req, res, knex, user_id, esClient) => {

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      ['asg_report', 'lecture_note', 'sample_question'].includes(req.body.type) &&
      req.body.title.trim().length <= 60 &&
      req.body.revDesc.trim().length <= 250
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
      knex('revisions').where('doc_id', req.params.doc_id).orderBy('created_at', 'desc').limit(1)
      .then(lastRevision => resolve(lastRevision[0].file_name))
      .catch(err => reject('could not find the file_name for last revision: ', err));
    }
  });

  const determineCategory = type => {
    let output;
    switch(type) {
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
        _index: 'search_catalogue',
        _type: 'document',
        _id: req.params.doc_id
      }
    };
    switch (req.body.type) {
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
        title: req.body.title.trim(),
        kind
      }
    };
    return esClient.bulk({ body: [indexObj, bodyObj] });
  };

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
    .then(fileName => {
      let newRevObj = {
        title: req.body.title.trim(),
        type: req.body.type,
        rev_desc: req.body.revDesc.trim(),
        doc_id: req.params.doc_id,
        poster_id: user_id,
        file_name: fileName
      };
      return insertNewRevision(newRevObj, trx);
    })
    .then(revId => {
      let adminFeedObj = {
        commenter_id: user_id,
        course_id: req.params.course_id,
        doc_id: req.params.doc_id,
        rev_id: revId[0],
        category: determineCategory(req.body.type),
        anonymous: true,
        header: req.body.title.trim(),
        content: req.body.revDesc.trim()
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
