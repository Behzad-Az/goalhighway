'use strict';

const fs = require('fs');
const elasticsearch = require('elasticsearch');
const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});

const newIndex = {
  index: 'goalhwy_es_db',
  body: {
    mappings: {
      job: {
        properties: {
          created_at: { type: 'date', format: 'yyyy-mm-dd' },
          location: { type: 'geo_point' },
          title: { type: 'string' },
          kind: { type: 'string' },
          link: { type: 'string' },
          photo_name: { type: 'string' },
          company_name: { type: 'string' },
          company_id: { type: 'string' },
          search_text: { type: 'string' },
          expired: { type: 'boolean' }
        }
      },
      course: {
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          course_desc: { type: 'string' },
          inst_id: { type: 'string' },
          inst_name: { type: 'string' }
        }
      },
      document: {
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          kind: { type: 'string' },
          inst_id: { type: 'string' },
          inst_name: { type: 'string' },
          course_id: { type: 'string' },
          course_name: { type: 'string' }
        },
      },
      company: {
        properties: {
          id: { type: 'string' },
          name: { type: 'string' }
        }
      },
      institution: {
        properties: {
          id: { type: 'string' },
          name: { type: 'string' }
        }
      }
    }
  }
};

const bulkIndex = function bulkIndex(index, type, data) {
  let body = [];

  data.forEach(item => {
    const today = new Date();
    item.created_at = today.toISOString().slice(0, 10);
    body.push({
      index: {
        _index: index,
        _type: type
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

const populateElasticData = () => {
  const jobsRaw = fs.readFileSync('jobs.json');
  const jobs = JSON.parse(jobsRaw);
  console.log(`${jobs.length} items parsed from data file`);
  bulkIndex('goalhwy_es_db', 'job', jobs);
};

esClient.indices.delete({ index: 'goalhwy_es_db' })
.then(() => esClient.indices.create(newIndex))
.then(() => populateElasticData())
.catch(err => console.error('Error isnide jobs.js: ', err));
