const getConversationPageData = (req, res, knex, user_id) => {

  const getConversations = () => knex('conversations')
    .innerJoin('conversation_members', 'conversations.id', 'conversation_members.conversation_id')
    .innerJoin('users', 'conversation_members.user_id', 'users.id')
    .select('conversations.id', 'conversations.subject')
    .where('conversation_members.user_id', user_id)
    .whereNull('conversations.deleted_at')
    .whereNull('conversation_members.deleted_at')
    .orderBy('conversations.created_at', 'desc');

  const getConversationMessages = conversation => new Promise((resolve, reject) => {
    knex('conversation_messages')
    .innerJoin('users', 'conversation_messages.sender_id', 'users.id')
    .select('conversation_messages.id', 'conversation_messages.created_at as sent_at', 'conversation_messages.content', 'conversation_messages.sender_id', 'users.photo_name', 'users.username as sender_name')
    .where('conversation_messages.conversation_id', conversation.id)
    .orderBy('conversation_messages.created_at', 'desc')
    .then(messages => {
      conversation.messages = messages;
      resolve(conversation);
    })
    .catch(err => reject(err));
  });

  getConversations()
  .then(conversations => Promise.all(conversations.map(conversation => getConversationMessages(conversation))))
  .then(conversations => res.send({ conversations }))
  .catch(err => {
    console.error('Error inside getConversationPageData.js: ', err);
    res.send(false);
  });

};

module.exports = getConversationPageData;
