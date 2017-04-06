const findUsersCourses = require('../Multipurpose/findUsersCourses.js');

const getIndexPageData = (req, res, knex, user_id) => {

  let courses;

  const getCourseDocs = courseIds => knex('docs')
    .innerJoin('courses', 'courses.id', 'course_id')
    .innerJoin('revisions', 'docs.id', 'doc_id')
    .select('revisions.id', 'type', 'title', 'course_id', 'rev_desc', 'file_name', 'doc_id', 'user_id', 'revisions.created_at')
    .whereIn('course_id', courseIds)
    .whereNull('rev_deleted_at')
    .whereNull('doc_deleted_at')
    .orderBy('revisions.created_at', 'desc');

  findUsersCourses(knex, user_id)
  .then(userCourses => {
    courses = userCourses;
    let courseIds = userCourses.map(course => course.course_id);
    return getCourseDocs(courseIds);
  })
  .then(updates => {
    let instId = req.session.inst_id;
    res.send({ courses, updates, instId })
  }).catch(err => {
    console.error("Error inside getIndexPageData.js : ", err);
    res.send(false);
  });

};

module.exports = getIndexPageData;
