const getCompanyPageData = (req, res, knex, user_id, esClient) => {

  let companyInfo, jobs;

  const getCompanyProfile = () => knex('companies')
    .where('id', req.params.company_id)
    .whereNull('deleted_at');

  const getQuestions = () => knex('interview_questions')
    .where('company_id', req.params.company_id)
    .whereNull('deleted_at');

  const getAnswers = question => new Promise((resolve, reject) => {
    knex('interview_answers')
    .where('question_id', question.id)
    .whereNull('deleted_at')
    .then(rows => {
      question.answers = rows;
      resolve(question);
    })
    .catch(err => reject('Unable to get answers for interview question: ', err));
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
                { term: { 'pin.company_id' : req.params.company_id } },
                { type: { value : 'job' } }
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
  ])
  .then(results => {
    companyInfo = results[0][0];
    jobs = results[2].hits.hits;
    return Promise.all(results[1].map(qa => getAnswers(qa)));
  })
  .then(qas => res.send({ companyInfo, qas, jobs }))
  .catch(err => {
    console.error('Error inside getCompanyPageData.js: ', err);
    res.send(false);
  });

};

module.exports = getCompanyPageData;
