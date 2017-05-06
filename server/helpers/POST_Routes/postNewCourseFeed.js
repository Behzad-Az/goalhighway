const postNewCourseFeed = (req, res, knex, user_id) => {

  const content = req.body.content.trim();

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      content.length >= 3 && content.length <= 535 &&
      content.search(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/) == -1 &&
      [true, false].includes(req.body.anonymous) &&
      req.params.course_id
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const insertNewFeed = feedObj => knex('course_feed')
    .insert(feedObj);

  validateInputs()
  .then(() => insertNewFeed({
    anonymous: req.body.anonymous,
    category: 'new_comment',
    header: 'new_comment',
    content,
    commenter_id: user_id,
    course_id: req.params.course_id
  }))
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewCourseFeed.js: ', err);
    res.send(false);
  });
};

module.exports = postNewCourseFeed;
