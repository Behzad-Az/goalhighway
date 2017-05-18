const postNewInst = (req, res, knex, user_id, esClient) => {

  const provinceList = {
      canada: ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Saskatchewan', 'Yukon'],
      united_states: [
        'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO',
        'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'
      ]
    };

  const inst_long_name = req.body.instLongName.trim();
  const inst_short_name = req.body.instShortName.trim() || 'not avail.';

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      inst_long_name.length >= 5 && inst_long_name.length <= 60 &&
      inst_long_name.search(/[^a-zA-Z\ \-\'\.]/) == -1 &&
      inst_short_name.length >= 2 && inst_short_name.length <= 10 &&
      inst_short_name.search(/[^a-zA-Z\ \-\'\.]/) == -1 &&
      provinceList[req.body.country] && provinceList[req.body.country].includes(req.body.province)
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const checkForDuplicateInst = () => knex('institutions')
    .where('inst_long_name', inst_long_name)
    .andWhere('country', req.body.country)
    .andWhere('province', req.body.province)
    .count('id as duplicate');

  const insertInst = (newInstObj, trx) => knex('institutions')
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
    validateInputs()
    .then(() => checkForDuplicateInst())
    .then(count => {
      if (parseInt(count[0].duplicate)) {
        throw 'Institution already exists';
      } else {
        let newInstObj = {
          inst_value: inst_long_name.toLowerCase().replace(/ /g, '_'),
          inst_display_name: inst_short_name === 'not avail.' ? inst_long_name : inst_long_name + ` (${inst_short_name})`,
          inst_long_name,
          inst_short_name,
          country: req.body.country,
          province: req.body.province
        };
        return insertInst(newInstObj, trx);
      }
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
      console.error('Error inside postNewInst.js: ', err);
      trx.rollback();
    });
  })
  .then(() => res.send(true))
  .catch(() => res.send(false));

};

module.exports = postNewInst;
