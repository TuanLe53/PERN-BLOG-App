const multer = require('multer');

const avatar = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatar');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const thumbnail = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/thumbnail');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
})

const uploadAvatar = multer({ storage: avatar });

const uploadThumbnail = multer({storage: thumbnail})

module.exports = {uploadAvatar, uploadThumbnail};