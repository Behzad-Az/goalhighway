const getInstCourses = (req, res, knex, user_id) => {
  knex('institutions').innerJoin('courses', 'inst_id', 'institutions.id')
                 .where('inst_id', req.params.inst_id).orderBy('prefix').orderBy('suffix')
                 .then(courses => {
    res.send(courses);
  }).catch(err => {
    console.error("Error inside getInstCourses.js: ", err);
    res.send(false)
  });
};

module.exports = getInstCourses;
