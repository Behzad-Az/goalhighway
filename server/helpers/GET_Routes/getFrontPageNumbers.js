const getFrontPageNumbers = (req, res, knex, esClient) => {

  const getCoursesCount = () => knex('courses')
    .whereNull('deleted_at')
    .count('id');

  const getRevCount = () => knex('revisions')
    .whereNull('deleted_at')
    .count('id');

  const getJobsCount = () => {
    const body = {
      query: {
        constant_score: {
          filter: {
            bool: {
              must: [
                { term: { expired: false } },
                { type: { value : 'job' } }
              ]
            }
          }
        }
      }
    };
    return esClient.search({ index: 'goalhwy_es_db', body });
  };

  Promise.all([ getRevCount(), getCoursesCount(), getJobsCount() ])
  .then(results => res.send({
    courseCount: results[0][0].count,
    revCount: results[1][0].count,
    jobCount: results[2].hits.total
  }))
  .catch(err => {
    console.error('Error inside getFrontPageNumbers.js: ', err);
    res.send(false);
  });

};

module.exports = getFrontPageNumbers;
