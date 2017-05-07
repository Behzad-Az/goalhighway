const getInstPageData = (req, res, knex, user_id) => {

  const findUsersCourses = () => knex('users')
    .innerJoin('course_user', 'user_id', 'users.id')
    .innerJoin('courses', 'course_id', 'courses.id')
    .select(
      'courses.id', 'course_id', 'short_display_name', 'full_display_name',
      'course_year', 'course_desc', 'courses.inst_id'
    )
    .orderBy('courses.prefix')
    .orderBy('courses.suffix')
    .where('course_user.user_id', user_id)
    .whereNull('course_user.unsub_date')
    .whereNull('course_user.unsub_reason')
    .whereNull('users.deleted_at')
    .whereNull('courses.deleted_at');

  const getInstCourses = () => knex('institutions')
    .innerJoin('courses', 'courses.inst_id', 'institutions.id')
    .select(
      'courses.id', 'courses.inst_id', 'courses.short_display_name', 'courses.full_display_name',
      'inst_display_name', 'inst_long_name', 'inst_short_name'
    )
    .where('inst_id', req.params.inst_id)
    .whereNull('courses.deleted_at')
    .whereNull('institutions.deleted_at')
    .orderBy('prefix')
    .orderBy('suffix');

  const getInstList = () => knex('institutions')
    .whereNull('deleted_at')
    .orderBy('inst_value');

  Promise.all([
    findUsersCourses(),
    getInstCourses(),
    getInstList()
  ])
  .then(results => res.send({
    currUserCourseIds: results[0].map(course => course.course_id),
    currInstCourses: results[1],
    instList: results[2]
  }))
  .catch(err => {
    console.error('Error inside getInstPageData.js: ', err);
    res.send(false)
  });
};

module.exports = getInstPageData;
