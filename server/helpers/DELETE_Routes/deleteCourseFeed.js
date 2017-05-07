const deleteCourseFeed = (req, res, knex, user_id) => {

  const deleteCourseFeed = () => knex('course_feed')
    .where('id', req.params.feed_id)
    .andWhere('commenter_id', user_id)
    .andWhere('course_id', req.params.course_id)
    .del();

  deleteCourseFeed()
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside deleteCourseFeed.js: ', err);
    res.send(false);
  });

};

module.exports = deleteCourseFeed;
