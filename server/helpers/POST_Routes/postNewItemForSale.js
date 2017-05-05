const postNewItemForSale = (req, res, knex, user_id) => {

  const title = req.body.title.trim();
  const item_desc = req.body.itemDesc.trim();
  const price = req.body.price.trim();

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      title.length >= 3 && title.length <= 60 &&
      title.search(/[^a-zA-Z0-9\ \#\&\*\$\(\)\_\-\\/\\~\:\"\'\,\.\[\]\|]/) == -1 &&
      item_desc.length >= 3 && item_desc.length <= 250 &&
      item_desc.search(/[^a-zA-Z0-9\ \#\&\*\$\(\)\_\-\\/\\~\:\"\'\,\.\[\]\|]/) == -1 &&
      price.length >= 1 && price.length <= 10 &&
      price.search(/[^a-zA-Z0-9\ \$\*\(\)\_\-\,\.\[\]]/) == -1 &&
      req.params.course_id
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
        title,
        item_desc,
        price,
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
        header: title,
        anonymous: true,
        content: `${item_desc} - $` + price
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
