import { Request, Response, NextFunction } from "express";
import { body, query, validationResult } from "express-validator";
import sanitizeHtml from "sanitize-html";
import path from "path";
import { unlink } from "fs/promises";

import { errorCode } from "../../../config/errorCode";
import { checkUserIfNotExist } from "../../utils/auth";
import { checkUploadFile } from "../../utils/check";
import { createError } from "../../utils/error";
import { getUserById } from "../../services/authService";
import ImageQueue from "../../jobs/queues/imageQueue";
import { createOnePost, PostArgs } from "../../services/postService";

interface CustomRequest extends Request {
  userId?: number;
}

const removeFiles = async (
  originalFile: string,
  optimizedFile: string | null,
) => {
  try {
    const originalFilePath = path.join(
      __dirname,
      "../../..",
      "/uploads/images",
      originalFile,
    );

    await unlink(originalFilePath);

    if (optimizedFile) {
      const optimizedFilePath = path.join(
        __dirname,
        "../../..",
        "/uploads/optimize",
        originalFile,
      );
      await unlink(optimizedFilePath);
    }
  } catch (error) {
    console.log(error);
  }
};

export const createPost = [
  body("title", "Title is required.").notEmpty().trim().escape(),
  body("content", "Content is required.").notEmpty().trim().escape(),
  body("body", "Body is required.")
    .notEmpty()
    .trim()
    .customSanitizer((value) => sanitizeHtml(value))
    .notEmpty(),
  body("category", "Category is required.").notEmpty().trim().escape(),
  body("type", "Type is required.").notEmpty().trim().escape(),
  body("tags", "Tag is invalid.")
    .optional({ nullable: true })
    .customSanitizer((value) => {
      if (value) {
        return value.split(",").filter((tag: string) => tag.trim() !== "");
      }
    }),

  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      if (req.file) {
        await removeFiles(req.file.filename, null);
      }
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    let { title, content, body, category, type, tags } = req.body;

    const userId = req.userId;
    const image = req.file;
    checkUploadFile(image);

    const user = await getUserById(userId!);
    if (!user) {
      if (req.file) {
        await removeFiles(req.file.filename, null);
      }
      return next(
        createError(
          "This phone has not been registered.",
          401,
          errorCode.unauthenticated,
        ),
      );
    }

    const splitFileName = req.file?.filename.split(".")[0];

    await ImageQueue.add(
      "optimize-image",
      {
        filePath: req.file?.path,
        fileName: `${splitFileName}.webp`,
        width: 835,
        height: 577,
        quality: 100,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
      },
    );

    const data: PostArgs = {
      title,
      content,
      body,
      image: req.file!.filename,
      authorId: user!.id,
      category,
      type,
      tags,
    };

    const post = await createOnePost(data);

    res
      .status(201)
      .json({ message: "Successfully created a new post.", postId: post.id });
  },
];

export const updatePost = [
  body("phone", "Invalid phone number")
    .notEmpty()
    .trim()
    .matches("^[0-9]+$")
    .isLength({ min: 6, max: 12 }),

  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    let { phone, password, token } = req.body;
    res.status(200).json({ message: "OK" });
  },
];

export const deletePost = [
  body("phone", "Invalid phone number")
    .notEmpty()
    .trim()
    .matches("^[0-9]+$")
    .isLength({ min: 6, max: 12 }),

  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    let { phone, password, token } = req.body;
    res.status(200).json({ message: "OK" });
  },
];
