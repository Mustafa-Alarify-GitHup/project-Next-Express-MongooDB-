const path = require("path");
const multer = require("multer");

const photoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../Image"));
    },
    filename: function (req, file, cb) {
        if (file) {
            cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
        } else {
            cb(null, false);
        }
    }
});

const photoUpload = multer({
    Storage: photoStorage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith("image")) {
            cb(null, true);
        } else {
            cb({ message: "this is not images!" }, false)
        }
    },
    limits: { fileSize: 1024 * 1024 *5 }// img size == 1mbyte
})

module.exports = photoUpload;