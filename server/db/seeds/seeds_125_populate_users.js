// const randIdString = require('random-base64-string');

// let firstId = '1RzZl22wTN9';
// const instProgIdArr = ['ChEXkGdp4Jg', 'dz6rj7gm3QE', 'zzlAmROFAW2', 'Xwi1pL9cF1G', 'HBT3TrZGtGh',
//                       'eTXTNiaCDdm', 'HeNCyoSrDlJ', 'F565DUHRe3t'];

// let users = [];
// for(let i = 1; i <= 8; i++) {
//   users.push({
//     id: firstId || randIdString(11),
//     username: `user_${i}`,
//     email: `e${i}@e.com`,
//     password: 'pwd',
//     user_year: i % 4 ? i % 4 : 4,
//     inst_prog_id: instProgIdArr[i - 1],
//     register_token: `abcd123${i}`,
//     confirmed: true
//   });
//   firstId = '';
// }

exports.seed = function(knex, Promise) {
  // let promiseArr = [];
  // users.forEach((user) => {
  //   promiseArr.push(knex('users').insert(user));
  // });

  // return Promise.all(promiseArr);
  return Promise.all([]);
};
