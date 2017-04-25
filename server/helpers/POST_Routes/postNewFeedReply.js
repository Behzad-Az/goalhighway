const postNewFeedReply = (req, res, knex, user_id) => {

  const insertNewReply = newReplyObj => knex('course_feed_replies')
    .insert(newReplyObj);

  let newReplyObj = {
    content: req.body.content.trim(),
    commenter_id: user_id,
    course_feed_id: req.params.course_feed_id
  };

  insertNewReply(newReplyObj)
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewFeedReply.js: ', err);
    res.send(false);
  });

};

module.exports = postNewFeedReply;
