// const fs = require('fs');
// const elasticsearch = require('elasticsearch');
// const esClient = new elasticsearch.Client({
//   host: '127.0.0.1:9200',
//   log: 'error'
// });

// const body = {
//   aggs: {
//     count_by_type: {
//       terms: {
//         field: "_type"
//       }
//     }
//   },
//   size: 0
// };

// const search = (index, body) => esClient.search({index: index, body: body});

// search('search_catalogue', body).then(results => {
//   let count = results.aggregations.count_by_type.buckets.find(item => item.key === "job").doc_count;
//   console.log(count);
// }).catch(err => {
//   console.error("Error inside test.js: ", err);
// });


const fs = require('fs');
const elasticsearch = require('elasticsearch');
const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});

const body = {
  size: 100,
  from: 0,
  // query: {
  //   match: {
  //     company: "ballard power systems"
  //   }
  // }
  query: {
    constant_score: {
      filter: {
        bool: {
          must: [
            { term: { "pin.company_id" : 1 } },
            { type: { value : "job" } }
          ]
        }
      }
    }
  }
};

const search = (index, body) => esClient.search({index: index, body: body});

search('search_catalogue', body).then(results => {
  // let count = results.aggregations.count_by_type.buckets.find(item => item.key === "job").doc_count;
  console.log(results.hits.hits);
}).catch(err => {
  console.error("Error inside test.js: ", err);
});
