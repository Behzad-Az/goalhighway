const postNewDoc = (req, res, knex, user_id, esClient, randIdString) => {

  const title = req.body.title.trim();
  const rev_desc = req.body.revDesc.trim();
  const type = req.body.type;
  const course_id = req.params.course_id;
  const file_name = req.file.filename;
  let doc_id;

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      title.length >= 3 && title.length <= 60 &&
      title.search(/[^a-zA-Z0-9\ \#\&\*\(\)\_\-\\/\\~\:\"\'\,\.\[\]\|]/) == -1 &&
      rev_desc.length >= 3 && rev_desc.length <= 250 &&
      rev_desc.search(/[^a-zA-Z0-9\ \#\&\*\(\)\_\-\\/\\~\:\"\'\,\.\[\]\|]/) == -1 &&
      ['asg_report', 'lecture_note', 'sample_question'].includes(type) &&
      file_name &&
      course_id
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const insertNewDoc = (newDocObj, trx) => knex('docs')
    .transacting(trx)
    .insert(newDocObj)
    .returning('id');

  const insertNewRev = (newRevObj, trx) =>  knex('revisions')
    .transacting(trx)
    .insert(newRevObj)
    .returning('id');

  const adminAddToCourseFeed = (adminFeedObj, trx) => knex('course_feed')
    .transacting(trx)
    .insert(adminFeedObj);

  const getSearchData = () => knex('courses')
    .innerJoin('institutions', 'inst_id', 'institutions.id')
    .select('institutions.id', 'institutions.inst_display_name', 'courses.short_display_name')
    .where('courses.id', course_id);

  const determineCategory = type => {
    let output;
    switch (type) {
      case 'asg_report':
        output = 'new_asg_report';
        break;
      case 'lecture_note':
        output = 'new_lecture_note';
        break;
      case 'sample_question':
        output = 'new_sample_question';
        break;
      default:
        output = 'new_document';
        break;
    }
    return output;
  }

  const addDocToElasticSearch = esDocObj => {
    const indexObj = {
      index: {
        _index: 'goalhwy_es_db',
        _type: 'document',
        _id: doc_id
      }
    };
    switch (esDocObj.kind) {
      case 'asg_report':
        esDocObj.kind = 'assignment assingments report reports';
        break;
      case 'lecture_note':
        esDocObj.kind = 'lecture lectures note notes';
        break;
      case 'sample_question':
        esDocObj.kind = 'sample question questions quiz quizzes exam exams final finals midterm midterms';
        break;
      default:
        esDocObj.kind = 'other_kind_not_specified';
        break;
    };
    return esClient.bulk({ body: [indexObj, esDocObj] });
  };

  knex.transaction(trx => {
    validateInputs()
    .then(() => {
      const newDocObj = {
        id: randIdString(11),
        course_id,
        latest_type: type,
        latest_title: title,
        latest_file_name: file_name,
        latest_rev_desc: rev_desc
      };
      return insertNewDoc(newDocObj, trx);
    })
    .then(docId => {
      doc_id = docId[0];
      const newRevObj = {
        id: randIdString(11),
        title,
        type,
        rev_desc,
        file_name,
        doc_id,
        poster_id: user_id
      };
      return insertNewRev(newRevObj, trx);
    })
    .then(revId => {
      const adminFeedObj = {
        id: randIdString(11),
        commenter_id: user_id,
        course_id,
        doc_id,
        rev_id: revId[0],
        category: determineCategory(type),
        anonymous: true,
        header: title,
        content: 'New document received.'
      };
      return adminAddToCourseFeed(adminFeedObj, trx);
    })
    .then(() => getSearchData())
    .then(searchData => addDocToElasticSearch({
      title,
      kind: type,
      course_id,
      doc_id,
      course_name: searchData[0].short_display_name,
      inst_id: searchData[0].id,
      inst_name: searchData[0].inst_display_name
    }))
    .then(response => {
      let errorCount = response.items.reduce((count, item) => item.index && item.index.error ? 1 : 0, 0);
      if (errorCount) { throw 'Could not upload to elastic search db'; }
      else { trx.commit(); }
    })
    .catch(err => {
      console.error('Error inside postNewDoc.js:', err);
      trx.rollback();
    });
  })
  .then(() => res.send(true))
  .catch(() => res.send(false));

};

module.exports = postNewDoc;
