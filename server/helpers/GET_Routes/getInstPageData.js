const getInstPageData = (req, res, knex, user_id) => {

  const findUsersCourses = () => knex('course_user')
    .select('course_id')
    .where('user_id', user_id)
    .whereNotNull('sub_date')
    .whereNull('unsub_date')
    .whereNull('unsub_reason');

  const getInstCourses = () => knex('institutions')
    .innerJoin('courses', 'courses.inst_id', 'institutions.id')
    .select('courses.id', 'courses.short_display_name', 'courses.full_display_name')
    .where('courses.inst_id', req.params.inst_id)
    .whereNull('courses.deleted_at')
    .whereNull('institutions.deleted_at')
    .orderBy('courses.short_display_name');

  const getInstList = () => knex('institutions')
    .select('id as value', 'inst_display_name as label')
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
