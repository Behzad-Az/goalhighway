const postNewFlag = (req, res, knex, user_id) => {

  let newFlagObj = {
    reason: req.body.flagReason,
    foreign_id: req.params.foreign_id,
    foreign_table: req.params.foreign_table,
    flagger_id: user_id
  };

  const tableFlags = {
    revisions: ['inappropriate content', 'does not belong to this course', 'corrupted file or unreadable', 'other'],
    jobs: ['expired link', 'poor categorization', 'other'],
    interview_questions: ['inappropriate content', 'other'],
    interview_answers: ['inappropriate content', 'other']
  };

  const checkForPrevFlag = () => knex('flags')
    .where('flagger_id', user_id)
    .andWhere('foreign_table', newFlagObj.foreign_table)
    .andWhere('foreign_id', newFlagObj.foreign_id)
    .count('id as present');

  const insertFlag = () => knex('flags').insert(newFlagObj);

  const checkValidity = () => new Promise((resolve, reject) => {
    let tableName = newFlagObj.foreign_table;
    if (tableFlags[tableName] && tableFlags[tableName].includes(newFlagObj.reason)) { resolve(); }
    else { reject('Table name or reason does not exist'); }
  });

  checkValidity()
  .then(() => checkForPrevFlag())
  .then(previous => {
    if (parseInt(previous[0].present)) { throw 'user has already flagged this item'; }
    else { return insertFlag(); }
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewFlag.js: ', err);
    res.send(false);
  });

};

module.exports = postNewFlag;
