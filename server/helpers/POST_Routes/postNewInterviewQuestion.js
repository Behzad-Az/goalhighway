const posNewInterviewQuestion = (req, res, knex, user_id) => {
  let newQestionObj = {
    question: req.body.question,
    question_poster_id: user_id,
    company_id: req.params.company_id
  };

  const insertQuestion = () => knex('interview_questions').insert(newQestionObj).returning('id');

  const insertAnswer = questionId => new Promise((resolve, reject) => {
    if (req.body.answer) {
      let newAnsObj = {
        answer: req.body.answer,
        outcome: req.body.outcome || "unknown",
        answer_poster_id: user_id,
        question_id: questionId
      };
      knex('interview_answers').insert(newAnsObj).then(() =>{
        resolve();
      }).catch(err => {
        reject(err)
      });
    } else {
      resolve();
    }
  });

  insertQuestion().then(questionId => {
    return insertAnswer(questionId[0]);
  }).then(() => {
    res.send(true);
  }).catch(err => {
    console.log("Error inside posNewInterviewQuestion.js: ", err);
    res.send(false);
  });

};

module.exports = posNewInterviewQuestion;
