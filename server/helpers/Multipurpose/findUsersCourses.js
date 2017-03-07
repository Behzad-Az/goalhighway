const findUsersCourses = (knex, user_id) => {
  return knex('users').innerJoin('course_user', 'user_id', 'users.id')
                      .innerJoin('courses', 'course_id', 'courses.id')
                      .select('courses.id', 'course_id', 'short_display_name', 'full_display_name', 'course_year', 'course_desc', 'courses.inst_id')
                      .orderBy('prefix').orderBy('suffix')
                      .where('user_id', user_id).whereNull('unsub_date');
};

module.exports = findUsersCourses;
