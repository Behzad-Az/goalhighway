const postNewInterviewAnswer = (req, res, knex, user_id) => {

  const answer = req.body.answer.trim();

  const validateInputs = () => new Promise ((resolve, reject) => {
    if (
      answer.length >= 5 && answer.length <= 500 &&
      answer.search(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/) == -1 &&
      ['Got the job', 'Unsuccessful', 'Unknown'].includes(req.body.outcome) &&
      req.params.company_id &&
      req.params.question_id
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const checkIfQuestionBelongsToCompany = () => knex('interview_questions')
    .where('id', req.params.question_id)
    .andWhere('company_id', req.params.company_id)
    .whereNull('deleted_at')
    .limit(1)
    .count('id as valid');

  const insertAnswer = newAnsObj => knex('interview_answers')
    .insert(newAnsObj);

  validateInputs()
  .then(() => checkIfQuestionBelongsToCompany())
  .then(result => {
    if (parseInt(result[0].valid)) {
      return insertAnswer({
        answer,
        outcome: req.body.outcome,
        poster_id: user_id,
        question_id: req.params.question_id
      });
    }
    else {
      throw 'provided company_id and question_id do not match.';
    }
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewInterviewAnswer.js: ', err);
    res.send(false);
  });
};

module.exports = postNewInterviewAnswer;
