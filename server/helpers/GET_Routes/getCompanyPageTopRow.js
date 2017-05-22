const getCompanyPageTopRow = (req, res, knex, user_id) => {

  const getCompanyInfo = () => knex('companies')
    .select('id', 'name')
    .where('id', req.params.company_id)
    .whereNull('deleted_at');

  getCompanyInfo()
  .then(results => res.send({ companyInfo: results[0] }))
  .catch(err => {
    console.error('Error inside getCompanyPageTopRow.js: ', err);
    res.send(false);
  });

};

module.exports = getCompanyPageTopRow;
