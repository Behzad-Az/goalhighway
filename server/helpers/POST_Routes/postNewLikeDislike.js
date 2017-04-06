const postNewLikeDislike = (req, res, knex, user_id) => {

  let like_count = parseInt(req.body.likeOrDislike);

  let newLikeDislikeObj = {
    like_count,
    doc_id: req.params.doc_id,
    user_id: user_id
  };

  const validateLikeOrDislike = () => new Promise((resolve, reject) => {
    (like_count === -1 || like_count === 1) ? resolve() : reject('Invalid like or dislike value');
  });

  const insertLikeOrDislike = () => knex('doc_user_likes').insert(newLikeDislikeObj);

  validateLikeOrDislike()
  .then(() => insertLikeOrDislike())
  .then(() => res.send(true))
  .catch((err) => {
    console.error('Error inside postNewLikeDislike.js: ', err);
    res.send(false);
  });

};

module.exports = postNewLikeDislike;
