const checkEmailAvailability = (req, res, knex, user_id) => {

  const email = req.body.email.trim().toLowerCase();
  const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      email.length >= 6 && email.length <= 30 &&
      email.match(emailRegex)
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const checkEmail = () => knex('users')
    .where('email', email)
    .count('email as taken');

  validateInputs()
  .then(() => checkEmail())
  .then(result => parseInt(result[0].taken) ? res.send(false) : res.send(true))
  .catch(err => {
    console.error('Error inside checkEmailAvailability.js: ', err);
    res.send(false);
  });

};

module.exports = checkEmailAvailability;
