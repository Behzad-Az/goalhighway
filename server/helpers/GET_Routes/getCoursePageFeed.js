const getCoursePageFeed = (req, res, knex, user_id) => {

  const getCourseFeeds = () => knex('course_feed')
    .innerJoin('users', 'course_feed.commenter_id', 'users.id')
    .select(
      'course_feed.id', 'course_feed.created_at', 'course_feed.tutor_log_id', 'course_feed.course_id', 'course_feed.item_for_sale_id', 'course_feed.course_review_id',
      'course_feed.anonymous', 'course_feed.commenter_id', 'course_feed.category', 'course_feed.content', 'course_feed.header',
      'course_feed.doc_id', 'users.photo_name', 'users.username as commenter_name'
    )
    .where('course_feed.course_id', req.params.course_id)
    .orderBy('course_feed.created_at', 'desc')
    .limit(10)
    .offset(parseInt(req.query.coursefeedoffset));

  const categorizeFeed = feedArr => feedArr.map(feed => {
    let documentFeedCategories = [
      'new_asg_report', 'new_lecture_note', 'new_sample_question', 'new_document', 'revised_asg_report',
      'revised_lecture_note', 'revised_sample_question', 'revised_document'
    ];
    if (feed.anonymous) {
      feed.commenter_name = 'Anonymous';
      if (feed.category === 'new_comment') { feed.photo_name = 'anonymous_user_photo.png'; }
      else if (feed.category === 'new_item_for_sale') { feed.photo_name = 'item_for_sale.png'; }
      else if (feed.category === 'new_course_review') { feed.photo_name = 'course_review.png'; }
      else if (documentFeedCategories.includes(feed.category)) { feed.photo_name = 'document.png'; }
    }
    feed.editable = feed.commenter_id === user_id;
    return feed;
  });

  const getLikeCount = (item, tableName) => knex('user_likes')
      .where('foreign_table', tableName)
      .andWhere('foreign_id', item.id)
      .sum('like_or_dislike as likeCount');

  const getAlreadyLiked = (item, tableName) => knex('user_likes')
      .where('foreign_table', tableName)
      .andWhere('foreign_id', item.id)
      .andWhere('user_id', user_id)
      .sum('like_or_dislike as likeCount');

  const getLikesInfo = (item, tableName) => new Promise((resolve, reject) => {
    Promise.all([ getLikeCount(item, tableName), getAlreadyLiked(item, tableName) ])
    .then(results => {
      item.likeCount = results[0][0].likeCount ? parseInt(results[0][0].likeCount) : 0;
      item.alreadyLiked = results[1][0].likeCount ? parseInt(results[1][0].likeCount) : 0;
      resolve(item);
    })
    .catch(err => reject(err));
  });

  getCourseFeeds()
  .then(courseFeeds => Promise.all(courseFeeds.map(feed => getLikesInfo(feed, 'course_feed'))))
  .then(courseFeeds => {
    const feeds = categorizeFeed(courseFeeds);
    res.send({ feeds });
  })
  .catch(err => {
    console.error('Error inside getCoursePageFeed.js: ', err);
    res.send(false);
  });

};

module.exports = getCoursePageFeed;
