const randIdString = require('random-base64-string');

const postNewResume = (req, res, knex, user_id) => {

  const title = req.body.title.trim();
  const intent = req.body.intent.trim();

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      title.length >= 3 && title.length <= 60 &&
      title.search(/[^a-zA-Z0-9\ \#\&\*\(\)\_\-\\/\\~\:\"\'\,\.\[\]\|]/) == -1 &&
      intent.length >= 3 && intent.length <= 250 &&
      intent.search(/[^a-zA-Z0-9\ \#\&\*\(\)\_\-\\/\\~\:\"\'\,\.\[\]\|]/) == -1 &&
      req.session.inst_prog_id
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const insertResume = newResumeObj => knex('resumes')
    .insert(newResumeObj);

  validateInputs()
  .then(() => insertResume({
    id: randIdString(11),
    title,
    intent,
    file_name: req.file.filename,
    audience_filter_id: req.session.inst_prog_id,
    audience_filter_table: 'institution_program',
    owner_id: user_id
  }))
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewResume.js: ', err);
    res.send(false);
  });

};

module.exports = postNewResume;
