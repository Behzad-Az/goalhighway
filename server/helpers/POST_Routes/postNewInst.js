const postNewInst = (req, res, knex, user_id) => {

  let inst_long_name = req.body.inst_long_name.trim();
  let inst_short_name = req.body.inst_short_name.trim();

  const getInstValue = () => inst_long_name.toLowerCase().replace(/ /g, "_");
  const getInstDisplayName = () => inst_short_name ? inst_long_name + ` (${inst_short_name})` : inst_long_name;

  const newInstObj = Object.assign(
    {}, req.body,
    {
      inst_value: getInstValue(),
      inst_display_name: getInstDisplayName(),
      inst_long_name: inst_long_name,
      inst_short_name: inst_short_name
    }
  );

  const insertInst = () => knex('institutions').insert(newInstObj);

  insertInst().then(() => {
    res.send(true);
  }).catch(err => {
    console.error("Error inside postNewInst.js: ", err);
    res.send(false);
  });

};

module.exports = postNewInst;
