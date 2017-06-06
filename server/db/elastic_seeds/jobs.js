'use strict';

const fs = require('fs');
const elasticsearch = require('elasticsearch');
const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});

const deleteIndex = {
  index: '_all'
};

const newIndex = {
  index: 'search_catalogue',
  body: {
    'mappings': {
      'job': {
        'properties': {
          'pin': {
            'properties': {
              'location': { 'type': 'geo_point' },
              'id': { 'type': 'integer' },
              'title': { 'type': 'string' },
              'kind': { 'type': 'string' },
              'link': { 'type': 'string' },
              'photo_name': { 'type': 'string' },
              'company_name': { 'type': 'string' },
              'company_id': { 'type': 'integer' },
              'search_text': { 'type': 'string' }
            }
          }
        }
      }
    }
  }
};

const bulkIndex = function bulkIndex(index, type, data) {
  let bulkBody = [];

  data.forEach(item => {
    bulkBody.push({
      index: {
        _index: index,
        _type: type,
        _id: item.pin.id
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
  const jobsRaw = fs.readFileSync('jobs.json');
  const jobs = JSON.parse(jobsRaw);
  console.log(`${jobs.length} items parsed from data file`);
  bulkIndex('search_catalogue', 'job', jobs);
};

esClient.indices.delete(deleteIndex).then(() => esClient.indices.create(newIndex)).then(() => populate());
