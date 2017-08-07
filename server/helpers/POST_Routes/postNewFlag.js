const postNewFlag = (req, res, knex, user_id, randIdString) => {

  const acceptedFlags = {
    revisions: ['inappropriate content', 'does not belong to this course', 'corrupted file or unreadable', 'spam', 'other'],
    jobs: ['expired link', 'poor categorization', 'spam', 'other'],
    interview_questions: ['inappropriate content', 'spam', 'other'],
    interview_answers: ['inappropriate content', 'spam', 'other'],
    course_feed: ['inappropriate content', 'spam', 'other'],
    resumes: ['inappropriate content', 'spam', 'other']
  };
  const reason = req.body.flagReason;
  const foreign_table = req.params.foreign_table;
  const foreign_id = req.params.foreign_id;

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      foreign_table &&
      foreign_id.length === 11 &&
      acceptedFlags[foreign_table] &&
      acceptedFlags[foreign_table].includes(reason)
    ) {
      resolve();
    } else {
      reject('Invalid flag parameters');
    }
  });

  const checkForDuplicateFlag = () => knex('flags')
    .where('flagger_id', user_id)
    .andWhere('foreign_table', foreign_table)
    .andWhere('foreign_id', foreign_id)
    .count('id as duplicate');

  const insertFlag = newFlagObj => knex('flags')
    .insert(newFlagObj);

  validateInputs()
  .then(() => checkForDuplicateFlag())
  .then(result => {
    if (parseInt(result[0].duplicate)) {
      throw 'user has already flagged this entry';
    } else {
      return insertFlag({
        id: randIdString(11),
        reason,
        foreign_id,
        foreign_table,
        flagger_id: user_id
      });
    }
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewFlag.js: ', err);
    res.send(false);
  });

};

module.exports = postNewFlag;
