// const fs = require('fs');

// const coursesRaw = fs.readFileSync(__dirname + '/ubc_courses.json');
// const courseIdArr = JSON.parse(coursesRaw);

// const docsRaw = fs.readFileSync(__dirname + '/../elastic_seeds/ubc_course_docs.json');
// const docIdArr = JSON.parse(docsRaw);

// let id = 0;
// let docs = [];

exports.seed = function(knex, Promise) {

  // for(let i = 0; i < 3433; i++) {
  //   docs.push({
  //     id: docIdArr[id++].id,
  //     course_id: courseIdArr[i].id,
  //     latest_title: 'some_title',
  //     latest_type: 'asg_report',
  //     latest_rev_desc: 'some_rev_desc',
  //     latest_file_name: 'some_file_name',
  //     rev_count: 1,
  //     updated_at: knex.fn.now()
  //   });
  //   docs.push({
  //     id: docIdArr[id++].id,
  //     course_id: courseIdArr[i].id,
  //     latest_title: 'some_title',
  //     latest_type: 'lecture_note',
  //     latest_rev_desc: 'some_rev_desc',
  //     latest_file_name: 'some_file_name',
  //     rev_count: 1,
  //     updated_at: knex.fn.now()
  //   });
  //   docs.push({
  //     id: docIdArr[id++].id,
  //     course_id: courseIdArr[i].id,
  //     latest_title: 'some_title',
  //     latest_type: 'sample_question',
  //     latest_rev_desc: 'some_rev_desc',
  //     latest_file_name: 'some_file_name',
  //     rev_count: 1,
  //     updated_at: knex.fn.now()
  //   });
  // }

  // let promiseArr = [];
  // docs.forEach(doc => {
  //   promiseArr.push(knex('docs').insert(doc));
  // });

  // return Promise.all(promiseArr);
  return Promise.all([]);
};
