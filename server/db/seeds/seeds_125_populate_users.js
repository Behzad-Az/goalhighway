const randIdString = require('random-base64-string');

let firstId = '2';

let users = [];
for(let i = 1; i <= 8; i++) {
  users.push({
    id: firstId || randIdString(11),
    username: `user_${i}`,
    email: `e${i}@e.com`,
    password: 'pwd',
    user_year: i % 4 ? i % 4 : 4,
    inst_prog_id: i,
    register_token: `abcd123${i}`,
    confirmed: true
  });
  firstId = '';
}

exports.seed = function(knex, Promise) {
  let promiseArr = [];
  users.forEach((user) => {
    promiseArr.push(knex('users').insert(user));
  });

  return Promise.all(promiseArr);
};
