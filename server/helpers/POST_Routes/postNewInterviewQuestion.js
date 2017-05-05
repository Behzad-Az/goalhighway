const posNewInterviewQuestion = (req, res, knex, user_id) => {

  const question = req.body.question.trim();
  const answer = req.body.answer.trim();
  let question_id;

  const validateAnswer = () => {
    if (answer) {
      return answer.length >= 5 && answer.length <= 500 &&
             answer.search(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/) == -1 &&
             ['Got the job', 'Unsuccessful', 'Unknown'].includes(req.body.outcome);
    } else {
      return true;
    }
  };

  const validateInputs = () => new Promise ((resolve, reject) => {
    if (
      question.length >= 5 && question.length <= 250 &&
      question.search(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/) == -1 &&
      req.params.company_id &&
      validateAnswer()
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const insertQuestion = newQestionObj => knex('interview_questions')
    .insert(newQestionObj)
    .returning('id');

  const insertAnswer = newAnsObj => knex('interview_answers')
    .insert(newAnsObj)
    .returning('id');

  const removeQuestion = questionId => knex('interview_questions')
    .where('id', questionId)
    .del();

  validateInputs()
  .then(() => insertQuestion({
    question,
    poster_id: user_id,
    company_id: req.params.company_id
  }))
  .then(qId => {
    question_id = qId[0];
    if (answer) {
      return insertAnswer({
        answer,
        outcome: req.body.outcome,
        poster_id: user_id,
        question_id
      });
    } else {
      return [0];
    }
  })
  .then(() => res.send(true))
  .catch(err => {
    console.log('Error inside posNewInterviewQuestion.js: ', err);
    res.send(false);
    removeQuestion(question_id)
    .catch(err => console.log('Error inside posNewInterviewQuestion.js while rolling back: ', err));
  });

};

module.exports = posNewInterviewQuestion;
