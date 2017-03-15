const postNewDoc = (req, res, knex, user_id, esClient) => {

  let newDocObj = {
    course_id: req.params.course_id
  };

  let newRevObj = {};

  const insertNewDoc = (newDocObj, trx) => knex('docs').transacting(trx).insert(newDocObj).returning('id');
  const insertNewRev = (newRevObj, trx) =>  knex('revisions').transacting(trx).insert(newRevObj).returning('id');
  const adminAddToCourseFeed = (adminFeedObj, trx) => knex('course_feed').transacting(trx).insert(adminFeedObj);
  const getSearchData = () => knex('courses')
    .innerJoin('institutions', 'inst_id', 'institutions.id')
    .select('institutions.id', 'inst_long_name', 'inst_short_name', 'short_display_name')
    .where('courses.id', newDocObj.course_id);

  const addDocToSearchCatalogue = docInfo => {
    const indexObj = {
      index: {
        _index: 'search_catalogue',
        _type: 'document',
        _id: docInfo.id
      }
    };

    let kind;
    switch (docInfo.type) {
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
      "id": docInfo.id,
      "title": docInfo.title,
      "kind": kind,
      "inst_id": docInfo.inst_id,
      "inst_name": docInfo.inst_name,
      "course_id": docInfo.course_id,
      "course_name": docInfo.course_name,
    };
    return esClient.bulk({ body: [indexObj, bodyObj] })
  };

  knex.transaction(trx => {
    insertNewDoc(newDocObj, trx).then(doc_id => {
      newRevObj = {
        title: req.body.title,
        type: req.body.type,
        rev_desc: req.body.revDesc,
        file_name: req.file.filename,
        doc_id: doc_id[0],
        user_id: user_id
      };
      return insertNewRev(newRevObj, trx);
    }).then(rev_id => {
      let adminFeedObj = {
        user_id: 2,
        course_id: newDocObj.course_id,
        doc_id: newRevObj.doc_id,
        category: newRevObj.type,
        commenter_name: "goal_robot",
        content: `I just got a new document - ${newRevObj.title}`
      };
      return adminAddToCourseFeed(adminFeedObj, trx);
    }).then(() => {
      trx.commit();
    }).catch(err => {
      trx.rollback();
      throw err;
    });
  }).then(() => {
    res.send(true);
    return getSearchData();
  }).then(searchData => {
    let docInfo = {
      id: newRevObj.doc_id,
      title: newRevObj.title,
      type: newRevObj.type,
      course_id: parseInt(newDocObj.course_id),
      course_name: searchData[0].short_display_name,
      inst_id: searchData[0].id,
      inst_name: `${searchData[0].inst_long_name} ${searchData[0].inst_short_name}`
    };
    return addDocToSearchCatalogue(docInfo);
  }).then(response => {
    let errorCount = 0;
    response.items.forEach(item => {
      if (item.index && item.index.error) { console.log(++errorCount, item.index.error); }
    });
    console.log(`Successfully indexed ${response.items.length - errorCount} out of ${response.items.length} items`);
  }).catch(err => {
    console.error("Error inside postNewDoc.js: ", err);
    res.send(false);
  });

};

module.exports = postNewDoc;
