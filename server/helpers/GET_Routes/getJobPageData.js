const getJobPageData = (req, res, knex, user_id, esClient) => {

  const getQueryInfo = () => knex('users').select('job_kind', 'job_distance', 'job_query', 'lat', 'lon').where('id', user_id);
  const search = (index, body) => esClient.search({index: index, body: body});

  getQueryInfo().then(queryInfo => {

    let jobSearchBody = {
      size: 100,
      from: 0,
      query: {
        bool : {
          must: {
            multi_match: {
              query: queryInfo[0].job_query || "",
              fields: ["pin.title^3", "pin.search_text"],
              fuzziness: "AUTO"
            }
          },
          filter: [
            {
              geo_distance : {
                  distance : `${queryInfo[0].job_distance || 40}km`,
                  "pin.location" : {
                    lat : queryInfo[0].lat || 49.198215,
                    lon : queryInfo[0].lon || -123.007668
                  }
              }
          },
          { match:  { "pin.kind": queryInfo[0].job_kind || "internship summer senior junior" } },
          { type: { value: "job" } }
          ]
        }
      }
    };

    return search("search_catalogue", jobSearchBody)
  }).then(results => {
    res.send(results.hits.hits);
  }).catch(err => {
    console.error("Error inside getJobPageData.js: ", err);
    res.send(false);
  });

};

module.exports = getJobPageData;
