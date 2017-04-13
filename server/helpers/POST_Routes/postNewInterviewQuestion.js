const posNewInterviewQuestion = (req, res, knex, user_id) => {

  let newQestionObj = {
    question: req.body.question,
    poster_id: user_id,
    company_id: req.params.company_id
  };

  const insertQuestion = () => knex('interview_questions')
    .insert(newQestionObj)
    .returning('id');

  const insertAnswer = questionId => {
    if (req.body.answer) {
      let newAnsObj = {
        answer: req.body.answer,
        outcome: req.body.outcome || 'unknown',
        poster_id: user_id,
        question_id: questionId
      };
      return knex('interview_answers')
        .insert(newAnsObj)
        .returning('id');
    } else {
      return [0];
    }
  };

  const removeQuestion = questionId => knex('interview_questions').where('id', questionId).del();
  const removeAnswer = answerId => knex('interview_answers').where('id', answerId).del();

  let questionId, answerId;

  insertQuestion()
  .then(qId => {
    questionId = qId[0];
    return insertAnswer(questionId);
  })
  .then(ansId => {
    answerId = ansId[0];
    res.send(true);
  })
  .catch(err => {
    console.log('Error inside posNewInterviewQuestion.js: ', err);
    res.send(false);
    removeAnswer(answerId)
    .then(() => removeQuestion(questionId))
    .catch(err => console.log('Error inside posNewInterviewQuestion.js while rolling back: ', err));
  });
};

module.exports = posNewInterviewQuestion;
