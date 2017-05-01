const postNewCourseFeed = (req, res, knex, user_id) => {

  const validateInputs = () => new Promise((resolve, reject) => {
    req.body.content.trim().length <= 500 ? resolve() : reject('Invalid form entries');
  });

  const insertNewFeed = feedObj => knex('course_feed')
    .insert(feedObj);

  validateInputs()
  .then(() => insertNewFeed({
    anonymous: req.body.anonymous,
    category: 'new_comment',
    header: 'new_comment',
    content: req.body.content.trim(),
    commenter_id: user_id,
    course_id: req.params.course_id
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewCourseFeed.js: ', err);
    res.send(false);
  });
};

module.exports = postNewCourseFeed;
