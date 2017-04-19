const postNewItemForSale = (req, res, knex, user_id) => {

  let newItemObj = {
    title: req.body.title.trim(),
    item_desc: req.body.itemDesc.trim(),
    price: req.body.price.trim(),
    photo_name: req.file && req.file.filename ? req.file.filename : 'default_item_for_sale_photo.png',
    owner_id: user_id,
    course_id: req.params.course_id
  };

  knex('items_for_sale')
  .insert(newItemObj)
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewItemForSale.js: ', err);
    res.send(false);
  });
};

module.exports = postNewItemForSale;
