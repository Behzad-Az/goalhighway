const getIndexPageData = (req, res, knex, user_id) => {

  let courses;

  const findUsersCourses = () => knex('users')
    .innerJoin('course_user', 'user_id', 'users.id')
    .innerJoin('courses', 'course_id', 'courses.id')
    .select('courses.id', 'courses.short_display_name', 'courses.course_desc')
    .orderBy('courses.short_display_name')
    .where('course_user.user_id', user_id)
    .whereNull('course_user.unsub_date')
    .whereNull('course_user.unsub_reason')
    .whereNull('users.deleted_at')
    .whereNull('courses.deleted_at');

  const getRevActivities = courseIds => knex('revisions')
    .innerJoin('docs', 'revisions.doc_id', 'docs.id')
    .select('revisions.type', 'docs.course_id')
    .whereIn('docs.course_id', courseIds)
    .whereNull('revisions.deleted_at')
    .whereNull('docs.deleted_at')
    .count('revisions.id as revCount')
    .groupBy('docs.course_id')
    .groupBy('revisions.type')
    .orderBy('revisions.type');

  const getItemActivities = courseIds => knex('items_for_sale')
    .select('course_id')
    .whereIn('course_id', courseIds)
    .whereNull('deleted_at')
    .count('id as itemCount')
    .groupBy('course_id');

  const getCommentActivities = courseIds => knex('course_feed')
    .select('course_id')
    .where('category', 'new_comment')
    .whereIn('course_id', courseIds)
    .count('id as commentCount')
    .groupBy('course_id');

  const getLatestRevisions = course => new Promise((resolve, reject) => {
    knex('revisions')
    .innerJoin('docs', 'revisions.doc_id', 'docs.id')
    .select('docs.course_id', 'revisions.id', 'revisions.doc_id', 'revisions.title', 'revisions.rev_desc')
    .where('docs.course_id', course.id)
    .whereNull('docs.deleted_at')
    .whereNull('revisions.deleted_at')
    .orderBy('revisions.created_at', 'desc')
    .limit(3)
    .then(revs => {
      course.latestRevs = revs;
      resolve();
    })
    .catch(err => reject(err));
  });

  const filterResults = (results, courseId) => results.filter(result => result.course_id === courseId);

  findUsersCourses()
  .then(userCourses => {
    courses = userCourses;
    const courseIds = courses.map(course => course.id);
    return Promise.all([
      getRevActivities(courseIds),
      getItemActivities(courseIds),
      getCommentActivities(courseIds)
    ].concat(courses.map(course => getLatestRevisions(course))));
  })
  .then(results => {
    courses.forEach(course => {
      course.revActivities = filterResults(results[0], course.id);
      course.itemActivities = filterResults(results[1], course.id);
      course.commentActivities = filterResults(results[2], course.id);
    });
    res.send({ courses });
  })
  .catch(err => {
    console.error('Error inside getIndexPageData.js: ', err);
    res.send(false);
  });

};

module.exports = getIndexPageData;
