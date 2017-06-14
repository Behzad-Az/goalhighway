const getCompanyPageTopRow = (req, res, knex, esClient) => {

  const getCompanyInfo = () => {
    const body = {
      size: 1,
      from: 0,
      query: {
        constant_score: {
          filter: {
            bool: {
              must: [
                { term: { '_id' : req.params.company_id } },
                { type: { value : 'company' } }
              ]
            }
          }
        }
      }
    };
    return esClient.search({ index: 'goalhwy_es_db', body });
  };

  const getAvgCompanyRating = () => knex('company_reviews')
    .where('company_id', req.params.company_id)
    .whereNull('deleted_at')
    .avg('overall_rating');

  Promise.all([
    getCompanyInfo(),
    getAvgCompanyRating()
  ])
  .then(results => {
    let companyInfo = results[0].hits.hits[0]._source;
    companyInfo.avgRating = results[1][0] ? Math.round(results[1][0].avg / 5 * 100) : 0;
    res.send({ companyInfo });
  })
  .catch(err => {
    console.error('Error inside getCompanyPageTopRow.js: ', err);
    res.send(false);
  });

};

module.exports = getCompanyPageTopRow;
