const getCourseReviewPageData = (req, res, knex, user_id) => {

  const getProfs = () => knex('courses')
    .innerJoin('profs', 'courses.inst_id', 'profs.inst_id')
    .select('profs.name')
    .where('courses.id', req.params.course_id);

  const getCourseInfo = () => knex('courses')
    .innerJoin('institutions', 'inst_id', 'institutions.id')
    .select('inst_display_name', 'short_display_name', 'inst_id', 'courses.id')
    .where('courses.id', req.params.course_id);

  const getCourseReviews = () => knex('profs')
    .innerJoin('course_reviews', 'profs.id', 'prof_id')
    .where('course_id', req.params.course_id)
    .orderBy('review_created_at', 'desc');

  Promise.all([
    getCourseInfo(),
    getCourseReviews(),
    getProfs()
  ]).then(results => {
    let courseInfo = results[0][0];
    let courseReviews = results[1];
    let profs = results[2];
    res.send({ courseInfo, courseReviews, profs });
  }).catch(err => {
    console.error("Error inside getCourseReviewPageData.js: ", err);
    res.send(false);
  });

};

module.exports = getCourseReviewPageData;
