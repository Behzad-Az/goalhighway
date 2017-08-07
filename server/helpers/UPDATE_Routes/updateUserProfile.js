const updateUserProfile = (req, res, knex, user_id, googleMapsClient) => {

  let updatedUserObj;

  const validateProfileInputs = (username, email) => new Promise ((resolve, reject) => {
    const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (
      username.length >= 3 && username.length <= 30 &&
      username.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) == -1 &&
      email.length >= 6 && email.length <= 30 &&
      email.match(emailRegex) &&
      [1, 2, 3, 4, 5, 6].includes(parseInt(req.body.userYear)) &&
      req.body.instId &&
      req.body.progId
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const validateJobQueryInputs = (postal_code, job_distance, job_kind, job_query) => new Promise((resolve, reject) => {
    if (
      postal_code.length >= 5 && postal_code.length <= 10 &&
      postal_code.search(/[^a-zA-Z0-9\ ]/) == -1 &&
      [10, 20, 30, 50, 100, 9000].includes(job_distance) &&
      job_kind.length >= 3 && job_kind.length <= 100 &&
      job_kind.search(/[^a-zA-Z\ \-\_]/) == -1 &&
      job_query.length >= 3 && job_query.length <= 250 &&
      job_query.search(/[^a-zA-Z\ \-\_]/) == -1
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const getLocation = postal_code => {
    return new Promise((resolve, reject) => {
      googleMapsClient.geocode({
        address: postal_code
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

  const findInstProgId = (inst_id, prog_id) => knex('institution_program')
    .select('id')
    .where('inst_id', inst_id)
    .andWhere('prog_id', prog_id)
    .whereNull('deleted_at');

  const determinePhotoName = () => new Promise((resolve, reject) => {
    if (req.file && req.file.filename) {
      resolve(req.file.filename);
    } else {
      knex('users').where('id', user_id).select('photo_name')
      .then(user => resolve(user[0].photo_name))
      .catch(err => reject('could not find the photo_name for user: ', err));
    }
  });

  const knexUpdateUser = updatedObj => knex('users')
    .where('id', user_id)
    .whereNull('deleted_at')
    .update(updatedObj);

  if (req.body.type === 'profile') {
    const username = req.body.username.trim().toLowerCase();
    const email = req.body.email.trim().toLowerCase();

    validateProfileInputs(username, email)
    .then(() => Promise.all([ findInstProgId(req.body.instId, req.body.progId), determinePhotoName() ]))
    .then(results => {
      updatedUserObj = {
        username: req.body.username,
        email: req.body.email,
        inst_prog_id: results[0][0].id,
        user_year: req.body.userYear,
        photo_name: results[1]
      };
      return knexUpdateUser(updatedUserObj);
    })
    .then(() => {
      req.session.username = updatedUserObj.username;
      req.session.email = updatedUserObj.email;
      req.session.inst_prog_id = updatedUserObj.inst_prog_id;
      req.session.inst_id = req.body.instId;
      req.session.prog_id = req.body.progId;
      req.session.user_year = updatedUserObj.user_year;
      req.session.photo_name = updatedUserObj.photo_name;
      res.send(true);
    }).catch(err => {
      console.error('Error inside updateUserProfile.js: ', err);
      res.send(false);
    });
  } else if (req.body.type === 'job') {
    const postal_code = req.body.postalCode.toUpperCase().trim();
    const job_distance = parseInt(req.body.jobDistance);
    const job_kind = req.body.jobKind.toLowerCase().trim();
    const job_query = req.body.jobQuery.toLowerCase().trim();

    validateJobQueryInputs(postal_code, job_distance, job_kind, job_query)
    .then(() => getLocation(postal_code))
    .then(coordinates => {
      updatedUserObj = {
        lat: coordinates.lat,
        lon: coordinates.lon,
        postal_code,
        job_distance,
        job_kind,
        job_query
      };
      return knexUpdateUser(updatedUserObj);
    })
    .then(() => {
      req.session.postal_code = updatedUserObj.postal_code;
      req.session.lat = updatedUserObj.lat;
      req.session.lon = updatedUserObj.lon;
      req.session.job_kind = updatedUserObj.job_kind;
      req.session.job_query = updatedUserObj.job_query;
      req.session.job_distance = updatedUserObj.job_distance;
      res.send(true);
    })
    .catch(err => {
      console.error('Error inside updateUserProfile.js: ', err);
      res.send(false);
    });
  } else {
    console.error('Error inside updateUserProfile.js: Invalid request type');
    res.send(false);
  }

};

module.exports = updateUserProfile;
