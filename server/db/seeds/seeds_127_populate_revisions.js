const randomNum = (maxNum) => {
  return Math.floor((Math.random() * maxNum) + 1);
}

const suffix = ["blah", ".xlsx", ".docx", ".pdf", ".zip", ".default"];

exports.seed = function(knex, Promise) {
  let promiseArr = [];
  for(let i = 1; i <= 10299; i++) {
    let randNum = randomNum(5);
    let type, title;
    switch (i % 3) {
      case 1:
        type = 'asg_report';
        title = `name_ar_${i}`;
        break;
      case 2:
        type = 'lecture_note';
        title = `name_ln_${i}`;
        break;
      case 0:
        type = 'sample_question';
        title = `name_sq_${i}`;
        break;
    }

    for(let n = 1; n <= randNum; n++) {
      promiseArr.push(knex('revisions').insert({
        file_path: `file_path${i}_${n}${suffix[randNum]}`,
        doc_id: i,
        type: type,
        title: title
      }));
    }
  }

  return Promise.all(promiseArr);
  // return Promise.all([]);
};
