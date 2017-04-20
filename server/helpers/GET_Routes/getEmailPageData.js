const getEmailPageData = (req, res, knex, user_id) => {

  // const getEmails = () => knex('emails')
  //   .innerJoin('users', 'emails.from_id', 'users.id')
  //   .innerJoin('email_conversations', 'emails.id', 'email_conversations.email_id')
  //   .select(
  //     'emails.id', 'emails.from_id', 'emails.subject', 'users.photo_name',
  //     'email_conversations.content', 'email_conversations.created_at'
  //   )
  //   .where('emails.to_id', user_id)
  //   .whereNull('emails.deleted_at')
  //   .whereNull('email_conversations.deleted_at')
  //   .orderBy('email_conversations.created_at', 'desc');


  const getEmails = () => knex('emails')
    // .innerJoin('users', 'emails.from_id', 'users.id')
    .select('emails.id', 'emails.subject')
    // .where(() => this.where('emails.to_id', user_id).orWhere('emails.from_id', user_id))
    .where(function() { this.where('emails.to_id', user_id).orWhere('emails.from_id', user_id) })
    // .where('emails.to_id', user_id)
    .whereNull('emails.deleted_at')
    .orderBy('emails.created_at', 'desc');

  const getEmailConversations = email => new Promise((resolve, reject) => {
    knex('email_conversations')
    .innerJoin('emails', 'email_conversations.email_id', 'emails.id')
    .innerJoin('users', 'email_conversations.sender_id', 'users.id')
    .select(
      'emails.id', 'emails.from_id', 'emails.to_id', 'emails.subject',
      'email_conversations.id', 'email_conversations.content', 'email_conversations.created_at as sent_at', 'email_conversations.sender_id',
      'users.photo_name', 'users.username as sender_name'
    )
    .where('emails.id', email.id)
    .whereNull('emails.deleted_at')
    .whereNull('email_conversations.deleted_at')
    .orderBy('email_conversations.created_at', 'desc')
    .then(coversations => {
      email.conversations = coversations;
      resolve(email);
    })
    .catch(err => {
      throw 'No conversations could be found for the email';
    });
  });

  getEmails()
  .then(emails => Promise.all(emails.map(email => getEmailConversations(email))))
  .then(emails => res.send({ emails }))
  .catch(err => {
    console.error('Error inside getEmailPageData.js: ', err);
    res.send(false);
  });

};

module.exports = getEmailPageData;
