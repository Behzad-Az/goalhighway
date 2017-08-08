exports.seed = function(knex, Promise) {

  let tabledata = [];
  const progIdArr = ['BgnavDcD69g', 'oefQCzPT0l0', '2pgU6ZsLl9b', '0PyMhx0kEt7', '2x6MF6xHKSG', 'S8E1WBWlHyE'];
  const instProgIdArr = ['ChEXkGdp4Jg', 'dz6rj7gm3QE', 'zzlAmROFAW2', 'Xwi1pL9cF1G', 'HBT3TrZGtGh',
                        'eTXTNiaCDdm', 'HeNCyoSrDlJ', 'F565DUHRe3t'];
  let instProgCounter = 0;

  for (let i = 0; i < 6; i++) {
    tabledata.push({
      inst_id: 'KliraFQhB6c',
      prog_id: progIdArr[i],
      id: instProgIdArr[instProgCounter++]
    });
  }

  for (let i = 0; i < 6; i++) {
    tabledata.push({
      inst_id: 'kuwXbFvFhtq',
      prog_id: progIdArr[i],
      id: instProgIdArr[instProgCounter++]
    });
  }

  return Promise.all(tabledata.map(data => knex('institution_program').insert(data)));
};
