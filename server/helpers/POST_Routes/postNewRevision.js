const uploadDocToDb = require('../Multipurpose/uploadDocToDb.js');

const postNewRevision = (req, res, knex, user_id, esClient) => {

  const determineFilePath = () => new Promise((resolve, reject) => {
    if (req.body.file_path) {
      resolve(uploadDocToDb(knex, req.body.filePath));
    } else {
      knex('revisions').where('doc_id', req.params.doc_id).orderBy('rev_created_at', 'desc').limit(1).then(lastRevision => {
        resolve(lastRevision[0].file_path);
      }).catch(err => {
        reject("could not find the file_path for last revision");
      });
    }
  });

  const updateElasticSearch = () => {
    const indexObj = {
      update: {
        _index: 'search_catalogue',
        _type: 'document',
        _id: req.params.doc_id
      }
    };

    let kind;
    switch (req.body.type) {
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
        "title": req.body.title,
        "kind": kind
      }
    };
    return esClient.bulk({ body: [indexObj, bodyObj] });
  };

  const insertNewRevision = (newRevObj, trx) => knex('revisions').transacting(trx).insert(newRevObj);

  const adminAddToCourseFeed = (adminFeedObj, trx) => knex('course_feed').transacting(trx).insert(adminFeedObj);

  determineFilePath().then(filePath => {
    let newRevObj = {
      title: req.body.title,
      type: req.body.type,
      rev_desc: req.body.revDesc,
      doc_id: req.params.doc_id,
      user_id: user_id,
      file_path: filePath
    };
    knex.transaction(trx => {
      insertNewRevision(newRevObj, trx)
      .then(() => {
        let adminFeedObj = {
          user_id: 2,
          course_id: req.params.course_id,
          doc_id: req.params.doc_id,
          category: req.body.type,
          commenter_name: "goal_robot",
          content: `I just revised a document - ${req.body.title} - ${req.body.revDesc}`
        };
        return Promise.all([ adminAddToCourseFeed(adminFeedObj, trx), updateElasticSearch() ]);
      }).then(() => {
        trx.commit();
      }).catch(err => {
        trx.rollback();
        throw err;
      });
    }).then(() => {
      res.send(true);
    }).catch(err => {
      console.error("Error inside postNewRevision.js: ", err);
      res.send(false);
    });
  }).catch(err => {
    console.error("Error inside postNewRevision.js: ", err);
    res.send(false);
  });

};

module.exports = postNewRevision;
