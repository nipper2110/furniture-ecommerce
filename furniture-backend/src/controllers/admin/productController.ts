import { Request, Response, NextFunction } from "express";
import { body, query, validationResult } from "express-validator";
import path from "path";
import { unlink } from "fs/promises";

import { errorCode } from "../../../config/errorCode";
import { checkUserIfNotExist } from "../../utils/auth";
import { checkModelIfExist, checkUploadFile } from "../../utils/check";
import { createError } from "../../utils/error";
import { getUserById } from "../../services/authService";
import ImageQueue from "../../jobs/queues/imageQueue";
import { createOneProduct } from "../../services/productService";
import CacheQueue from "../../jobs/queues/cacheQueue";

interface CustomRequest extends Request {
  userId?: number;
  user?: any;
  files?: any;
}

const removeFiles = async (
  originalFiles: string[],
  optimizedFiles: string[] | null,
) => {
  try {
    for (const originalFile of originalFiles) {
      const originalFilePath = path.join(
        __dirname,
        "../../..",
        "/uploads/images",
        originalFile,
      );

      await unlink(originalFilePath);
    }

    if (optimizedFiles) {
      for (const optimizedFile of optimizedFiles) {
        const optimizedFilePath = path.join(
          __dirname,
          "../../..",
          "/uploads/optimize",
          optimizedFile,
        );
        await unlink(optimizedFilePath);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const createProduct = [
  body("name", "Name is required.").notEmpty().trim().escape(),
  body("description", "Description is required.").notEmpty().trim().escape(),
  body("price", "Price is required.")
    .isFloat({ min: 0.1 })
    .isDecimal({ decimal_digits: "1,2" }),
  body("discount", "Discount is required.")
    .isFloat({ min: 0 })
    .isDecimal({ decimal_digits: "1,2" }),
  body("inventory", "Inventory is required.").isInt({ min: 1 }),
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
      if (req.files && req.files.length > 0) {
        const originalFiles = req.files.map((file: any) => file.filename);
        await removeFiles(originalFiles, null);
      }
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const {
      name,
      description,
      price,
      discount,
      inventory,
      category,
      type,
      tags,
    } = req.body;

    checkUploadFile(req.files && req.files.length > 0);

    await Promise.all(
      req.files.map(async (file: any) => {
        const splitFileName = file.filename.split(".")[0];

        return ImageQueue.add(
          "optimize-image",
          {
            filePath: file.path,
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
      }),
    );

    const originalFileNames = req.files.map((file: any) => ({
      path: file.filename,
    }));

    const data: any = {
      name,
      description,
      price,
      discount,
      inventory: +inventory,
      category,
      type,
      tags,
      images: originalFileNames,
    };

    const product = await createOneProduct(data);

    await CacheQueue.add(
      "invalidate-product-cache",
      {
        pattern: "products:*",
      },
      {
        jobId: `invalidate-${Date.now()}`,
        priority: 1,
      },
    );

    res.status(201).json({
      message: "Successfully created a new product.",
      postId: product.id,
    });
  },
];
