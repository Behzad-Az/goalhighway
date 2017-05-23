const getLeftSideBarData = (req, res, knex, user_id) => {

  const getProgName = () => knex('programs')
    .select('prog_long_name')
    .where('id', req.session.prog_id)
    .whereNull('deleted_at');

  const getInstName = () => knex('institutions')
    .select('inst_long_name')
    .where('id', req.session.inst_id)
    .whereNull('deleted_at');

  const getRevCount = () => knex('revisions')
    .where('poster_id', user_id)
    .whereNull('deleted_at')
    .count('id');

  const getItemCount = () => knex('items_for_sale')
    .where('owner_id', user_id)
    .count('id');

  const getCourseReviewCount = () => knex('course_reviews')
    .where('reviewer_id', user_id)
    .whereNull('deleted_at')
    .count('id');

  Promise.all([
    getProgName(),
    getInstName(),
    getRevCount(),
    getItemCount(),
    getCourseReviewCount()
  ])
  .then(results => res.send({
    userInfo: {
      username: req.session.username,
      created_at: req.session.created_at,
      photo_name: req.session.photo_name
    },
    progName: results[0][0].prog_long_name,
    instName: results[1][0].inst_long_name,
    contributionCount: parseInt(results[2][0].count) + parseInt(results[3][0].count) + parseInt(results[4][0].count)
  }))
  .catch(err => {
    console.error('Error inside getLeftSideBarData.js: ', err);
    res.send(false);
  });

};

module.exports = getLeftSideBarData;
