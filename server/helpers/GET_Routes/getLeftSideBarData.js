const getLeftSideBarData = (req, res, knex, user_id) => {
  let userInfo, progName, instName, contributionCount;

  const getUserInfo = () => knex('users')
    .select('username', 'created_at')
    .where('id', user_id);

  const getProgName = () => knex('programs')
    .select('prog_long_name')
    .where('id', req.session.prog_id);

  const getInstName = () => knex('institutions')
    .select('inst_long_name')
    .where('id', req.session.inst_id);

  const getRevCount = () => knex('revisions')
    .where('poster_id', user_id)
    .count('id');

  const getItemCount = () => knex('items_for_sale')
    .where('owner_id', user_id)
    .count('id');

  const getCourseReviewCount = () => knex('course_reviews')
    .where('reviewer_id', user_id)
    .count('id');

  Promise.all([
    getUserInfo(),
    getProgName(),
    getInstName(),
    getRevCount(),
    getItemCount(),
    getCourseReviewCount()
  ])
  .then(results => {
    userInfo = results[0][0] ? results[0][0] : { username: 'N/A', created_at: 'N/A' };
    progName = results[1][0] ? results[1][0].prog_long_name : 'N/A';
    instName = results[2][0] ? results[2][0].inst_long_name : 'N/A';
    contributionCount = parseInt(results[3][0].count) + parseInt(results[4][0].count) + parseInt(results[5][0].count);
    res.send({ userInfo, progName, instName, contributionCount });
  })
  .catch(err => {
    console.error('Error inside getLeftSideBarData.js: ', err);
    res.send(false);
  });

};

module.exports = getLeftSideBarData;
