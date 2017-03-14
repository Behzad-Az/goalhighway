module.exports = (app) => {

  const multer = require('multer');

  const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
      // Mimetype stores the file type, set extensions according to filetype
      console.log("i'm here 6.0: ", file);
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

      cb(null, file.originalname.slice(0, 4) + Date.now() + ext);
    }
  });
  const upload = multer({storage: storage});

  app.post('/api/uploadHandler', upload.single('file'), function (req, res, next) {

    console.log("i'm here inside uploadHandler", req.body);

    if (req.file && req.file.originalname) {
      console.log(`Received file ${req.file.originalname}`);
    }

    // res.send({ responseText: req.file.path }); // You can send any response to the user here
  });
}
