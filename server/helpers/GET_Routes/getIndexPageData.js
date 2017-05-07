const getIndexPageData = (req, res, knex, user_id) => {

  let courses;

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

  const getCourseDocs = courseIds => knex('docs')
    .whereIn('course_id', courseIds)
    .whereNull('deleted_at');

  const getDocInfo = () => knex('docs')
    .where('course_id', req.params.course_id)
    .andWhere('id', req.params.doc_id)
    .whereNull('deleted_at');

  const getDocRevisions = doc => new Promise((resolve, reject) => {
    knex('revisions')
    .where('doc_id', doc.id)
    .whereNull('deleted_at')
    .orderBy('created_at', 'desc')
    .limit(1)
    .then(revisions => {
      doc.revisions = revisions;
      doc.title = revisions[0].title;
      doc.type = revisions[0].type;
      resolve(doc);
    })
    .catch(err => reject('Unable to get revisions for doc: ', err));
  });

  findUsersCourses()
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
