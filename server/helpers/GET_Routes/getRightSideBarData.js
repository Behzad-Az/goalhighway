const getRightSideBarData = (req, res, knex, user_id) => {

  let instName, studentCount, courseCount, tutorCount, revCount, courseFeeds;

  const getInstName = () => knex('institutions')
    .select('inst_long_name')
    .where('id', req.session.inst_id);

  const getStudentCount = () => knex('institution_program')
    .innerJoin('users', 'institution_program.id', 'inst_prog_id')
    .where('inst_id', req.session.inst_id)
    .count('username as studentCount');

  const getCourseIds = () => knex('courses')
    .select('id')
    .where('inst_id', req.session.inst_id);

  const getTutorCount = courseIds => knex('course_user')
    .where('tutor_status', true)
    .whereIn('course_id', courseIds)
    .count('user_id as tutorCount');

  const getRevCount = courseIds => knex('revisions')
    .innerJoin('docs', 'doc_id', 'docs.id')
    .whereIn('course_id', courseIds)
    .count('revisions.id as revCount');

  const getCourseFeeds = courseIds => knex('course_feed')
    .whereIn('course_id', courseIds)
    .orderBy('created_at', 'desc');

  Promise.all([
    getInstName(),
    getStudentCount(),
    getCourseIds()
  ]).then(results => {
    instName = results[0][0] ? results[0][0].inst_long_name : 'N/A';
    studentCount = results[1][0].studentCount;
    courseCount = results[2].length;
    let courseIds = results[2].map(element => element.id);
    return Promise.all([
      getTutorCount(courseIds),
      getRevCount(courseIds),
      getCourseFeeds(courseIds)
    ]);
  }).then(results => {
    tutorCount = results[0][0].tutorCount;
    revCount = results[1][0].revCount;
    courseFeeds = results[2];
    let output = { instName, studentCount, courseCount, tutorCount, revCount, courseFeeds };
    res.send(output);
  }).catch(err => {
    console.error('Error inside getRightSideBarData.js: ', err);
    res.send(false);
  });

};

module.exports = getRightSideBarData;
