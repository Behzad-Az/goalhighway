const uploadDocToDb = (knex, filePath) => {
  let extension = filePath.substr(filePath.lastIndexOf('.') + 1);
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let length = 15;
  let random_link = '';

  for(let i = 0; i < length; i++) {
    random_link += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${random_link}.${extension}`;
}

module.exports = uploadDocToDb;
