const deleteCourseFeed = (req, res, knex, user_id) => {

  const deleteCourseFeed = trx => knex('course_feed')
    .transacting(trx)
    .where('id', req.params.feed_id)
    .andWhere('commenter_id', user_id)
    .andWhere('course_id', req.params.course_id)
    .andWhere('category', 'new_comment')
    .andWhere('header', 'new_comment')
    .del();

  const deleteFeedReplies = trx => knex('course_feed_replies')
    .transacting(trx)
    .where('course_feed_id', req.params.feed_id)
    .del();

  knex.transaction(trx => {
    deleteFeedReplies(trx)
    .then(() => deleteCourseFeed(trx))
    .then(() => trx.commit())
    .catch(err => {
      console.error('Error isnide deleteCourseFeed.js: ', err);
      trx.rollback();
    });
  })
  .then(() => res.send(true))
  .catch(err => res.send(false));

};

module.exports = deleteCourseFeed;
