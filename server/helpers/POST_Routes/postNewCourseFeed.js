const postNewCourseFeed = (req, res, knex, user_id) => {

  let newCommentObj = {
    commenter_name: req.body.commenterName || 'anonymous',
    category: req.body.category,
    content: req.body.content,
    commenter_id: user_id,
    course_id: req.params.course_id
  };

  knex('course_feed')
  .insert(newCommentObj)
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewCourseFeed.js: ', err);
    res.send(false);
  });
};

module.exports = postNewCourseFeed;
