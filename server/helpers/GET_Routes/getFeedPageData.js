const getFeedPageData = (req, res, knex, user_id) => {

  let instId;

  const getInstId = () => knex('users')
    .innerJoin('institution_program', 'inst_prog_id', 'institution_program.id')
    .select('inst_id')
    .where('users.id', user_id);

  const getCourseIds = () => knex('users')
    .innerJoin('course_user', 'users.id', 'user_id')
    .select('course_id')
    .where('users.id', user_id);

  const getCourseFeeds = courseIds => knex('course_feed')
    .innerJoin('courses', 'course_id', 'courses.id')
    .select('short_display_name', 'commenter_name', 'category', 'content', 'course_id', 'doc_id', 'tutor_log_id')
    .whereIn('course_id', courseIds);


  Promise.all([
    getCourseIds(),
    getInstId()
  ])
  .then(results => {
    let courseIds = results[0].map(course => course.course_id);
    instId = results[1][0].inst_id;
    return getCourseFeeds(courseIds);
  })
  .then(courseFeeds => {
    res.send({ courseFeeds, instId });
  })
  .catch(err => {
    console.error("Error inside getFeedPageData.js: ", err);
    res.send(false);
  });
};

module.exports = getFeedPageData;
