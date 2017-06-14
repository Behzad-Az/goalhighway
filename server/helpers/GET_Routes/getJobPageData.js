const getJobPageData = (req, res, knex, user_id, esClient) => {

  let resumes = [], jobs = [];

  const getQueryInfo = () => knex('users')
    .select('job_kind', 'job_distance', 'job_query', 'lat', 'lon')
    .where('id', user_id)
    .whereNull('deleted_at')
    .limit(1);

  const getUserResumes = () => knex('resumes')
    .where('owner_id', user_id)
    .whereNull('deleted_at')
    .orderBy('created_at', 'desc');

  const getJobs = userInfo => {
    const body = {
      size: 100,
      from: 0,
      query: {
        bool : {
          must: {
            multi_match: {
              query: userInfo.job_query || 'engineer scientist market finance',
              fields: ['title^3', 'search_text'],
              fuzziness: 'AUTO'
            }
          },
          filter: [
            {
              geo_distance : {
                  distance : `${userInfo.job_distance || 40}km`,
                  location : {
                    lat : userInfo.lat || 49.198215,
                    lon : userInfo.lon || -123.007668
                  }
              }
            },
            { match: { kind: userInfo.job_kind || 'internship summer junior' } },
            {
              bool: {
                must: [
                  { term: { expired: false } },
                  { type: { value : 'job' } }
                ]
              }
            }
          ]
        }
      }
    };
    return esClient.search({ index: 'goalhwy_es_db', body });
  };

  Promise.all([
    getQueryInfo(),
    getUserResumes()
  ])
  .then(results => {
    resumes = results[1];
    return getJobs(results[0][0]);
  })
  .then(jobs => res.send({ jobs: jobs.hits.hits, resumes }))
  .catch(err => {
    console.error('Error inside getJobPageData.js: ', err);
    res.send(false);
  });

};

module.exports = getJobPageData;
