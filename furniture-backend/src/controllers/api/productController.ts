import { Request, Response, NextFunction } from "express";
import { body, query, param, validationResult } from "express-validator";

import { errorCode } from "../../../config/errorCode";
import { checkUserIfNotExist } from "../../utils/auth";
import { checkModelIfExist, checkUploadFile } from "../../utils/check";
import { createError } from "../../utils/error";
import { getUserById } from "../../services/authService";
import { getOrSetCache } from "../../utils/cache";
import { getProductWithRelations } from "../../services/productService";

interface CustomRequest extends Request {
  userId?: number;
}

export const getProduct = [
  param("id", "Product ID is required.").isInt({ gt: 0 }),

  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const productId = req.params.id;

    const userId = req.userId;
    const user = await getUserById(userId!);
    checkUserIfNotExist(user);

    const cacheKey = `products:${JSON.stringify(productId)}`;
    const product = await getOrSetCache(cacheKey, async () => {
      return await getProductWithRelations(+productId);
    });

    checkModelIfExist(product);

    res.status(200).json({ message: "Product Detail", product });
  },
];
