exports.seed = function(knex, Promise) {
  return Promise.all([
    knex.raw('delete from password_change_requests where 1=1'),
    knex.raw('delete from download_log where 1=1'),
    knex.raw('delete from login_history where 1=1'),
    knex.raw('delete from course_feed_replies where 1=1'),
    knex.raw('delete from conversation_members where 1=1'),
    knex.raw('delete from conversation_messages where 1=1'),
    knex.raw('delete from conversations where 1=1'),
    knex.raw('delete from company_reviews where 1=1'),
    knex.raw('delete from resumes where 1=1'),
    knex.raw('delete from interview_answers where 1=1'),
    knex.raw('delete from interview_questions where 1=1'),
    knex.raw('delete from flags where 1=1'),
    knex.raw('delete from course_feed where 1=1'),
    knex.raw('delete from course_reviews where 1=1'),
    knex.raw('delete from items_for_sale where 1=1'),
    knex.raw('delete from tutor_log where 1=1'),
    knex.raw('delete from user_likes where 1=1'),
    knex.raw('delete from course_user where 1=1'),
    knex.raw('delete from revisions where 1=1')
  ]);
};
