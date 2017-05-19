const postNewCourseFeedReply = (req, res, knex, user_id) => {

  const content = req.body.replyContent.trim();
  const course_feed_id = req.params.course_feed_id;

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      content.length >= 3 && content.length <= 500 &&
      content.search(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/) == -1 &&
      course_feed_id
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const insertNewReply = replyObj => knex('course_feed_replies')
    .insert(replyObj);

  validateInputs()
  .then(() => insertNewReply({
    content,
    commenter_id: user_id,
    course_feed_id
  }))
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewCourseFeed.js: ', err);
    res.send(false);
  });

};

module.exports = postNewCourseFeedReply;
