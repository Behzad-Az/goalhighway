const getCompanyPageJobs = (req, res, esClient, user_id) => {

  console.log("i'm here 6: ", req.params.company_id);

  const getJobs = () => {
    const body = {
      size: 10,
      from: parseInt(req.query.jobsoffset),
      query: {
        constant_score: {
          filter: {
            bool: {
              must: [
                { term: { 'company_id' : req.params.company_id.toLowerCase() } },
                { term: { expired: false } },
                { type: { value : 'job' } }
              ]
            }
          }
        }
      }
    };
    return esClient.search({ index: 'goalhwy_es_db', body });
  };

  getJobs()
  .then(results => res.send({ jobs: results.hits.hits }))
  .catch(err => {
    console.error('Error inside getCompanyPageJobs.js: ', err);
    res.send(false);
  });

};

module.exports = getCompanyPageJobs;
