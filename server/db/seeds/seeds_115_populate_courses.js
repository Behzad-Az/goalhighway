const fs = require('fs');

const coursesRaw = fs.readFileSync(__dirname + '/ubc_courses.json');
const courseArr = JSON.parse(coursesRaw);

exports.seed = function(knex, Promise) {
  courseArr.forEach(course => {
    course.full_display_name = `${course.prefix} ${course.suffix} - ${course.course_desc}`;
    course.short_display_name = `${course.prefix} ${course.suffix}`;
  });
  return Promise.all([
    knex('courses').insert(courseArr)
  ]);
};
