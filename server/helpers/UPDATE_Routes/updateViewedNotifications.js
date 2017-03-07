const updateViewedNotifications = (req, res, knex, user_id) => {
  if (req.body.asOfTime) {
    knex('notifications').where('to_id', user_id).andWhere('notif_created_at', '<=', req.body.asOfTime + 1).update({ unviewed: false })
    .then(() => res.send(true))
    .catch(err => {
      console.error("Error in updateViewedNotifications.js: ", err);
      res.send(false);
    });
  } else {
    res.send(true);
  }
};

module.exports = updateViewedNotifications;
