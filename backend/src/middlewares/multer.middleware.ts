import path from 'path';
import multer from 'multer';

const upload = multer({
  // upload destination
  dest: "uploads/",
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 mb maximum size of the file
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (_req, file, cb) => {
      cb(null, file.originalname)
    },
  }),
  fileFilter: (_req, file, cb) => {
    let ext = path.extname(file.originalname);

    // checking the file type
    if (
      ext !== ".jpg" &&
      ext !== ".png" &&
      ext !== ".jpeg" &&
      ext !== ".webp"
    ) {
      cb(new Error(`Unsupported file type! ${ext}`));
      return;
    }

    cb(null, true)
  }
})

export default upload;