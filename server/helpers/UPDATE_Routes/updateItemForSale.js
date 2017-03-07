const updateItemForSale = (req, res, knex, user_id) => {

  let updatedItemObj = {
    title: req.body.title,
    item_desc: req.body.itemDesc,
    price: req.body.price
  };

  if (req.body.photo_path) { updatedItemObj.photo_path = req.body.photoPath; }
  if (req.body.deleted == 'true') { updatedItemObj.item_deleted_at = knex.fn.now(); }

  getItemOwner = () => knex('items_for_sale').select('owner_id').where('id', req.params.item_id);

  updateItem = itemObj => knex('items_for_sale').where('id', req.params.item_id).update(itemObj);

  getItemOwner()
  .then(owner => {
    if (owner[0].owner_id == user_id) {
      return updateItem(updatedItemObj);
    } else {
      throw "User not authorized to update item.";
    }
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error("Error inside updateItemForSale.js: ", err);
    res.send(false);
  });

};

module.exports = updateItemForSale;
