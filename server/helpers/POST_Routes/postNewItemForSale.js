const postNewItemForSale = (req, res, knex, user_id) => {

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      req.params.course_id &&
      req.body.title.trim() && req.body.title.trim().length <= 60 &&
      req.body.itemDesc.trim() && req.body.itemDesc.trim().length <= 250 &&
      req.body.price.trim() && req.body.price.trim().length <= 10
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const insertNewItem = (newItemObj, trx) => knex('items_for_sale')
    .transacting(trx)
    .insert(newItemObj)
    .returning('id');

  const adminAddToCourseFeed = (adminFeedObj, trx) => knex('course_feed')
    .transacting(trx)
    .insert(adminFeedObj);

  knex.transaction(trx => {
    validateInputs()
    .then(() => {
      let newItemObj = {
        title: req.body.title.trim(),
        item_desc: req.body.itemDesc.trim(),
        price: req.body.price.trim(),
        photo_name: req.file && req.file.filename ? req.file.filename : 'default_item_for_sale_photo.png',
        owner_id: user_id,
        course_id: req.params.course_id
      };
      return insertNewItem(newItemObj, trx);
    })
    .then(itemId => {
      let adminFeedObj = {
        commenter_id: user_id,
        course_id: req.params.course_id,
        item_for_sale_id: itemId[0],
        category: 'new_item_for_sale',
        header: req.body.title.trim(),
        anonymous: true,
        content: `${req.body.itemDesc.trim()} - $` + req.body.price.trim()
      };
      return adminAddToCourseFeed(adminFeedObj, trx);
    })
    .then(() => trx.commit())
    .catch(err => {
      console.error('Error inside postNewItemForSale.js: ', err);
      trx.rollback();
    });
  })
  .then(() => res.send(true))
  .catch(() => res.send(false));

};

module.exports = postNewItemForSale;
