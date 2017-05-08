const populate = (arr, user_id, courseStart, courseEnd) => {
  if (user_id === 9) return;
  for(let i = courseStart; i <= courseEnd; i++) {
    course_user.push({
      user_id: user_id,
      course_id: i,
    });
  }
  user_id++;
  courseStart = courseEnd + 1;
  courseEnd += 4;
  populate(arr, user_id, courseStart, courseEnd);
};

let course_user = [];
populate(course_user, 1, 1, 4);

exports.seed = function(knex, Promise) {
  return Promise.all([]);
};
