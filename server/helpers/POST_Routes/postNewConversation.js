const postNewConversation = (req, res, knex, user_id, randIdString) => {

  const subject = req.body.subject.trim();
  const content = req.body.content.trim();
  const toId = req.body.toId;
  const objId = req.body.objId;

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      subject.length >= 3 && subject.length <= 60 &&
      subject.search(/[^a-zA-Z0-9\ \!\@\$\#\&\*\(\)\_\-\\/\\~\:\"\'\,\.\[\]\|]/) == -1 &&
      content.length >= 3 && content.length <= 500 &&
      content.search(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/) == -1 &&
      ['itemForSale', 'tutorReq', 'resumeReview'].includes(req.body.type) &&
      toId.length === 11 &&
      objId.length === 11
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const determineConvType = trx => {
    if (toId === user_id) {
      throw 'User cannot send message to self';
    } else {
      switch (req.body.type) {
        case 'itemForSale':
          return knex('items_for_sale')
            .transacting(trx)
            .where('id', objId)
            .andWhere('owner_id', toId)
            .whereNull('deleted_at')
            .limit(1)
            .count('id as verified');
        case 'tutorReq':
          return knex('tutor_log')
            .transacting(trx)
            .where('id', objId)
            .andWhere('student_id', toId)
            .whereNull('closed_at')
            .whereNull('closure_reason')
            .limit(1)
            .count('id as verified');
        case 'resumeReview':
          return knex('resumes')
            .transacting(trx)
            .where('id', objId)
            .andWhere('owner_id', toId)
            .whereNull('deleted_at')
            .whereNotNull('review_requested_at')
            .limit(1)
            .count('id as verified');
        default:
          throw 'Unable to validate conversation parameters';
      }
    }
  };

  const insertNewConversation = (newConvObj, trx) => knex('conversations')
    .transacting(trx)
    .insert(newConvObj)
    .returning('id');

  const insertNewConvMessage = (newMsgObj, trx) => knex('conversation_messages')
    .transacting(trx)
    .insert(newMsgObj);

  const insertNewConvMembers = (newMemberObjs, trx) => knex('conversation_members')
    .transacting(trx)
    .insert(newMemberObjs);

  knex.transaction(trx => {
    validateInputs()
    .then(() => determineConvType(trx))
    .then(result => {
      if (parseInt(result[0].verified)) {
        return insertNewConversation({ id: randIdString(11), subject }, trx);
      } else {
        throw 'Conversation parameters not valid.';
      }
    })
    .then(convId => {
      const conversation_id = convId[0];
      let newMsgObj = { id: randIdString(11), content, conversation_id, sender_id: user_id };
      let newMemberObjs = [
        { id: randIdString(11), user_id: toId, conversation_id },
        { id: randIdString(11), user_id, conversation_id }
      ];
      return Promise.all([
        insertNewConvMessage(newMsgObj, trx), insertNewConvMembers(newMemberObjs, trx)
      ]);
    })
    .then(() => trx.commit())
    .catch(err => {
      console.error('Error inside postNewConversation.js: ', err);
      trx.rollback();
    });
  })
  .then(() => res.send(true))
  .catch(err => res.send(false));

};

module.exports = postNewConversation;
