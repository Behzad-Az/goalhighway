const multer = require('multer');
const randIdString = require('random-base64-string');

const acceptableMimeType = [
  'image/png'
];

const userPhotoStorage = multer.diskStorage({
  destination: '../../goalhwy_docs/public/imagesapi/users/',
  filename: (req, file, cb) => {
    let ext = '.unknown';
    switch (file.mimetype) {
      case 'image/jpeg':
        ext = '.jpeg';
        break;
      case 'image/png':
        ext = '.png';
        break;
      case 'image/gif':
        ext = '.gif';
        break;
      default:
       new Error('unknown file type');
    }
    cb(null, '__' + randIdString(4) + Date.now() + ext);
  }
});

module.exports = multer({
  storage: userPhotoStorage,
  limits: { fileSize: 20000000, files: 1 },
  fileFilter: (req, file, cb) => {
    acceptableMimeType.includes(file.mimetype) ? cb(null, true) : cb(null, false, new Error('unknown file type'));
  }
});
