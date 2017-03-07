const findUsersCourses = require('../Multipurpose/findUsersCourses.js');

const getInstPageData = (req, res, knex, user_id) => {

  findUsersCourses(knex, user_id).then(courses => {
    let courseIds = courses.map(course => course.course_id);
  });

  const getInstCourses = () => knex('institutions')
    .innerJoin('courses', 'inst_id', 'institutions.id')
    .where('inst_id', req.params.inst_id).orderBy('prefix').orderBy('suffix');

  const getInstList = () => knex('institutions').orderBy('inst_value');

  Promise.all([
    findUsersCourses(knex, user_id),
    getInstCourses(),
    getInstList()
  ]).then(results => {
    let userId = user_id;
    let currUserCourseIds = results[0].map(course => course.course_id);
    let currInstCourses = results[1];
    let instList = results[2];
    res.send({ currUserCourseIds, currInstCourses, instList, userId });
  }).catch(err => {
    console.error("Error inside getInstPageData.js: ", err);
    res.send(false)
  });
};

module.exports = getInstPageData;
