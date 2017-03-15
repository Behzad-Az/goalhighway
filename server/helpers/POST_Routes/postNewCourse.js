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

  let esBodyObj = {
    title: `${prefix} ${suffix}`,
    inst_id: newCourseObj.inst_id,
    course_desc: newCourseObj.course_desc
  };

  const checkIfCourseExists = trx => knex('courses')
    .transacting(trx)
    .where('inst_id', newCourseObj.inst_id)
    .andWhere('prefix', newCourseObj.prefix)
    .andWhere('suffix', newCourseObj.suffix)
    .count('id as exists');

  const insertCourse = trx => knex('courses')
    .transacting(trx)
    .insert(newCourseObj)
    .returning('id');

  const getSearchData = trx => knex('institutions')
    .transacting(trx)
    .select('inst_long_name', 'inst_short_name')
    .where('id', req.body.inst_id);

  const addDocToSearchCatalogue = esBodyObj => {
    const indexObj = {
      index: {
        _index: 'search_catalogue',
        _type: 'course',
        _id: esBodyObj.id
      }
    };
    return esClient.bulk({ body: [indexObj, esBodyObj] })
  };

  knex.transaction(trx => {
    checkIfCourseExists(trx)
    .then(result => {
      if (parseInt(result[0].exists)) { throw 'Course prefix and suffix already exist for this institution.'; }
      else { return insertCourse(trx); }
    })
    .then(course_id => {
      esBodyObj.id = course_id[0];
      return getSearchData(trx);
    })
    .then(courseInfo => {
      esBodyObj.inst_name = `${courseInfo[0].inst_long_name} ${courseInfo[0].inst_short_name}`;
      return addDocToSearchCatalogue(esBodyObj);
    })
    .then(() => trx.commit())
    .catch(err => {
      trx.rollback();
      throw err;
    });
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewCourse.js', err);
    res.send(false);
  });

};

module.exports = postNewCourse;
