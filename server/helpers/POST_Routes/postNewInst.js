const postNewInst = (req, res, knex, user_id, esClient) => {

  const inst_long_name = req.body.instLongName.trim();
  const inst_short_name = req.body.instShortName.trim();

  const newInstObj = {
    inst_value: inst_long_name.toLowerCase().replace(/ /g, '_'),
    inst_display_name: inst_short_name ? inst_long_name + ` (${inst_short_name})` : inst_long_name,
    inst_long_name,
    inst_short_name,
    country: req.body.country.trim().toLowerCase(),
    province: req.body.province.trim().toLowerCase()
  };

  const checkForDuplicateInst = () => knex('institutions')
    .where('inst_long_name', inst_long_name)
    .andWhere('country', newInstObj.country)
    .andWhere('province', newInstObj.province)
    .count('id as duplicate');

  const insertInst = trx => knex('institutions')
    .transacting(trx)
    .insert(newInstObj)
    .returning('id');

  const addInstToElasticSearch = esInstObj => {
    const indexObj = {
      index: {
        _index: 'search_catalogue',
        _type: 'institution',
        _id: esInstObj.id
      }
    };
    return esClient.bulk({ body: [indexObj, esInstObj] })
  };

  knex.transaction(trx => {
    checkForDuplicateInst()
    .then(count => {
      if (parseInt(count[0].duplicate)) { throw 'Institution already exists'; }
      else { return insertInst(trx); }
    })
    .then(instId => {
      const esInstObj = {
        id: instId[0],
        inst_name: `${inst_long_name} ${inst_short_name}`
      };
      return addInstToElasticSearch(esInstObj);
    })
    .then(response => {
      let errorCount = response.items.reduce((count, item) => item.index && item.index.error ? 1 : 0, 0);
      if (errorCount) { throw 'Could not upload to elastic search db'; }
      else { return; }
    })
    .then(() => trx.commit())
    .catch(err => {
      trx.rollback();
      throw err;
    });
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewInst.js', err);
    res.send(false);
  });

};

module.exports = postNewInst;
