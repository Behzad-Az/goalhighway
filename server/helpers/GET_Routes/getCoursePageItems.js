const getCoursePageItems = (req, res, knex, user_id) => {

  const getItemsForSale = () => knex('items_for_sale')
    .select('id', 'owner_id', 'course_id', 'price', 'photo_name', 'title', 'item_desc', 'created_at')
    .where('course_id', req.params.course_id)
    .whereNull('deleted_at')
    .limit(10)
    .offset(parseInt(req.query.itemoffset));

  getItemsForSale()
  .then(itemsForSale => {
    let items = itemsForSale.map(item => {
      item.editable = item.owner_id === user_id;
      return item;
    });
    res.send({ items });
  })
  .catch(err => {
    console.error('Error inside getCoursePageItems.js: ', err);
    res.send(false);
  });

};

module.exports = getCoursePageItems;
