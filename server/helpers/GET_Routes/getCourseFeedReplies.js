const getCourseFeedReplies = (req, res, knex, user_id) => {

  const validateParams = () => knex('course_feed')
    .where('id', req.params.course_feed_id)
    .andWhere('course_id', req.params.course_id)
    .limit(1)
    .count('id as valid');

  const getReplies = () => knex('course_feed_replies')
    .innerJoin('users', 'course_feed_replies.commenter_id', 'users.id')
    .select(
      'course_feed_replies.id', 'course_feed_replies.content', 'course_feed_replies.created_at',
      'users.username as commenter_name', 'users.photo_name'
    )
    .where('course_feed_replies.course_feed_id', req.params.course_feed_id)
    .orderBy('course_feed_replies.created_at', 'desc')
    .limit(3);

  const getReplyCount = () => knex('course_feed_replies')
    .where('course_feed_replies.course_feed_id', req.params.course_feed_id)
    .count('id');

  validateParams()
  .then(result => {
    if (result[0].valid) { return Promise.all([ getReplies(), getReplyCount() ]); }
    else { throw 'Invalid params'; }
  })
  .then(results => res.send({ replies: results[0], replyCount: results[1][0].count }))
  .catch(err => {
    console.error('Error inside getCourseFeedReplies.js: ', err);
    res.send(false);
  });

};

module.exports = getCourseFeedReplies;
