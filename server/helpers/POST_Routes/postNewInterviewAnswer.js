const postNewInterviewAnswer = (req, res, knex, user_id) => {

  let newAnsObj = {
    answer: req.body.answer,
    outcome: req.body.outcome || "unknown",
    answer_poster_id: user_id,
    question_id: req.params.question_id
  };

  const checkIfQuestionBelongsToCompany = () => knex('interview_questions').where('id', req.params.question_id).andWhere('company_id', req.params.company_id).count('id as valid');
  const insertAnswer = () => knex('interview_answers').insert(newAnsObj);

  checkIfQuestionBelongsToCompany().then(result => {
    if (parseInt(result[0].valid)) { return insertAnswer(); }
    else { throw "provided company_id and question_id do not match."; }
  }).then(() => {
    res.send(true);
  }).catch(err => {
    console.error("Error inside postNewInterviewAnswer.js: ", err);
    res.send(false);
  });
};

module.exports = postNewInterviewAnswer;
