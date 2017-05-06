const updateItemForSale = (req, res, knex, user_id) => {

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
      req.params.course_id &&
      req.params.item_id
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const determinePhotoName = () => new Promise((resolve, reject) => {
    if (req.file && req.file.filename) {
      resolve(req.file.filename);
    } else {
      knex('items_for_sale').where('id', req.params.item_id).andWhere('course_id', req.params.course_id).andWhere('owner_id', user_id).select('photo_name')
      .then(item => resolve(item[0].photo_name))
      .catch(err => reject('could not find the photo_name for item: ', err));
    }
  });

  const updateItem = (itemObj, trx) => knex('items_for_sale')
    .transacting(trx)
    .where('id', req.params.item_id)
    .andWhere('course_id', req.params.course_id)
    .andWhere('owner_id', user_id)
    .update(itemObj);

  const updateCourseFeed = (feedObj, trx) => knex('course_feed')
    .transacting(trx)
    .where('item_for_sale_id', req.params.item_id)
    .andWhere('course_id', req.params.course_id)
    .andWhere('commenter_id', user_id)
    .update(feedObj);

  knex.transaction(trx => {
    validateInputs()
    .then(() => determinePhotoName())
    .then(photo_name => {
      let itemObj = {
        title,
        item_desc,
        price,
        photo_name
      };
      return updateItem(itemObj, trx);
    })
    .then(() => {
      let feedObj = {
        header: title,
        content: `${item_desc} - $` + price
      };
      return updateCourseFeed(feedObj, trx);
    })
    .then(() => trx.commit())
    .catch(err => {
      console.error('Error inside updateItemForSale.js: ', err);
      trx.rollback();
    });
  })
  .then(() => res.send(true))
  .catch(err => res.send(false));

};

module.exports = updateItemForSale;
