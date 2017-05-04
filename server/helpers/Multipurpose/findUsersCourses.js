const findUsersCourses = (knex, user_id) => knex('users')
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
  .whereNull('users.deleted_at')
  .whereNull('courses.deleted_at');

module.exports = findUsersCourses;
