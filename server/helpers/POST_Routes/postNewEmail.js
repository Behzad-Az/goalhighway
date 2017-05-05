const postNewEmail = (req, res, knex, user_id) => {

  const subject = req.body.subject.trim();
  const content = req.body.content.trim();

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      subject.length >= 3 && subject.length <= 60 &&
      subject.search(/[^a-zA-Z0-9\ \!\@\$\#\&\*\(\)\_\-\\/\\~\:\"\'\,\.\[\]\|]/) == -1 &&
      content.length >= 3 && content.length <= 500 &&
      content.search(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/) == -1 &&
      ['itemForSale', 'tutorReq', 'resumeReview'].includes(req.body.type) &&
      req.body.toId &&
      req.body.objId
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const insertNewEmail = (newEmailObj, trx) => knex('emails')
    .transacting(trx)
    .insert(newEmailObj)
    .returning('id');

  const insertNewEmailConversation = (newConversationObj, trx) => knex('email_conversations')
    .transacting(trx)
    .insert(newConversationObj);

  const determineEmailType = trx => {
    if (req.body.toId == user_id) {
      throw 'User cannot email self';
    } else {
      switch (req.body.type) {
        case 'itemForSale':
          return knex('items_for_sale')
            .transacting(trx)
            .where('id', req.body.objId)
            .andWhere('owner_id', req.body.toId)
            .whereNull('deleted_at')
            .limit(1)
            .count('id as verifiedEmail');
        case 'tutorReq':
          return knex('tutor_log')
            .transacting(trx)
            .where('id', req.body.objId)
            .andWhere('student_id', req.body.toId)
            .whereNull('closed_at')
            .whereNull('closure_reason')
            .limit(1)
            .count('id as verifiedEmail');
        case 'resumeReview':
          return knex('resumes')
            .transacting(trx)
            .where('id', req.body.objId)
            .andWhere('owner_id', req.body.toId)
            .whereNull('deleted_at')
            .whereNotNull('review_requested_at')
            .limit(1)
            .count('id as verifiedEmail');
        default:
          throw 'Unable to validate email parameters';
      }
    }
  };

  knex.transaction(trx => {
    validateInputs()
    .then(() => determineEmailType(trx))
    .then(verifiedEmail => {
      if (parseInt(verifiedEmail[0].verifiedEmail)) {
        let newEmailObj = {
          subject,
          to_id: req.body.toId,
          from_id: user_id,
        };
        return insertNewEmail(newEmailObj, trx);
      } else {
        throw 'Email parameters not valid.';
      }
    })
    .then(emailId => {
      let newConversationObj = {
        content,
        sender_id: user_id,
        email_id: emailId[0]
      };
      return insertNewEmailConversation(newConversationObj, trx);
    })
    .then(() => trx.commit())
    .catch(err => {
      console.error('Error inside postNewEmail.js: ', err);
      trx.rollback();
    });
  })
  .then(() => res.send(true))
  .catch(err => res.send(false));

};

module.exports = postNewEmail;
