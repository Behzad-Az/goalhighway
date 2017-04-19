const updateItemForSale = (req, res, knex, user_id) => {

  const determinePhotoName = () => new Promise((resolve, reject) => {
    if (req.file && req.file.filename) {
      resolve(req.file.filename);
    } else {
      knex('items_for_sale').where('id', req.params.item_id).andWhere('owner_id', user_id).select('photo_name')
      .then(item => resolve(item[0].photo_name))
      .catch(err => reject('could not find the photo_name for item: ', err));
    }
  });

  updateItem = itemObj => knex('items_for_sale')
    .where('id', req.params.item_id)
    .andWhere('owner_id', user_id)
    .update(itemObj);

  determinePhotoName()
  .then(photo_name => updateItem({
    title: req.body.title,
    item_desc: req.body.itemDesc,
    price: req.body.price,
    photo_name,
    deleted_at: req.body.deleted === 'true' ? knex.fn.now() : null
  }))
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside updateItemForSale.js: ', err);
    res.send(false);
  });

};

module.exports = updateItemForSale;
