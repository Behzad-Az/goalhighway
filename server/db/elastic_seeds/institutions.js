'use strict';

const fs = require('fs');
const elasticsearch = require('elasticsearch');
const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});

const bulkIndex = function bulkIndex(index, type, data) {
  let body = [];

  data.forEach(item => {
    body.push({
      index: {
        _index: index,
        _type: type,
        _id: item.id
      }
    });
    body.push(item);
  });

  esClient.bulk({ body })
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
  const institutions = [
    { inst_id: 'KliraFQhB6c', inst_name: 'University of British Columbia (UBC)' },
    { inst_id: 'kuwXbFvFhtq', inst_name: 'Simon Fraser University (SFU)' }
  ];
  console.log(`${institutions.length} items parsed from data file`);
  bulkIndex('goalhwy_es_db', 'institution', institutions);
};

populate();
