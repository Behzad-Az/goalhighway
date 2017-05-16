let docs = [];
let id = 0;
for(let i = 1; i <= 3433; i++) {
  docs.push({
    id: ++id,
    course_id: i,
    type: 'asg_report'
  });
  docs.push({
    id: ++id,
    course_id: i,
    type: 'lecture_note'
  });
  docs.push({
    id: ++id,
    course_id: i,
    type: 'sample_question'
  });
}

exports.seed = function(knex, Promise) {
  let promiseArr = [];
  docs.forEach((doc) => {
    promiseArr.push(knex('docs').insert(doc));
  });

  return Promise.all(promiseArr);
};
