let docs = [];
let id = 0;
for(let i = 1; i <= 3433; i++) {
  docs.push({
    id: ++id,
    // type: 'asg_report',
    // title: `name_ar_${id}`,
    course_id: i
  });
  docs.push({
    id: ++id,
    // type: 'lecture_note',
    // title: `name_ln_${id}`,
    course_id: i
  });
  docs.push({
    id: ++id,
    // type: 'sample_question',
    // title: `name_sq_${id}`,
    course_id: i
  });
}

exports.seed = function(knex, Promise) {
  let promiseArr = [];
  docs.forEach((doc) => {
    promiseArr.push(knex('docs').insert(doc));
  });

  return Promise.all(promiseArr);
};
