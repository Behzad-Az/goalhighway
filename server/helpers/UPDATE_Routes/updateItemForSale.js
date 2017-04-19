const updateItemForSale = (req, res, knex, user_id) => {

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
    determinePhotoName()
    .then(photo_name => {
      let itemObj = {
        title: req.body.title.trim(),
        item_desc: req.body.itemDesc.trim(),
        price: req.body.price.trim(),
        photo_name
      };
      return updateItem(itemObj, trx);
    })
    .then(() => {
      let feedObj = {
        header: req.body.title.trim(),
        content: `${req.body.itemDesc.trim()} - $` + req.body.price.trim()
      };
      return updateCourseFeed(feedObj, trx);
    })
    .then(() => trx.commit())
    .catch(err => {
      trx.rollback();
      throw err;
    });
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside updateItemForSale.js', err);
    res.send(false);
  });

};

module.exports = updateItemForSale;
