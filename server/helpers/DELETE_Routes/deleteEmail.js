const deleteEmail = (req, res, knex, user_id) => {

  const authorizeDeletion = () => knex('emails')
    .where(function() { this.where('to_id', user_id).orWhere('from_id', user_id) })
    .andWhere('id', req.params.email_id)
    .whereNull('deleted_at')
    .limit(1)
    .count('id as authorized');

  const determineDeleteInstructions = () => new Promise((resolve, reject) => {
    knex('email_conversations').select('deleted_one', 'deleted_two').where('email_id', req.params.email_id).orderBy('created_at', 'desc').limit(1).then(result => {
      let conversation = result[0];
      if (conversation.deleted_one == user_id || conversation.deleted_two == user_id) {
        reject('User has already deleted this email chain.');
      } else if (!conversation.deleted_one && conversation.deleted_two) {
        resolve({
          convUpdateObj: { deleted_one: user_id },
          deleteEmail: true
        });
      } else if (conversation.deleted_one && !conversation.deleted_two) {
        resolve({
          convUpdateObj: { deleted_two: user_id },
          deleteEmail: true
        });
      } else {
        resolve({
          convUpdateObj: { deleted_one: user_id },
          deleteEmail: false
        });
      }
    })
    .catch(err => reject(err));
  });

  const deleteConversations = convUpdateObj => knex('email_conversations')
    .where('email_id', req.params.email_id)
    .update(convUpdateObj);

  const deleteAllEmail = () => knex('emails')
    .where(function() { this.where('to_id', user_id).orWhere('from_id', user_id) })
    .andWhere('id', req.params.email_id)
    .whereNull('deleted_at')
    .update({ deleted_at: knex.fn.now() });

  authorizeDeletion()
  .then(authorized => {
    if (parseInt(authorized[0].authorized)) { return determineDeleteInstructions(); }
    else { throw 'User not authorized to delete this email chain'; }
  })
  .then(instructions => instructions.deleteEmail ? Promise.all([ deleteConversations(instructions.convUpdateObj), deleteAllEmail() ]) : deleteConversations(instructions.convUpdateObj))
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside deleteEmail.js: ', err);
    res.send(false);
  });

};

module.exports = deleteEmail;
