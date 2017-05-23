const getCompanyPageQas = (req, res, knex, user_id) => {

  const getQuestions = () => knex('interview_questions')
    .select('id', 'question', 'like_count', 'created_at')
    .where('company_id', req.params.company_id)
    .whereNull('deleted_at')
    .orderBy('created_at', 'desc')
    .limit(5)
    .offset(parseInt(req.query.qasoffset));

  const getAnswers = question => new Promise((resolve, reject) => {
    knex('interview_answers')
    .select('id', 'answer', 'created_at', 'outcome')
    .where('question_id', question.id)
    .whereNull('deleted_at')
    .orderBy('created_at', 'desc')
    .then(rows => {
      question.answers = rows;
      resolve(question);
    })
    .catch(err => reject('Unable to get answers for interview question: ', err));
  });

  getQuestions()
  .then(questions => Promise.all(questions.map(question => getAnswers(question))))
  .then(qas => res.send({ qas }))
  .catch(err => {
    console.error('Error inside getCompanyPageQas.js: ', err);
    res.send(false);
  });

};

module.exports = getCompanyPageQas;
