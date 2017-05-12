const postNewConvMessage = (req, res, knex, user_id) => {

  const content = req.body.content.trim();
  const conversation_id = req.params.conversation_id;

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      content.length >= 3 && content.length <= 500 &&
      content.search(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/) == -1 &&
      conversation_id
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const verifyConvParms = () => knex('conversations')
    .innerJoin('conversation_members', 'conversations.id', 'conversation_members.conversation_id')
    .where('conversations.id', conversation_id)
    .andWhere('conversation_members.user_id', user_id)
    .whereNull('conversations.deleted_at')
    .whereNull('conversation_members.deleted_at')
    .limit(1)
    .count('conversations.id as verified');

  const insertNewConvMessage = newMsgObj => knex('conversation_messages')
    .insert(newMsgObj);

  validateInputs()
  .then(() => verifyConvParms())
  .then(result => {
    if (parseInt(result[0].verified)) {
      return insertNewConvMessage({
        content,
        conversation_id,
        sender_id: user_id
      });
    } else {
      throw 'Conversation query not verified.';
    }
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewConvMessage.js: ', err);
    res.send(false);
  });

};

module.exports = postNewConvMessage;
