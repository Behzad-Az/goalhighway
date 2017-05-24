let docs = [];
let id = 0;

exports.seed = function(knex, Promise) {

  for(let i = 1; i <= 3433; i++) {
    docs.push({
      id: ++id,
      course_id: i,
      latest_title: 'some_title',
      latest_type: 'asg_report',
      latest_rev_desc: 'some_rev_desc',
      latest_file_name: 'some_file_name',
      rev_count: 1,
      updated_at: knex.fn.now()
    });
    docs.push({
      id: ++id,
      course_id: i,
      latest_title: 'some_title',
      latest_type: 'lecture_note',
      latest_rev_desc: 'some_rev_desc',
      latest_file_name: 'some_file_name',
      rev_count: 1,
      updated_at: knex.fn.now()
    });
    docs.push({
      id: ++id,
      course_id: i,
      latest_title: 'some_title',
      latest_type: 'sample_question',
      latest_rev_desc: 'some_rev_desc',
      latest_file_name: 'some_file_name',
      rev_count: 1,
      updated_at: knex.fn.now()
    });
  }

  let promiseArr = [];
  docs.forEach((doc) => {
    promiseArr.push(knex('docs').insert(doc));
  });

  return Promise.all(promiseArr);
};
