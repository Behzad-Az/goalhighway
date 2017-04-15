const updateUserProfile = (req, res, knex, user_id, googleMapsClient) => {

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      googleMapsClient.geocode({
        address: req.body.postalCode
      }, (err, response) => {
        if (!err && response.json.status === 'OK') {
          let coordinates = {
            lat: response.json.results[0].geometry.location.lat,
            lon: response.json.results[0].geometry.location.lng
          };
          resolve(coordinates);
        } else {
          reject('invalid postal code');
        }
      });
    });
  };

  const findInstProgId = (inst_id, prog_id) => {
    return knex('institution_program').select('id').where('inst_id', inst_id).andWhere('prog_id', prog_id);
  };

  let inst_prog_id;

  if (req.body.type === 'profile') {
    findInstProgId(req.body.instId, req.body.progId)
    .then(instProgId => {
      inst_prog_id = instProgId[0].id;
      let knexObj = {
        username: req.body.username,
        email: req.body.email,
        inst_prog_id,
        user_year: req.body.userYear
      };
      return knex('users').where('id', user_id).update(knexObj);
    })
    .then(() => {
      req.session.username = req.body.username;
      req.session.inst_prog_id = inst_prog_id;
      req.session.inst_id = req.body.instId;
      req.session.prog_id = req.body.progId;
      res.send(true);
    }).catch(err => {
      console.error('Error inside updateUserProfile.js: ', err);
      res.send(false);
    });
  } else if (req.body.type === 'job') {
    getLocation()
    .then(coordinates => {
      let knexObj = {
        lat: coordinates.lat,
        lon: coordinates.lon,
        postal_code: req.body.postalCode,
        job_distance: parseInt(req.body.jobDistance),
        job_kind: req.body.jobKind,
        job_query: req.body.jobQuery
      };
      return knex('users').where('id', user_id).update(knexObj);
    })
    .then(() => {
      res.send(true);
    }).catch(err => {
      console.error('Error inside updateUserProfile.js: ', err);
      res.send(false);
    });
  }
};

module.exports = updateUserProfile;
