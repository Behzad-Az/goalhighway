const postLogin = (req, res, knex, bcrypt) => {

  let currUser;

  const username = req.body.username.toLowerCase();
  const password = req.body.password;

  const findUser = () => knex('users')
    .innerJoin('institution_program', 'inst_prog_id', 'institution_program.id')
    .select('users.id', 'username', 'password', 'inst_prog_id', 'inst_id', 'prog_id')
    .where('username', username);

  const verifyPwd = (given, actual) => bcrypt.compare(given, actual);

  findUser().then(user => {
    currUser = user;
    return verifyPwd(password, currUser[0].password);
  }).then(valid => {
    if (valid) {
      req.session.username = username;
      req.session.user_id = currUser[0].id;
      req.session.inst_prog_id = currUser[0].inst_prog_id;
      req.session.inst_id = currUser[0].inst_id;
      req.session.prog_id = currUser[0].prog_id;
      console.log("i'm here 6.0: ", req.session);
      res.send(true);
    } else {
      throw "Error inside postLogin.js: invalid username and password";
    }
  }).catch(err => {
    console.error("Error inside postLogin.js: ", err);
    res.send(false);
  });

};

module.exports = postLogin;
