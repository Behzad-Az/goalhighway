const randIdString = require('random-base64-string');

const postNewInterviewAnswer = (req, res, knex, user_id) => {

  const answer = req.body.answer.trim();
  const outcome = req.body.outcome;
  const company_id = req.params.company_id;
  const question_id = req.params.question_id;

  const validateInputs = () => new Promise ((resolve, reject) => {
    if (
      answer.length >= 5 && answer.length <= 500 &&
      answer.search(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/) == -1 &&
      ['Got the job', 'Unsuccessful', 'Unknown'].includes(outcome) &&
      company_id.length === 11 &&
      question_id.length === 11
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const validateParams = () => knex('interview_questions')
    .where('id', question_id)
    .andWhere('company_id', company_id)
    .whereNull('deleted_at')
    .limit(1)
    .count('id as valid');

  const insertAnswer = newAnsObj => knex('interview_answers')
    .insert(newAnsObj);

  validateInputs()
  .then(() => validateParams())
  .then(result => {
    if (parseInt(result[0].valid)) {
      return insertAnswer({
        id: randIdString(11),
        answer,
        outcome,
        poster_id: user_id,
        question_id
      });
    }
    else {
      throw 'Invalid params.';
    }
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewInterviewAnswer.js: ', err);
    res.send(false);
  });
};

module.exports = postNewInterviewAnswer;
