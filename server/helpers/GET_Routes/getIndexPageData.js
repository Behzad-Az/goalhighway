const findUsersCourses = require('../Multipurpose/findUsersCourses.js');

const getIndexPageData = (req, res, knex, user_id) => {

  let courses;

  const getCourseDocs = courseIds => knex('docs')
    .innerJoin('courses', 'courses.id', 'course_id')
    .innerJoin('revisions', 'docs.id', 'doc_id')
    .select('revisions.id', 'type', 'title', 'course_id', 'rev_desc', 'file_name', 'doc_id', 'user_id', 'revisions.created_at')
    .whereIn('course_id', courseIds)
    .whereNull('revisions.deleted_at')
    .whereNull('docs.deleted_at')
    .orderBy('revisions.created_at', 'desc');

  findUsersCourses(knex, user_id)
  .then(userCourses => {
    courses = userCourses;
    return getCourseDocs(userCourses.map(course => course.course_id));
  })
  .then(updates => res.send({ courses, updates, instId: req.session.inst_id }))
  .catch(err => {
    console.error('Error inside getIndexPageData.js : ', err);
    res.send(false);
  });

};

module.exports = getIndexPageData;
