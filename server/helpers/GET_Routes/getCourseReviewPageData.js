const getCourseReviewPageData = (req, res, knex, user_id) => {

  const getInstructorAvgs = () => knex('profs')
    .innerJoin('course_reviews', 'profs.id', 'course_reviews.prof_id')
    .select('profs.name')
    .where('course_reviews.course_id', req.params.course_id)
    .whereNull('course_reviews.deleted_at')
    .avg('course_reviews.prof_rating as avgTeaching')
    .groupBy('profs.name')
    .orderBy('avgTeaching', 'desc')
    .limit(5);

  const getCourseInfo = () => knex('courses')
    .innerJoin('institutions', 'inst_id', 'institutions.id')
    .select('institutions.inst_display_name', 'courses.short_display_name', 'courses.inst_id', 'courses.id')
    .where('courses.id', req.params.course_id)
    .whereNull('courses.deleted_at')
    .whereNull('institutions.deleted_at');

  const getReviewAvgs = () => knex('course_reviews')
    .where('course_id', req.params.course_id)
    .whereNull('deleted_at')
    .avg('overall_rating as avgOverall')
    .avg('fairness_rating as avgFairness')
    .avg('workload_rating as avgWorkload')
    .avg('prof_rating as avgTeaching');

  const getProfsList = () => knex('courses')
    .innerJoin('profs', 'courses.inst_id', 'profs.inst_id')
    .select('profs.name')
    .where('courses.id', req.params.course_id)
    .whereNull('profs.deleted_at');

  Promise.all([
    getCourseInfo(),
    getInstructorAvgs(),
    getReviewAvgs(),
    getProfsList()
  ])
  .then(results => res.send({
    courseInfo: results[0][0],
    profAvgs: results[1],
    courseAvgs: results[2][0],
    profs: results[3]
  }))
  .catch(err => {
    console.error('Error inside getCourseReviewPageData.js: ', err);
    res.send(false);
  });

};

module.exports = getCourseReviewPageData;
