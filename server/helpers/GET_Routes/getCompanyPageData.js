const getCompanyPageData = (req, res, knex, user_id, esClient) => {

  let companyInfo, questions, jobs;

  const getCompanyProfile = () => knex('companies').where('id', req.params.company_id);

  const getQuestions = () => knex('interview_questions').where('company_id', req.params.company_id).whereNull('interview_questions.question_deleted_at');

  const getAnswers = question => new Promise((resolve, reject) => {
    knex('interview_answers').where('question_id', question.id).whereNull('interview_answers.answer_deleted_at').then(rows => {
      question.answers = rows;
      resolve();
    }).catch(err => {
      reject(err);
    });
  });


  const getJobs = () => {
    const body = {
      size: 100,
      from: 0,
      query: {
        constant_score: {
          filter: {
            bool: {
              must: [
                { term: { "pin.company_id" : req.params.company_id } },
                { type: { value : "job" } }
              ]
            }
          }
        }
      }
    };
    const index = 'search_catalogue';
    return esClient.search({ index, body });
  };

  Promise.all([
    getCompanyProfile(),
    getQuestions(),
    getJobs()
  ]).then(results => {
    companyInfo = results[0][0];
    questions = results[1];
    jobs = results[2].hits.hits;
    let promiseArr = questions.map(question => getAnswers(question));
    return Promise.all(promiseArr);
  }).then(() => {
    res.send({ companyInfo, questions, jobs });
  }).catch(err => {
    console.error("Error inside getCompanyPageData.js: ", err);
    res.send(false);
  });

};

module.exports = getCompanyPageData;
