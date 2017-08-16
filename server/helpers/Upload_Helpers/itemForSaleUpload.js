const multer = require('multer');
const randIdString = require('random-base64-string');

const acceptableMimeType = [
  'image/png'
];

const userPhotoStorage = multer.diskStorage({
  destination: '../../goalhwy_docs/public/imagesapi/itemsforsale/',
  filename: (req, file, cb) => file.mimetype === 'image/png' ? cb(null, '__' + randIdString(4) + Date.now() + '.png') : cb(null, new Error('unknown file type'))
});

module.exports = multer({
  storage: userPhotoStorage,
  limits: { fileSize: 20000000, files: 1 },
  fileFilter: (req, file, cb) => {
    acceptableMimeType.includes(file.mimetype) ? cb(null, true) : cb(null, false, new Error('unknown file type'));
  }
});
