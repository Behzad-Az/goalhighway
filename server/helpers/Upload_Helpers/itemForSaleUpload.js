const multer = require('multer');

const getRandomDocName = () => {
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let length = 4;
  let randomName = '';
  for(let i = 0; i < length; i++) {
    randomName += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${randomName}_`;
};

const acceptableMimeType = [
  'image/png'
];

const userPhotoStorage = multer.diskStorage({
  destination: './public/imagesapi/itemsforsale/',
  filename: (req, file, cb) => file.mimetype === 'image/png' ? cb(null, getRandomDocName() + Date.now() + '.png') : cb(null, new Error('unknown file type'))
});

module.exports = multer({
  storage: userPhotoStorage,
  limits: { fileSize: 20000000, files: 1 },
  fileFilter: (req, file, cb) => {
    acceptableMimeType.includes(file.mimetype) ? cb(null, true) : cb(null, false, new Error('unknown file type'));
  }
});
