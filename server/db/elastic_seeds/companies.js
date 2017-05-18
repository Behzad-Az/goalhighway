'use strict';

const fs = require('fs');
const elasticsearch = require('elasticsearch');
const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});

const bulkIndex = function bulkIndex(index, type, data) {
  let bulkBody = [];

  data.forEach(item => {
    bulkBody.push({
      index: {
        _index: index,
        _type: type,
        _id: item.id
      }
    });

    bulkBody.push(item);
  });

  esClient.bulk({body: bulkBody})
  .then(response => {
    let errorCount = 0;
    response.items.forEach(item => {
      if (item.index && item.index.error) {
        console.log(++errorCount, item.index.error);
      }
    });
    console.log(`Successfully indexed ${data.length - errorCount} out of ${data.length} items`);
  })
  .catch(console.err);
};

const populate = function populate() {
  const companies = [
    { id: 1, company_name: 'Hokme Inc.' },
    { id: 2, company_name: 'Ballard Power Systems' },
    { id: 3, company_name: 'Apple Inc.' },
    { id: 4, company_name: 'NCIS Facility - UBC' }
  ];
  console.log(`${companies.length} items parsed from data file`);
  bulkIndex('search_catalogue', 'company', companies);
};

populate();
