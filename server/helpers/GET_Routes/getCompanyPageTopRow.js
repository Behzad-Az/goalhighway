const getCompanyPageTopRow = (req, res, knex, user_id) => {

  const getCompanyInfo = () => knex('companies')
    .select('id', 'name')
    .where('id', req.params.company_id)
    .whereNull('deleted_at');

  const getAvgCompanyRating = () => knex('company_reviews')
    .where('company_id', req.params.company_id)
    .whereNull('deleted_at')
    .avg('overall_rating');

  Promise.all([
    getCompanyInfo(),
    getAvgCompanyRating()
  ])
  .then(results => {
    let companyInfo = results[0][0];
    companyInfo.avgRating = results[1][0] ? Math.round(results[1][0].avg / 5 * 100) : 0;
    res.send({ companyInfo });
  })
  .catch(err => {
    console.error('Error inside getCompanyPageTopRow.js: ', err);
    res.send(false);
  });

};

module.exports = getCompanyPageTopRow;
