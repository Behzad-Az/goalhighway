const postNewCompanyReview = (req, res, knex, user_id, esClient) => {

  const position = req.body.position.trim();
  const position_type = req.body.positionType;
  const reviewer_background = req.body.reviewerBackground.trim();
  const start_year = parseInt(req.body.startYear);
  const start_month = req.body.startMonth;
  const work_duration = parseInt(req.body.workDuration);
  const training_rating = parseInt(req.body.trainingRating);
  const relevancy_rating = parseInt(req.body.relevancyRating);
  const pay_rating = parseInt(req.body.payRating);
  const overall_rating = parseInt(req.body.overallRating);
  const pros = req.body.pros.trim() || 'No detail provided.';
  const cons = req.body.cons.trim() || 'No detail provided.';
  const company_id = req.params.company_id;

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      position.length >= 3 && position.length <= 60 &&
      position.search(/[^a-zA-Z0-9\ \-\_\(\)\'\\/\\.]/) == -1 &&
      ['summer', 'internship', 'junior'].includes(position_type) &&
      reviewer_background.length >= 3 && reviewer_background.length <= 60 &&
      reviewer_background.search(/[^a-zA-Z0-9\ \-\_\(\)\'\\/\\.]/) == -1 &&
      [2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006].includes(start_year) &&
      ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].includes(start_month) &&
      [1, 2, 3, 4].includes(work_duration) &&
      [1, 2, 3, 4, 5].includes(training_rating) &&
      [1, 2, 3].includes(relevancy_rating) &&
      [1, 2, 3].includes(pay_rating) &&
      [1, 2, 3, 4, 5].includes(overall_rating) &&
      pros.length >= 3 && pros.length <= 500 &&
      pros.search(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/) == -1 &&
      cons.length >= 3 && cons.length <= 500 &&
      cons.search(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/) == -1 &&
      company_id
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const validateCompanyExists = () => {
    const body = {
      size: 1,
      from: 0,
      query: {
        ids: {
          type: 'company',
          values: [req.params.company_id]
        }
      }
    };
    return esClient.search({ index: 'goalhwy_es_db', body });
  };

  const insertNewReview = newReviewObj => knex('company_reviews')
    .insert(newReviewObj);

  validateInputs()
  .then(() => validateCompanyExists())
  .then(results => {
    if (results.hits.total === 1) {
      return insertNewReview({
        position,
        position_type,
        reviewer_background,
        start_year,
        start_month,
        work_duration,
        training_rating,
        relevancy_rating,
        pay_rating,
        overall_rating,
        pros,
        cons,
        company_id,
        reviewer_id: user_id
      });
    } else {
      throw 'Invalid company id';
    }
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewCompanyReview.js: ', err);
    res.send(false);
  });

};

module.exports = postNewCompanyReview;
