const updateItemForSale = (req, res, knex, user_id) => {

  let updatedItemObj = {
    title: req.body.title,
    item_desc: req.body.itemDesc,
    price: req.body.price,
    item_deleted_at: req.body.deleted ? knex.fn.now() : null
  };

  if (req.body.photo_path) { updatedItemObj.photo_path = req.body.photoPath; }

  verifyOwner = () => knex('items_for_sale')
    .where('id', req.params.item_id)
    .andWhere('owner_id', user_id)
    .count('id as valid');

  updateItem = itemObj => knex('items_for_sale')
    .where('id', req.params.item_id)
    .update(itemObj);

  verifyOwner()
  .then(owner => {
    if (parseInt(owner[0].valid)) {
      return updateItem(updatedItemObj);
    } else {
      throw 'User is not the item owner.';
    }
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside updateItemForSale.js: ', err);
    res.send(false);
  });

};

module.exports = updateItemForSale;
