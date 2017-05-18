const postSearchBarResults = (req, res, knex, user_id, esClient) => {

  const search = (index, body) => esClient.search({ index, body });
  const query = req.body.query.trim();

  let docSearchBody = {
    size: 5,
    from: 0,
    query: {
      bool: {
        must: {
          multi_match: {
            query,
            fields: ['course_name^5', 'inst_name^2']
          }
        },
        should: {
          multi_match: {
            query,
            fields: ['kind^5', 'title']
          }
        },
        filter: [
          { type: { value: 'document' } },
          { term: { inst_id: req.session.inst_id } }
        ]
      }
    }
  };

  let courseSearchBody = {
    size: 5,
    from: 0,
    query: {
      bool: {
        must: {
          multi_match: {
            query,
            fields: ['title^5', 'inst_name', 'course_desc^2'],
            fuzziness: 'AUTO'
          }
        },
        filter: [
          { type: { value: 'course' } },
          { term: { inst_id: req.session.inst_id } }
        ]
      }
    }
  };

  let institutionSearchBody = {
    size: 2,
    from: 0,
    query: {
      bool: {
        must: {
          multi_match: {
            query,
            fields: ['inst_name'],
            fuzziness: 'AUTO'
          }
        },
        filter: {
          type: { value: 'institution' }
        }
      }
    }
  };

  let companySearchBody = {
    size: 2,
    from: 0,
    query: {
      bool: {
        must: {
          multi_match: {
            query,
            fields: ['company_name'],
            fuzziness: 'AUTO'
          }
        },
        filter: {
          type: { value: 'company' }
        }
      }
    }
  };

  Promise.all([
    search('search_catalogue', docSearchBody),
    search('search_catalogue', courseSearchBody),
    search('search_catalogue', institutionSearchBody),
    search('search_catalogue', companySearchBody)
  ]).then (results => {
    let output = results[0].hits.hits.concat(results[1].hits.hits).concat(results[2].hits.hits).concat(results[3].hits.hits);
    res.send(output);
  }).catch(err => {
    console.error('Error inside postSearchBarResults.js: ', err);
    res.send(false);
  });

};

module.exports = postSearchBarResults;
