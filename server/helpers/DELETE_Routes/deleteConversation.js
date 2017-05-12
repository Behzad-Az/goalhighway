const deleteConversation = (req, res, knex, user_id) => {

  const removeConversationMember = () => knex('conversation_members')
    .where('conversation_id', req.params.conversation_id)
    .andWhere('user_id', user_id)
    .whereNull('deleted_at')
    .update({ deleted_at: knex.fn.now() });

  removeConversationMember()
  .then(() => res.send(true))
  .catch(err => {
    console.error('Erro isnide deleteConversation.js: ', err);
    res.send(false);
  });

};

module.exports = deleteConversation;
