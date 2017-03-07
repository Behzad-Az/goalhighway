const postNewCourse = (req, res, knex, user_id, esClient) => {

  const capitalizeFirstLetter = str => str.trim().charAt(0).toUpperCase() + str.trim().slice(1);

  let prefix = req.body.prefix.trim().toUpperCase();
  let suffix = req.body.suffix.trim().toUpperCase();
  let course_desc = capitalizeFirstLetter(req.body.course_desc);

  const newCourseObj = {
    prefix,
    suffix,
    course_desc,
    full_display_name: `${prefix} ${suffix} - ${course_desc}`,
    short_display_name: `${prefix} ${suffix}`,
    course_year: req.body.course_year,
    inst_id: req.body.inst_id
  };

  const checkIfCourseExists = () => knex('courses')
    .where('inst_id', newCourseObj.inst_id).andWhere('prefix', newCourseObj.prefix).andWhere('suffix', newCourseObj.suffix)
    .count('id as exists');

  const insertCourse = () => knex('courses').insert(newCourseObj).returning('id');

  const getSearchData = () => knex('institutions').select('inst_long_name', 'inst_short_name').where('id', req.body.inst_id);

  const addDocToSearchCatalogue = bodyObj => {
    const indexObj = {
      index: {
        _index: 'search_catalogue',
        _type: 'course',
        _id: bodyObj.id
      }
    };
    return esClient.bulk({ body: [indexObj, bodyObj] })
  };

  let bodyObj = {
    title: `${prefix} ${suffix}`,
    inst_id: newCourseObj.inst_id,
    course_desc: newCourseObj.course_desc
  };

  checkIfCourseExists().then(result => {
    if (parseInt(result[0].exists)) { throw "course prefix and suffix already exist for this institution."; }
    else { return insertCourse(); }
  })
  .then(course_id => {
    bodyObj.id = course_id[0];
    res.send(true);
    return getSearchData();
  }).then(courseInfo => {
    bodyObj.inst_name = `${courseInfo[0].inst_long_name} ${courseInfo[0].inst_short_name}`;
    return addDocToSearchCatalogue(bodyObj);
  }).catch(err => {
    console.error("Error inside postNewCourse.js: ", err);
    res.send(false);
  });

};

module.exports = postNewCourse;
