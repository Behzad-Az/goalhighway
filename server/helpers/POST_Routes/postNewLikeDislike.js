
const postNewLikeDislike = (req, res, knex, user_id) => {
  knex('doc_user_likes').insert({
    like_or_dislike: parseInt(req.body.like_or_dislike),
    doc_id: req.params.doc_id,
    user_id: user_id
  }).then(() => {
    res.send(true);
  }).catch((err) => {
    console.error(err);
    res.send(false);
  });
};

module.exports = postNewLikeDislike;
