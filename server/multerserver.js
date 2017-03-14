module.exports = (app) => {

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
    'image/jepg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const storage = multer.diskStorage({
    destination: './uploads/',
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
        case 'application/pdf':
          ext = '.pdf';
          break;
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
          ext = '.xlsx';
          break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          ext = '.docx';
          break;
      }

      cb(null, getRandomName() + Date.now() + ext);
    }
  });

  const upload = multer({
    storage,
    limits: { fileSize: 20000000, files: 1 },
    fileFilter: (req, file, cb) => {
      acceptableMimeType.includes(file.mimetype) ? cb(null, true) : cb(null, false, new Error('unknown file type'));
    }
  });

  app.post('/api/uploadHandler', upload.single('file'), function (req, res, next) {
    console.log("i'm here 6: ", req.file);
    // if (req.file && req.file.originalname) {
    //   console.log(`Received file ${req.file.originalname}`);
    // }

    // res.send({ responseText: req.file.path }); // You can send any response to the user here
  });
}
