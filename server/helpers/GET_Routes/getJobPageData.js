const getJobPageData = (req, res, knex, user_id, esClient) => {

  let resumes = [];

  const getQueryInfo = () => knex('users')
    .select('job_kind', 'job_distance', 'job_query', 'lat', 'lon')
    .where('id', user_id);

  const getUserResumes = () => knex('resumes')
    .where('user_id', user_id)
    .whereNull('resume_deleted_at')
    .orderBy('resume_created_at', 'desc');

  const search = (index, body) => esClient.search({index: index, body: body});

  Promise.all([
    getQueryInfo(),
    getUserResumes(),
  ])
  .then(results => {
    resumes = results[1];
    let jobSearchBody = {
      size: 100,
      from: 0,
      query: {
        bool : {
          must: {
            multi_match: {
              query: results[0][0].job_query || "",
              fields: ["pin.title^3", "pin.search_text"],
              fuzziness: "AUTO"
            }
          },
          filter: [
            {
              geo_distance : {
                  distance : `${results[0][0].job_distance || 40}km`,
                  "pin.location" : {
                    lat : results[0][0].lat || 49.198215,
                    lon : results[0][0].lon || -123.007668
                  }
              }
          },
          { match:  { "pin.kind": results[0][0].job_kind || "internship summer senior junior" } },
          { type: { value: "job" } }
          ]
        }
      }
    };
    return search("search_catalogue", jobSearchBody)
  }).then(jobs => {
    res.send({ jobs: jobs.hits.hits, resumes });
  }).catch(err => {
    console.error("Error inside getJobPageData.js: ", err);
    res.send(false);
  });

};

module.exports = getJobPageData;
