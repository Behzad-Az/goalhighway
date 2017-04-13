const profs = [
  { prefix: "Dr.", first_name: "Juan", last_name: "Abello", inst_id: 1 },
  { prefix: "Dr.", first_name: "Yusuf", last_name: "Altintas", inst_id: 1 },
  { prefix: "Dr.", first_name: "Nima", last_name: "Atabaki", inst_id: 1 },
  { prefix: "Dr.", first_name: "Mattia", last_name: "Bacca", inst_id: 1 },
  { prefix: "Dr.", first_name: "Kendal", last_name: "Bushe", inst_id: 1 },
  { prefix: "Dr.", first_name: "Mu", last_name: "Chiao", inst_id: 1 },
  { prefix: "Dr.", first_name: "Peter", last_name: "Cripton", inst_id: 1 },
  { prefix: "Dr.", first_name: "Elizabeth", last_name: "Croft", inst_id: 1 },
  { prefix: "Dr.", first_name: "Anges", last_name: "D'Entremont", inst_id: 1 },
  { prefix: "Dr.", first_name: "Clarence", last_name: "de Silva", inst_id: 1 },
  { prefix: "Dr.", first_name: "Gwynn", last_name: "Elfring", inst_id: 1 },
  { prefix: "Dr.", first_name: "Hsi-Yung (Steve)", last_name: "Feng", inst_id: 1 },
  { prefix: "Mr.", first_name: "Markus", last_name: "Fengler", inst_id: 1 },
  { prefix: "Dr.", first_name: "Ian", last_name: "Frigaard", inst_id: 1 },
  { prefix: "Dr.", first_name: "Mohamed S", last_name: "Gadala", inst_id: 1 },
  { prefix: "Dr.", first_name: "Dana", last_name: "Grecov", inst_id: 1 },
  { prefix: "Dr.", first_name: "Sheldon", last_name: "Green", inst_id: 1 },
  { prefix: "Dr.", first_name: "Anthony", last_name: "Hodgson", inst_id: 1 },
  { prefix: "Dr.", first_name: "Murray", last_name: "Hodgson", inst_id: 1 },
  { prefix: "Ms.", first_name: "Jasmin", last_name: "Jelovica", inst_id: 1 },
  { prefix: "Dr.", first_name: "Patrick", last_name: "Kirchen", inst_id: 1 },
  { prefix: "Dr.", first_name: "Xiaodong", last_name: "Lu", inst_id: 1 },
  { prefix: "Dr.", first_name: "Juan", last_name: "Abello", inst_id: 1 },
  { prefix: "Dr.", first_name: "Hongshen", last_name: "Ma", inst_id: 1 },
  { prefix: "Dr.", first_name: "Chris", last_name: "McKesson", inst_id: 1 },
  { prefix: "Dr.", first_name: "Walter", last_name: "Merida", inst_id: 1 },
  { prefix: "Mr.", first_name: "Jon", last_name: "Mikkelsen", inst_id: 1 },
  { prefix: "Dr.", first_name: "Ryozo", last_name: "Nagamune", inst_id: 1 },
  { prefix: "Dr.", first_name: "Carl", last_name: "Ollivier-Gooch", inst_id: 1 },
  { prefix: "Dr.", first_name: "James", last_name: "Olson", inst_id: 1 },
  { prefix: "Dr.", first_name: "Peter", last_name: "Ostafichuk", inst_id: 1 },
  { prefix: "Dr.", first_name: "Tom", last_name: "Oxland", inst_id: 1 },
  { prefix: "Dr.", first_name: "Juan", last_name: "Abello", inst_id: 1 },
  { prefix: "Dr.", first_name: "Anasavarapu Srikantha", last_name: "Phani", inst_id: 1 },
  { prefix: "Dr.", first_name: "Mauricio", last_name: "Ponga", inst_id: 1 },
  { prefix: "Dr.", first_name: "Juan", last_name: "Abello", inst_id: 1 },
  { prefix: "Dr.", first_name: "Vladan", last_name: "Prodanovic", inst_id: 1 },
  { prefix: "Dr.", first_name: "Steve", last_name: "Rogak", inst_id: 1 },
  { prefix: "Dr.", first_name: "Robert", last_name: "Rohling", inst_id: 1 },
  { prefix: "Dr.", first_name: "Farrokh", last_name: "Sassani", inst_id: 1 },
  { prefix: "Dr.", first_name: "Gary", last_name: "Schajer", inst_id: 1 },
  { prefix: "Dr.", first_name: "Boris", last_name: "Stoeber", inst_id: 1 },
  { prefix: "Dr.", first_name: "Juan", last_name: "Abello", inst_id: 1 },
  { prefix: "Dr.", first_name: "Tatiana", last_name: "Teslenko", inst_id: 1 },
  { prefix: "Dr.", first_name: "Machiel", last_name: "Van der Loos", inst_id: 1 }
];

exports.seed = function(knex, Promise) {
  // let promiseArr = [];
  let promiseArr = profs.map(prof => {
    let profObj = {
      name: `${prof.prefix} ${prof.first_name} ${prof.last_name}`,
      inst_id: 1
    };
    return knex('profs').insert(profObj);
  });
  // profs.forEach(prof => {
  //   let profObj = {
  //     name: `${prof.prefix} ${prof.first_name} ${prof.last_name}`,
  //     inst_id: 1
  //   };
  //   promiseArr.push(knex("profs").insert(profObj));
  // });
  promiseArr.push(knex('profs').insert({ inst_id: 1, name: 'unknown'}));
  return Promise.all(promiseArr);
};
