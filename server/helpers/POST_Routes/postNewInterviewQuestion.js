const posNewInterviewQuestion = (req, res, knex, user_id) => {

  const question = req.body.question.trim();
  const answer = req.body.answer.trim();
  const outcome = req.body.outcome;
  const company_id = req.params.company_id;

  const validateAnswer = () => {
    if (answer) {
      return answer.length >= 5 && answer.length <= 500 &&
             answer.search(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/) == -1 &&
             ['Got the job', 'Unsuccessful', 'Unknown'].includes(outcome);
    } else {
      return true;
    }
  };

  const validateInputs = () => new Promise ((resolve, reject) => {
    if (
      question.length >= 5 && question.length <= 250 &&
      question.search(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/) == -1 &&
      company_id &&
      validateAnswer()
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const insertQuestion = (newQestionObj, trx) => knex('interview_questions')
    .transacting(trx)
    .insert(newQestionObj)
    .returning('id');

  const insertAnswer = (newAnsObj, trx) => knex('interview_answers')
    .transacting(trx)
    .insert(newAnsObj)
    .returning('id');

  // const removeQuestion = questionId => knex('interview_questions')
  //   .where('id', questionId)
  //   .del();


  knex.transaction(trx => {
    validateInputs()
    .then(() => {
      const newQestionObj = {
        question,
        poster_id: user_id,
        company_id
      };
      return insertQuestion(newQestionObj, trx);
    })
    .then(qId => {
      if (answer) {
        const newAnsObj = {
          answer,
          outcome,
          poster_id: user_id,
          question_id: qId[0]
        };
        return insertAnswer(newAnsObj, trx);
      } else {
        return [0];
      }
    })
    .then(() => trx.commit())
    .catch(err => {
      console.error('Error inside posNewInterviewQuestion.js', err);
      trx.rollback();
    });
  })
  .then(() => res.send(true))
  .catch(() => res.send(false));



  // validateInputs()
  // .then(() => insertQuestion({
  //   question,
  //   poster_id: user_id,
  //   company_id: req.params.company_id
  // }))
  // .then(qId => {
  //   question_id = qId[0];
  //   if (answer) {
  //     return insertAnswer({
  //       answer,
  //       outcome,
  //       poster_id: user_id,
  //       question_id
  //     });
  //   } else {
  //     return [0];
  //   }
  // })
  // .then(() => res.send(true))
  // .catch(err => {
  //   console.log('Error inside posNewInterviewQuestion.js: ', err);
  //   res.send(false);
  //   removeQuestion(question_id)
  //   .catch(err => console.log('Error inside posNewInterviewQuestion.js while rolling back: ', err));
  // });

};

module.exports = posNewInterviewQuestion;
