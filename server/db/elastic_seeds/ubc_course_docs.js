'use strict';

const fs = require('fs');
const elasticsearch = require('elasticsearch');
const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});

const bulkIndex = function bulkIndex(index, type, data) {
  let bulkBody = [];

  data.forEach(item => {
    bulkBody.push({
      index: {
        _index: index,
        _type: type,
        _id: item.doc_id
      }
    });

    bulkBody.push(item);
  });

  esClient.bulk({body: bulkBody})
  .then(response => {
    let errorCount = 0;
    response.items.forEach(item => {
      if (item.index && item.index.error) {
        console.log(++errorCount, item.index.error);
      }
    });
    console.log(`Successfully indexed ${data.length - errorCount} out of ${data.length} items`);
  })
  .catch(err => console.error('Error inside ubc_course_docs.js seed fine: ', err));
};

const populate = function populate() {
  const coursesRaw = fs.readFileSync('ubc_courses.json');
  const courses = JSON.parse(coursesRaw);
  let id = 0;
  let docs = [];

  courses.forEach(course => {
    docs.push({
      title: `name_ar_${id}`,
      kind: 'assignment assingments report reports',
      inst_id: 1,
      inst_name: 'University of British Columbia UBC',
      course_id: course.course_id,
      doc_id: (++id).toString(),
      course_name: course.title
    });
    docs.push({
      title: `name_ln_${id}`,
      kind: 'lecture lectures note notes',
      inst_id: 1,
      inst_name: 'University of British Columbia UBC',
      course_id: course.course_id,
      doc_id: (++id).toString(),
      course_name: course.title
    });
    docs.push({
      title: `name_sq_${id}`,
      kind: 'sample question questions quiz quizzes exam exams final finals midterm midterms',
      inst_id: 1,
      inst_name: 'University of British Columbia UBC',
      course_id: course.course_id,
      doc_id: (++id).toString(),
      course_name: course.title
    });
  });

  console.log(`${courses.length} items parsed from data file`);
  bulkIndex('goalhwy_es_db', 'document', docs);
};

populate();
