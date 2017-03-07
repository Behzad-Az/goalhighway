const deleteCourseFeed = (req, res, knex, user_id) => {
  let course_id = req.params.course_id;
  let feed_id = req.params.feed_id;

  const checkIfAuthorized = () => knex('course_feed')
    .where('user_id', user_id)
    .andWhere('course_id', course_id)
    .andWhere('id', feed_id).count('id as auth');

  const deleteCourseFeed = () => knex('course_feed').where('id', feed_id).del();

  checkIfAuthorized().then(auth => {
    if (parseInt(auth[0].auth)) { return deleteCourseFeed(); }
    else { throw "user not authorized to delete course feed"; }
  }).then(() => {
    res.send(true);
  }).catch(err => {
    console.error("Error in deleteCourseFeed.js: ", err);
    res.send(false);
  });

};

module.exports = deleteCourseFeed;
