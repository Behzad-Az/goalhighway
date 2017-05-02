const postNewCourse = (req, res, knex, user_id, esClient) => {

  const capitalizeFirstLetter = str => str.trim().charAt(0).toUpperCase() + str.trim().slice(1);

  const prefix = req.body.prefix.trim().toUpperCase();
  const suffix = req.body.suffix.trim().toUpperCase();
  const course_desc = capitalizeFirstLetter(req.body.courseDesc);

  let esBodyObj = {
    title: `${prefix} ${suffix}`,
    inst_id: req.body.instId,
    course_desc
  };

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      req.body.instId &&
      prefix && prefix.length <= 10 &&
      suffix && suffix.length <= 10 &&
      course_desc && course_desc.length <= 100 &&
      [1, 2, 3, 4, 5, 6].includes(parseInt(req.body.courseYear))
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const checkIfCourseExists = trx => knex('courses')
    .transacting(trx)
    .where('inst_id', req.body.instId)
    .andWhere('prefix', prefix)
    .andWhere('suffix', suffix)
    .count('id as exists');

  const insertCourse = (newCourseObj, trx) => knex('courses')
    .transacting(trx)
    .insert(newCourseObj)
    .returning('id');

  const getSearchData = trx => knex('institutions')
    .transacting(trx)
    .select('inst_long_name', 'inst_short_name')
    .where('id', req.body.instId);

  const addDocToSearchCatalogue = esBodyObj => {
    const indexObj = {
      index: {
        _index: 'search_catalogue',
        _type: 'course',
        _id: esBodyObj.id
      }
    };
    return esClient.bulk({ body: [indexObj, esBodyObj] });
  };

  knex.transaction(trx => {
    validateInputs()
    .then(() => checkIfCourseExists(trx))
    .then(result => {
      if (parseInt(result[0].exists)) {
        throw 'Course prefix and suffix already exist for this institution.';
      }
      else {
        let newCourseObj = {
          prefix,
          suffix,
          course_desc,
          full_display_name: `${prefix} ${suffix} - ${course_desc}`,
          short_display_name: `${prefix} ${suffix}`,
          course_year: req.body.courseYear,
          inst_id: req.body.instId
        };
        return insertCourse(newCourseObj, trx);
      }
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
      console.error('Error inside postNewCourse.js: ', err);
      trx.rollback();
    });
  })
  .then(() => res.send(true))
  .catch(() => res.send(false));

};

module.exports = postNewCourse;
