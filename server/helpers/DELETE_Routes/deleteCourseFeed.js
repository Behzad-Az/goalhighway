const deleteCourseFeed = (req, res, knex, user_id) => {

  const checkIfAuthorized = trx => knex('course_feed')
    .transacting(trx)
    .where('commenter_id', user_id)
    .andWhere('course_id', req.params.course_id)
    .andWhere('id', req.params.feed_id)
    .count('id as auth');

  const deleteCourseFeed = trx => knex('course_feed')
    .transacting(trx)
    .where('id', req.params.feed_id)
    .del();

  knex.transaction(trx => {
    checkIfAuthorized(trx)
    .then(auth => {
      if (parseInt(auth[0].auth)) { return deleteCourseFeed(trx); }
      else { throw 'user not authorized to delete course feed'; }
    })
    .then(() => trx.commit())
    .catch(err => {
      trx.rollback();
      throw err;
    });
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside deleteCourseFeed.js', err);
    res.send(false);
  });

};

module.exports = deleteCourseFeed;
