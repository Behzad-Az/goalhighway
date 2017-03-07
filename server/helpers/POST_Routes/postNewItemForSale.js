const postNewItemForSale = (req, res, knex, user_id) => {

  let newItem = {
    title: req.body.title,
    item_desc: req.body.itemDesc,
    price: req.body.itemDesc,
    photo_path: req.body.photoPath,
    owner_id: user_id,
    course_id: req.params.course_id
  };

  knex('items_for_sale').insert(newItem).then(() => {
    res.send(true);
  }).catch(err => {
    console.error("Error inside postNewItemForSale.js: ", err);
    res.send(false);
  });
};

module.exports = postNewItemForSale;
