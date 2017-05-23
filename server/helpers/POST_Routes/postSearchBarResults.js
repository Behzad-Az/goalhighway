const postSearchBarResults = (req, res, knex, user_id, esClient) => {

  const search = (index, body) => esClient.search({ index, body });
  const query = req.body.query.trim();

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      query.length >= 3 && query.length <= 40 &&
      query.search(/[^a-zA-Z\ \-\(\)\'\\/\\.]/) == -1
    ) {
      resolve();
    } else {
      reject('Invalid search query.');
    }
  });

  const docSearchBody = {
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

  const courseSearchBody = {
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

  const institutionSearchBody = {
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

  const companySearchBody = {
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

  validateInputs()
  .then(() => Promise.all([
    search('search_catalogue', docSearchBody),
    search('search_catalogue', courseSearchBody),
    search('search_catalogue', institutionSearchBody),
    search('search_catalogue', companySearchBody)
  ]))
  .then (results => res.send({
    searchResults: results[0].hits.hits.concat(results[1].hits.hits).concat(results[2].hits.hits).concat(results[3].hits.hits)
  }))
  .catch(err => {
    console.error('Error inside postSearchBarResults.js: ', err);
    res.send(false);
  });

};

module.exports = postSearchBarResults;
