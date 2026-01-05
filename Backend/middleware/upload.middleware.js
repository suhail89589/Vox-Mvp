import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
 
  if (file.mimetype === "application/pdf" || file.mimetype.startsWith("audio/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file. Only PDF and Audio allowed!"), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter,
});