const postNewEmail = (req, res, knex, user_id) => {

  insertNewEmail = (newEmailObj, trx) => knex('emails')
    .transacting(trx)
    .insert(newEmailObj)
    .returning('id');

  insertNewEmailConversation = (newConversationObj, trx) => knex('email_conversations')
    .transacting(trx)
    .insert(newConversationObj);

  let newEmailObj = {
    subject: req.body.subject.trim(),
    to_id: req.body.toId,
    from_id: user_id,
  };

  knex.transaction(trx => {
    insertNewEmail(newEmailObj, trx)
    .then(emailId => {
      let newConversationObj = {
        content: req.body.content.trim(),
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
