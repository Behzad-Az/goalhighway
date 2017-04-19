const deleteItemForSale = (req, res, knex, user_id) => {

  const updateItemDb = trx => knex('items_for_sale')
    .transacting(trx)
    .where('id', req.params.item_id)
    .andWhere('course_id', req.params.course_id)
    .andWhere('owner_id', user_id)
    .update({ deleted_at: knex.fn.now() });

  const deleteCourseFeed = trx => knex('course_feed')
    .transacting(trx)
    .where('item_for_sale_id', req.params.item_id)
    .andWhere('course_id', req.params.course_id)
    .andWhere('commenter_id', user_id)
    .del();

  knex.transaction(trx => {
    Promise.all([
      deleteCourseFeed(trx),
      updateItemDb(trx)
    ])
    .then(() => trx.commit())
    .catch(err => {
      trx.rollback();
      throw err;
    });
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside deleteItemForSale.js', err);
    res.send(false);
  });

};

module.exports = deleteItemForSale;
