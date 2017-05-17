const getCoursePageDocs = (req, res, knex, user_id) => {

   let docs;

   const getDocs = () => knex('docs')
    .select(
      'id', 'course_id', 'created_at', 'latest_type as type', 'latest_title as title', 'latest_rev_desc as revDesc',
      'latest_file_name as fileName', 'rev_count as revCount', 'updated_at as lastRevAt'
    )
    .where('course_id', req.params.course_id)
    .andWhere('latest_type', req.params.doc_type)
    .whereNull('deleted_at')
    .orderBy('created_at', 'desc')
    .limit(10)
    .offset(parseInt(req.query.docoffset));

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
    return Promise.all(docs.map(doc => getLikesInfo(doc)));
  })
  .then(() => res.send({ docs }))
  .catch(err => {
    console.error('Error inside getCoursePageDocs.js: ', err);
    res.send(false);
  });

};

module.exports = getCoursePageDocs;
