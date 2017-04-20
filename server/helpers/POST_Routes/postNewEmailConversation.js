const postNewEmailConversation = (req, res, knex, user_id) => {

  const verifyEmailQuery = () => knex('emails')
    .where(function() { this.where('emails.to_id', user_id).orWhere('emails.from_id', user_id) })
    .andWhere('id', req.params.email_id)
    .whereNull('deleted_at')
    .limit(1)
    .count('id as verifiedEmail');

  const insertNewEmailConversation = newConvObj => knex('email_conversations')
    .insert(newConvObj);

  verifyEmailQuery()
  .then(verifiedEmail => {
    if (parseInt(verifiedEmail[0].verifiedEmail)) {
      return insertNewEmailConversation({
        sender_id: user_id,
        content: req.body.content.trim(),
        email_id: req.params.email_id
      });
    } else {
      throw 'Email query not verified.';
    }
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewEmailConversation.js: ', err);
    res.send(false);
  });


};

module.exports = postNewEmailConversation;
