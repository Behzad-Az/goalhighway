const updateTutorLog = (req, res, knex, user_id) => {

  let updatedTutorLogData;

  if (req.body.action === 'close') {
    updatedTutorLogData = {
      closure_reason: req.body.closureReason,
      closed_at: knex.fn.now()
    };
  } else if (req.body.action === 'update') {
    updatedTutorLogData = {
      issue_desc: req.body.issueDesc
    };
  }

  const updateCourseFeed = tutor_log_id => knex('course_feed')
    .where('tutor_log_id', tutor_log_id)
    .update({ content: `Requesting peer tutoring: ${req.body.issueDesc}` });

  const deleteCourseFeed = tutor_log_id => knex('course_feed')
    .where('tutor_log_id', tutor_log_id)
    .del();

  const updateAssistNotif = tutor_log_id => knex('notifications')
    .where('tutor_log_id', tutor_log_id)
    .update({ content: `Requesting peer tutoring: ${req.body.issueDesc}`, unviewed: true });

  const deleteAssistNotif = tutor_log_id => knex('notifications')
    .where('tutor_log_id', tutor_log_id)
    .del();

  const alterTutorLog = () => knex('tutor_log')
    .where('student_id', user_id)
    .andWhere('course_id', req.params.course_id)
    .whereNull('closed_at')
    .update(updatedTutorLogData)
    .returning('id');

  alterTutorLog()
  .then(id => {
    res.send(true);
    if (req.body.action === 'close') {
      Promise.all([
        deleteCourseFeed(id[0]),
        deleteAssistNotif(id[0])
      ]).then(() => {}).catch(err => console.error("Error inside updateTutorLog.js: ", err));
    } else if (req.body.action === 'update') {
      Promise.all([
        updateCourseFeed(id[0]),
        updateAssistNotif(id[0])
      ]).then(() => {}).catch(err => console.error("Error inside updateTutorLog.js: ", err));
    }
  }).catch(err => {
    console.error("Error inside updateTutorLog.js: ", err);
    res.send(false);
  });

};

module.exports = updateTutorLog;
