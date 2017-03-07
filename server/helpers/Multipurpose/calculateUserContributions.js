const calculateUserContributions = (knex, user_id) => {

  const getRevCount = () => knex('revisions').where('user_id', user_id).count();
  const getItemCount = () => knex('items_for_sale').where('owner_id', user_id).count();
  const getCourseReviewCount = () => knex('course_reviews').where('reviewer_id', user_id).count();


  // knex('revisions').select('id').where('user_id', user_id).then((rows) => {
  //   return rows.length;
  // });
};

module.exports = calculateUserContributions;
