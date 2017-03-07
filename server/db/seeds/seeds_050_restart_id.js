exports.seed = function(knex, Promise) {
  return Promise.all([
    knex.raw("ALTER SEQUENCE interview_questions_id_seq RESTART WITH 1;"),
    knex.raw("ALTER SEQUENCE interview_answers_id_seq RESTART WITH 1;"),
    knex.raw("ALTER SEQUENCE companies_id_seq RESTART WITH 4;"),
    knex.raw("ALTER SEQUENCE flags_id_seq RESTART WITH 1;"),
    knex.raw("ALTER SEQUENCE profs_id_seq RESTART WITH 1;"),
    knex.raw("ALTER SEQUENCE course_reviews_id_seq RESTART WITH 1;"),
    knex.raw("ALTER SEQUENCE items_for_sale_id_seq RESTART WITH 1;"),
    knex.raw("ALTER SEQUENCE notifications_id_seq RESTART WITH 1;"),
    knex.raw("ALTER SEQUENCE tutor_log_id_seq RESTART WITH 1;"),
    knex.raw("ALTER SEQUENCE course_feed_id_seq RESTART WITH 1;"),
    knex.raw("ALTER SEQUENCE doc_user_likes_id_seq RESTART WITH 1;"),
    knex.raw("ALTER SEQUENCE revisions_id_seq RESTART WITH 1;"),
    knex.raw("ALTER SEQUENCE course_user_id_seq RESTART WITH 1;"),
    knex.raw("ALTER SEQUENCE users_id_seq RESTART WITH 1;"),
    knex.raw("ALTER SEQUENCE docs_id_seq RESTART WITH 100000;"),
    knex.raw("ALTER SEQUENCE courses_id_seq RESTART WITH 10000;"),
    knex.raw("ALTER SEQUENCE institution_program_id_seq RESTART WITH 1;"),
    knex.raw("ALTER SEQUENCE programs_id_seq RESTART WITH 1;"),
    knex.raw("ALTER SEQUENCE institutions_id_seq RESTART WITH 3;"),
  ]);
};
