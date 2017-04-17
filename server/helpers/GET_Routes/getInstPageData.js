const findUsersCourses = require('../Multipurpose/findUsersCourses.js');

const getInstPageData = (req, res, knex, user_id) => {

  const getInstCourses = () => knex('institutions')
    .innerJoin('courses', 'inst_id', 'institutions.id')
    .select('courses.id', 'inst_display_name', 'inst_id', 'inst_long_name', 'inst_short_name', 'courses.short_display_name', 'courses.full_display_name')
    .where('inst_id', req.params.inst_id).orderBy('prefix').orderBy('suffix');

  const getInstList = () => knex('institutions').orderBy('inst_value');

  Promise.all([
    findUsersCourses(knex, user_id),
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
