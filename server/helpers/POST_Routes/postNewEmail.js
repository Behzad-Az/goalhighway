const postNewEmail = (req, res, knex, user_id) => {

  const insertNewEmail = (newEmailObj, trx) => knex('emails')
    .transacting(trx)
    .insert(newEmailObj)
    .returning('id');

  const insertNewEmailConversation = (newConversationObj, trx) => knex('email_conversations')
    .transacting(trx)
    .insert(newConversationObj);

  const determineEmailType = () => new Promise((resolve, reject) => {
    switch (req.body.type) {
      case 'itemForSale':
        resolve('items_for_sale');
        break;
      default:
        reject('Invalid type provided');
        break;
    }
  });

  const verifyEmailQuery = (tableName, trx) => knex(tableName)
    .transacting(trx)
    .where('id', req.body.objId)
    .andWhere('owner_id', req.body.toId)
    .whereNull('deleted_at')
    .limit(1)
    .count('id as verifiedEmail');

  knex.transaction(trx => {
    determineEmailType()
    .then(tableName => verifyEmailQuery(tableName))
    .then(verifiedEmail => {
      if (parseInt(verifiedEmail[0].verifiedEmail)) {
        let newEmailObj = {
          subject: req.body.subject.trim(),
          to_id: req.body.toId,
          from_id: user_id,
        };
        return insertNewEmail(newEmailObj, trx);
      } else {
        throw 'Email query not verified.';
      }
    })
    .then(emailId => {
      let newConversationObj = {
        content: req.body.content.trim(),
        sender_id: user_id,
        email_id: emailId[0]
      };
      return insertNewEmailConversation(newConversationObj, trx);
    })
    .then(() => trx.commit())
    .catch(err => {
      trx.rollback();
      throw err;
    });
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewEmail.js', err);
    res.send(false);
  });

};

module.exports = postNewEmail;
