const randIdString = require('random-base64-string');

const postNewLikeDislike = (req, res, knex, user_id) => {

  const like_or_dislike = parseInt(req.body.likeOrDislike);
  const foreign_table = req.params.foreign_table;
  const foreign_id = req.params.foreign_id;

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      [1, -1].includes(like_or_dislike) &&
      ['docs', 'course_feed', 'resumes'].includes(foreign_table) &&
      foreign_id
    ) {
      resolve();
    } else {
      reject('Invalid like entry');
    }
  });

  const insertLikeOrDislike = newLikeDislikeObj => knex('user_likes')
    .insert(newLikeDislikeObj);

  validateInputs()
  .then(() => insertLikeOrDislike({
    id: randIdString(11),
    user_id,
    like_or_dislike,
    foreign_table,
    foreign_id
  }))
  .then(() => res.send(true))
  .catch((err) => {
    console.error('Error inside postNewLikeDislike.js: ', err);
    res.send(false);
  });

};

module.exports = postNewLikeDislike;
