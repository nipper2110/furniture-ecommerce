import express from "express";
import {
  changeLanguage,
  testPermission,
  uploadProfile,
  getMyPhoto,
  uploadProfileMultiple,
  uploadProfileOptimize,
} from "../../../controllers/api/profileController";
import { auth } from "../../../middlewares/auth";
import upload, { uploadMemory } from "../../../middlewares/uploadFile";
import {
  getPost,
  getPostsByPagination,
} from "../../../controllers/api/postController";

const router = express.Router();

router.post("/change-language", changeLanguage);
router.get("/test-permission", auth, testPermission);

router.patch("/profile/upload", auth, upload.single("avatar"), uploadProfile);
router.patch(
  "/profile/upload/optimize",
  auth,
  upload.single("avatar"),
  uploadProfileOptimize,
);
router.patch(
  "/profile/upload/mulitple",
  auth,
  upload.array("avatar"),
  uploadProfileMultiple,
);

router.get("/profile/my-photo", getMyPhoto); // Just for Testing

router.get("/posts", auth, getPostsByPagination);
router.get("/posts/:id", auth, getPost);

export default router;
