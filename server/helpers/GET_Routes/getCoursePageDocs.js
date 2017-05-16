const getCoursePageDocs = (req, res, knex, user_id) => {

   let docs;

   const getDocs = () => knex('docs')
    .where('course_id', req.params.course_id)
    .andWhere('type', req.params.doc_type)
    .whereNull('deleted_at')
    .orderBy('created_at', 'desc')
    .limit(10)
    .offset(parseInt(req.query.docoffset));

  const getDocRevisions = doc => new Promise((resolve, reject) => {
    knex('revisions')
    .select('title', 'type', 'created_at', 'file_name', 'rev_desc')
    .where('doc_id', doc.id)
    .whereNull('deleted_at')
    .orderBy('created_at', 'desc')
    .then(revisions => {
      doc.title = revisions[0].title;
      doc.type = revisions[0].type;
      doc.revCount = revisions.length;
      doc.lastRevAt = revisions[0].created_at;
      doc.fileName = revisions[0].file_name;
      doc.revDesc = revisions[0].rev_desc;
      resolve();
    })
    .catch(err => reject('Unable to get revisions for course: ', err));
  });

  const getLikeCount = item => knex('user_likes')
      .where('foreign_table', 'docs')
      .andWhere('foreign_id', item.id)
      .sum('like_or_dislike as likeCount');

  const getAlreadyLiked = item => knex('user_likes')
      .where('foreign_table', 'docs')
      .andWhere('foreign_id', item.id)
      .andWhere('user_id', user_id)
      .sum('like_or_dislike as likeCount');

  const getLikesInfo = item => new Promise((resolve, reject) => {
    Promise.all([ getLikeCount(item), getAlreadyLiked(item) ])
    .then(results => {
      item.likeCount = results[0][0].likeCount ? parseInt(results[0][0].likeCount) : 0;
      item.alreadyLiked = results[1][0].likeCount ? parseInt(results[1][0].likeCount) : 0;
      resolve();
    })
    .catch(err => reject(err));
  });

  getDocs()
  .then(documents => {
    docs = documents;
    let promiseArr = [];
    docs.forEach(doc => {
      promiseArr.push(getDocRevisions(doc));
      promiseArr.push(getLikesInfo(doc));
    });
    return Promise.all(promiseArr);
  })
  .then(() => res.send({ docs }))
  .catch(err => {
    console.error('Error inside getCoursePageDocs.js: ', err);
    res.send(false);
  });

};

module.exports = getCoursePageDocs;
