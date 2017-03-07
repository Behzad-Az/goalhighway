const postNewCourseFeed = (req, res, knex, user_id) => {
  let newComment = Object.assign( {}, req.body, { user_id: user_id, course_id: req.params.course_id } );
  newComment.commenter_name ? '' : delete newComment.commenter_name;

  knex('course_feed').insert(newComment).then(() => {
    res.send(true);
  }).catch(err => {
    console.error("Error inside postNewCourseFeed.js: ", err);
    res.send(false);
  });
};

module.exports = postNewCourseFeed;
