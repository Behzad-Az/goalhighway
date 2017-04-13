exports.seed = function(knex, Promise) {
  return Promise.all([
    knex.raw('delete from resumes where 1=1'),
    knex.raw('delete from interview_answers where 1=1'),
    knex.raw('delete from interview_questions where 1=1'),
    knex.raw('delete from companies where 1=1'),
    knex.raw('delete from flags where 1=1'),
    knex.raw('delete from course_reviews where 1=1'),
    knex.raw('delete from items_for_sale where 1=1'),
    knex.raw('delete from tutor_log where 1=1'),
    knex.raw('delete from course_feed where 1=1'),
    knex.raw('delete from doc_user_likes where 1=1'),
    knex.raw('delete from course_user where 1=1'),
    knex.raw('delete from revisions where 1=1')
  ]);
};
