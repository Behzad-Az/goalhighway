const getLoginCheck = (req, res, knex, user_id) => {
  console.log("i'm here 6.1: ", req.session);
  if (req.session.user_id) {
    let userInfo = Object.assign({}, req.session);
    delete userInfo.cookie;
    res.send({ authorized: true,  userInfo });
  } else {
    console.error("Error in getLoginCheck.js: user not logged in");
    res.send({ authorized: false });
  }

};

module.exports = getLoginCheck;
