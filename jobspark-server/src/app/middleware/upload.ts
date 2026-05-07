// import multer from "multer";
// import { AppError } from "@/app/errorHelpers/AppError";
// import httpStatus from "http-status";

// const allowedMimes = new Set([
//     "image/jpeg",
//     "image/jpg",
//     "image/png",
//     "image/webp",
//     "image/gif"
// ]);

// export const upload = multer({
//     storage: multer.memoryStorage(),
//     limits: {
//         fileSize: 5 * 1024 * 1024
//     },
//     fileFilter: (_req, file, cb) => {
//         if (!allowedMimes.has(file.mimetype)) {
//             return cb(new AppError(httpStatus.BAD_REQUEST, "Only image files are allowed for poster"));
//         }

//         cb(null, true);
//     }
// });

// export const uploadPoster = upload.single("poster");
