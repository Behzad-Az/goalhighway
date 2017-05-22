const getCompanyPageJobs = (req, res, esClient, user_id) => {

  const getJobs = () => {
    const body = {
      size: 10,
      from: parseInt(req.query.jobsoffset),
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
    return esClient.search({ index: 'search_catalogue', body });
  };

  getJobs()
  .then(results => res.send({ jobs: results.hits.hits }))
  .catch(err => {
    console.error('Error inside getCompanyPageJobs.js: ', err);
    res.send(false);
  });

};

module.exports = getCompanyPageJobs;
