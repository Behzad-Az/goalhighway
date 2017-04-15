const findUsersCourses = require('../Multipurpose/findUsersCourses.js');

const getIndexPageData = (req, res, knex, user_id) => {

  let courses;

  const getCourseDocs = courseIds => knex('docs')
    .whereIn('course_id', courseIds)
    .whereNull('deleted_at');

  const getDocInfo = () => knex('docs')
    .where('course_id', req.params.course_id)
    .andWhere('id', req.params.doc_id)
    .whereNull('deleted_at');

  const getDocRevisions = doc => new Promise((resolve, reject) => {
    knex('revisions').where('doc_id', doc.id).whereNull('deleted_at').orderBy('created_at', 'desc').limit(1)
    .then(revisions => {
      doc.revisions = revisions;
      doc.title = revisions[0].title;
      doc.type = revisions[0].type;
      resolve(doc);
    })
    .catch(err => reject('Unable to get revisions for doc: ', err));
  });

  findUsersCourses(knex, user_id)
  .then(userCourses => {
    courses = userCourses;
    return getCourseDocs(userCourses.map(course => course.course_id));
  })
  .then(docs => Promise.all(docs.map(doc => getDocRevisions(doc))))
  .then(updates => res.send({ courses, updates, instId: req.session.inst_id }))
  .catch(err => {
    console.error('Error inside getIndexPageData.js : ', err);
    res.send(false);
  });

};

module.exports = getIndexPageData;
