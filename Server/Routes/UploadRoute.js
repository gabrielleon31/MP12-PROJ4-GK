import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // make sure this folder exists in your project:
    // PROJECT_ROOT/Server/public/images
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

router.post(
  "/",
  upload.single("image"),     // <<< field name must be “image”
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }
    // return the uploaded filename
    res.status(200).json({ filename: req.file.filename });
  }
);

export default router;
