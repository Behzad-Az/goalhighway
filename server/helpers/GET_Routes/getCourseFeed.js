// const getCourseFeed = (req, res, knex, user_id) => {

//   knex('course_feed').where('course_id', req.params.course_id).orderBy('feed_created_at', 'desc').then(comments => {
//     comments.forEach(comment => comment.editable = comment.user_id === user_id);
//     res.send(comments);
//   }).catch(err => {
//     console.error("Error inside ./helpers/getCourseFeed.js: ", err);
//     res.send(false);
//   });

// };

// module.exports = getCourseFeed;
