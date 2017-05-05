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
  'image/png',
  'image/jpeg',
  'image/pjpeg',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel.sheet.macroEnabled.12',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-word.document.macroEnabled.12',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
  'application/vnd.ms-powerpoint',
  'application/x-compressed',
  'application/x-zip-compressed',
  'application/zip',
  'multipart/x-zip',
  'application/x-gzip',
  'multipart/x-gzip'
];

const documentStorage = multer.diskStorage({
  destination: './uploads/documents/',
  filename: (req, file, cb) => {
    let ext = '.unknown';
    switch (file.mimetype) {
      case 'image/png':
        ext = '.png';
        break;
      case 'image/jpeg':
        ext = '.jpeg';
        break;
      case 'image/pjpeg':
        ext = '.jpeg';
        break;
      case 'application/pdf':
        ext = '.pdf';
        break;
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        ext = '.xlsx';
        break;
      case 'application/vnd.ms-excel.sheet.macroEnabled.12':
        ext = '.xlsm';
        break;
      case 'application/vnd.ms-excel':
        ext = '.xls';
        break;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ext = '.docx';
        break;
      case 'application/vnd.ms-word.document.macroEnabled.12':
        ext = '.docm';
        break;
      case 'application/msword':
        ext = '.doc';
        break;
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        ext = '.pptx';
        break;
      case 'application/vnd.ms-powerpoint.presentation.macroEnabled.12':
        ext = '.pptm';
        break;
      case 'application/vnd.ms-powerpoint':
        ext = '.ppt';
        break;
      case 'application/x-compressed':
        ext = '.zip';
        break;
      case 'application/x-zip-compressed':
        ext = '.zip';
        break;
      case 'application/zip':
        ext = '.zip';
        break;
      case 'multipart/x-zip':
        ext = '.zip';
        break;
      case 'application/x-gzip':
        ext = '.gzip';
        break;
      case 'multipart/x-gzip':
        ext = '.gzip';
        break;
      default:
        new Error('unknown file type');
    }
    cb(null, getRandomDocName() + Date.now() + ext);
  }
});

module.exports = multer({
  storage: documentStorage,
  limits: { fileSize: 20000000, files: 1 },
  fileFilter: (req, file, cb) => {
    acceptableMimeType.includes(file.mimetype) ? cb(null, true) : cb(null, false, new Error('unknown file type'));
  }
});
