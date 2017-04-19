const randomNum = maxNum => Math.floor((Math.random() * maxNum) + 1);


const suffix = ['blah', '.xlsx', '.docx', '.pdf', '.zip', '.default'];

let k = 1;

exports.seed = function(knex, Promise) {

  const insertRev = revObj => knex('revisions').insert(revObj);
  const adminAddToCourseFeed = adminFeedObj => knex('course_feed').insert(adminFeedObj);

  let promiseArr1 = [];
  let promiseArr2 = [];
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

    const determineCategory = type => {
      let output;
      switch(type) {
        case 'asg_report':
          output = 'new_asg_report';
          break;
        case 'lecture_note':
          output = 'new_lecture_note';
          break;
        case 'sample_question':
          output = 'new_sample_question';
          break;
        default:
          output = 'new_document';
          break;
      }
      return output;
    }

    for(let n = 1; n <= randNum; n++) {

      let revObj = {
        id: k,
        poster_id: 2,
        file_name: `file_name${i}_${n}${suffix[randNum]}`,
        doc_id: i,
        rev_desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        type,
        title
      };

      let adminFeedObj = {
        commenter_id: 2,
        course_id: Math.ceil(i / 3),
        doc_id: i,
        rev_id: k,
        category: determineCategory(type),
        commenter_name: 'Anonymous',
        header: title,
        content: 'New document posted.'
      };

      promiseArr1.push(insertRev(revObj));
      promiseArr2.push(adminAddToCourseFeed(adminFeedObj));
      k++;
    }

  }

  return Promise.all(promiseArr1).then(() => Promise.all(promiseArr2));
};
