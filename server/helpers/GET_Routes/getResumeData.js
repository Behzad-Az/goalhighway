const getResumeData = (req, res, knex, user_id) => {
  knex('resumes').where('id', req.params.resume_id).andWhere('user_id', user_id)
  .then(resume => {
    if (!resume[0]) {
      throw 'file could not be found';
    } else {
      const fileName = resume[0].file_name;
      const downloadPath = './uploads/' + fileName;
      res.download(downloadPath, 'resume.pdf');
    }
  }).catch(err => {
    console.error('Error inside getResumeData.js: ', err);
    res.download('no_file_could_be_found');
  });
};

module.exports = getResumeData;
