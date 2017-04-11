const randomNum = maxNum => Math.floor((Math.random() * maxNum) + 1);


const suffix = ['blah', '.xlsx', '.docx', '.pdf', '.zip', '.default'];

// let adminFeedObj = {
//   commenter_id: 2,
//   course_id: newDocObj.course_id,
//   doc_id: newRevObj.doc_id,
//   category: newRevObj.type,
//   commenter_name: 'goal_robot',
//   content: `I just got a new document - ${newRevObj.title}`
// };

exports.seed = function(knex, Promise) {

  const insertRev = revObj => knex('revisions').insert(revObj);
  const adminAddToCourseFeed = adminFeedObj => knex('course_feed').insert(adminFeedObj);

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

      let revObj = {
        file_name: `file_name${i}_${n}${suffix[randNum]}`,
        doc_id: i,
        type,
        title
      };

      let adminFeedObj = {
        commenter_id: 2,
        course_id: Math.ceil(i / 3),
        doc_id: i,
        category: type,
        commenter_name: 'goal_robot',
        content: `I just got a new document - ${title}`
      };

      promiseArr.push(insertRev(revObj));
      promiseArr.push(adminAddToCourseFeed(adminFeedObj));
    }

  }

  return Promise.all(promiseArr);
};
