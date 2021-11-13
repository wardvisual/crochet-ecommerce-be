import path from "path";
import multer from "multer";
import ApiError from "../utils/ApiError";

const uploader = (dest) => {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, `${__dirname}/../../uploads/${dest}`);
    },
    filename(req, file, cb) {
      const lastIndexOf = file.originalname.lastIndexOf(".");
      const extension = file.originalname.substring(lastIndexOf);
      cb(null, `img-${Date.now()}${extension}`);
    },
  });

  return multer({
    storage,
    fileFilter: function (req, file, cb) {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new ApiError('Only .png, .jpg and .jpeg format allowed!"'));
      }
    },
  });
};

export default uploader;
