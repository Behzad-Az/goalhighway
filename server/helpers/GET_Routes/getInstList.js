const getInstList = (req, res, knex, user_id) => {
  knex('institutions')
  .select('id', 'inst_display_name')
  .whereNull('deleted_at')
  .orderBy('inst_value')
  .then(institutions => res.send(institutions))
  .catch(err => {
    console.error('Error inside getInstList.js: ', err);
    res.send(false);
  });
};

module.exports = getInstList;
