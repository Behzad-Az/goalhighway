const questions = [

  { question: "Give me an example of a difficult decision you've made in the last two years and how did you come to that decision?", company_id: 1, poster_id: '1RzZl22wTN9' },
  { question: "Why should we hire you?", company_id: 1, poster_id: '1RzZl22wTN9' },
  { question: "How would you describe your work style?", company_id: 1, poster_id: '1RzZl22wTN9' },

  { question: "What do you consider the single most important idea you contributed in your most recent position?", company_id: 2, poster_id: '1RzZl22wTN9' },
  { question: "Tell me about yourself.", company_id: 2, poster_id: '1RzZl22wTN9' },
  { question: "What was the last project you headed up, and what was its outcome?", company_id: 2, poster_id: '1RzZl22wTN9' },

  { question: "What is your ideal job?", company_id: 3, poster_id: '1RzZl22wTN9' },
  { question: "Where would you like to be in your career three years from now?", company_id: 3, poster_id: '1RzZl22wTN9' },
  { question: "Tell me about how you set your career goals in your last job and what was the outcome?", company_id: 3, poster_id: '1RzZl22wTN9' }
];

exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('interview_questions').insert(questions)
  ]);
};
