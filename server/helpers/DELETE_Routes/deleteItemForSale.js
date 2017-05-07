const deleteItemForSale = (req, res, knex, user_id) => {

  const updateItemDb = trx => knex('items_for_sale')
    .transacting(trx)
    .where('id', req.params.item_id)
    .andWhere('course_id', req.params.course_id)
    .andWhere('owner_id', user_id)
    .whereNull('deleted_at')
    .update({ deleted_at: knex.fn.now() });

  const deleteCourseFeed = trx => knex('course_feed')
    .transacting(trx)
    .where('category', 'new_item_for_sale')
    .andWhere('item_for_sale_id', req.params.item_id)
    .andWhere('commenter_id', user_id)
    .andWhere('course_id', req.params.course_id)
    .del();

  knex.transaction(trx => {
    Promise.all([
      deleteCourseFeed(trx),
      updateItemDb(trx)
    ])
    .then(() => trx.commit())
    .catch(err => {
      console.error('Error inside deleteItemForSale.js', err);
      trx.rollback();
    });
  })
  .then(() => res.send(true))
  .catch(err => res.send(false));

};

module.exports = deleteItemForSale;
