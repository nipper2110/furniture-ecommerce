import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import {
  createOtp,
  createUser,
  getOtpByPhone,
  getUserById,
  getUserByPhone,
  updateOtp,
  updateUser,
} from "../services/authService";
import {
  checkOtpErrorIfSameDate,
  checkOtpRow,
  checkUserExist,
  checkUserIfNotExist,
} from "../utils/auth";
import { generateOtp, generateToken } from "../utils/generate";

import bcrypt from "bcrypt";
import moment from "moment";
import jwt from "jsonwebtoken";
import { errorCode } from "../../config/errorCode";

export const register = [
  body("phone", "Invalid phone number")
    .trim()
    .notEmpty()
    .matches("^[0-9]+$")
    .isLength({ min: 6, max: 12 }),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      const error: any = new Error(errors[0].msg);
      error.status = 400;
      error.code = errorCode.invalid;
      return next(error);
    }

    let phone = req.body.phone;
    if (phone.slice(0, 2) === "09") {
      phone = phone.substring(2, phone.length);
    }

    const user = await getUserByPhone(phone);
    checkUserExist(user);

    const otp = 123456; // For Testing
    // const otp = generateOtp();
    const salt = await bcrypt.genSalt(10);
    const hashOtp = await bcrypt.hash(otp.toString(), salt);

    const token = generateToken();

    const otpRow = await getOtpByPhone(phone);

    let result;

    if (!otpRow) {
      const otpData = {
        phone,
        otp: hashOtp,
        rememberToken: token,
      };
      result = await createOtp(otpData);
    } else {
      const lastOtpRequest = new Date(otpRow.updatedAt).toLocaleDateString();
      const today = new Date().toLocaleDateString();
      const isSameDate = lastOtpRequest === today;

      checkOtpErrorIfSameDate(isSameDate, otpRow.error);

      if (!isSameDate) {
        const otpData = {
          otp: hashOtp,
          rememberToken: token,
          count: 1,
        };
        result = await updateOtp(otpRow.id, otpData);
      } else {
        if (otpRow.count === 3) {
          const error: any = new Error(
            "OTP is allowed to request 3 times per day.",
          );
          error.status = 429;
          error.code = errorCode.overLimit;
          return next(error);
        } else {
          const otpData = {
            otp: hashOtp,
            rememberToken: token,
            count: {
              increment: 1,
            },
          };
          result = await updateOtp(otpRow.id, otpData);
        }
      }
    }

    res.status(200).json({
      message: `We are sending OTP to 09${result.phone}`,
      phone: result.phone,
      rememberToken: result.rememberToken,
    });
  },
];

export const verifyOtp = [
  body("phone", "Invalid phone number")
    .trim()
    .notEmpty()
    .matches("^[0-9]+$")
    .isLength({ min: 6, max: 12 }),
  body("otp", "Invalid OTP")
    .trim()
    .notEmpty()
    .matches("^[0-9]+$")
    .isLength({ min: 6, max: 6 }),
  body("token", "Invalid Token").trim().notEmpty().escape(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      const error: any = new Error(errors[0].msg);
      error.status = 400;
      error.code = errorCode.invalid;
      return next(error);
    }

    let { phone, otp, token } = req.body;

    const user = await getUserByPhone(phone);
    checkUserExist(user);

    const otpRow = await getOtpByPhone(phone);
    checkOtpRow(otpRow);

    const lastOtpVerify = new Date(otpRow!.updatedAt).toLocaleDateString();
    const today = new Date().toLocaleDateString();
    const isSameDate = lastOtpVerify === today;

    checkOtpErrorIfSameDate(isSameDate, otpRow!.error);

    // Token is wrong
    if (otpRow?.rememberToken !== token) {
      const otpData = {
        error: 5,
      };
      await updateOtp(otpRow!.id, otpData);

      const error: any = new Error("Invalid Token");
      error.status = 401;
      error.code = errorCode.invalid;
      return next(error);
    }

    // OTP is expired
    const isExpired = moment().diff(otpRow?.updatedAt, "minutes") > 2;
    if (isExpired) {
      const error: any = new Error("OTP is expired");
      error.status = 403;
      error.code = errorCode.otpExpired;
      return next(error);
    }

    const isMatchOTP = await bcrypt.compare(otp, otpRow!.otp);
    // OTP is wrong
    if (!isMatchOTP) {
      // If OTP error is first time today
      if (!isSameDate) {
        const otpData = {
          error: 1,
        };
        await updateOtp(otpRow!.id, otpData);
      } else {
        //If OTP error is not first time today
        const otpData = {
          error: {
            increment: 1,
          },
        };
        await updateOtp(otpRow!.id, otpData);
      }

      const error: any = new Error("OTP is incorrect");
      error.status = 401;
      error.code = errorCode.invalid;
      return next(error);
    }

    // All are OK
    const verifyToken = generateToken();
    const otpData = {
      verifyToken,
      error: 0,
      count: 1,
    };

    const result = await updateOtp(otpRow!.id, otpData);

    res.status(200).json({
      message: "OTP is successfully verified.",
      phone: result.phone,
      token: verifyToken,
    });
  },
];

export const confirmPassword = [
  body("phone", "Invalid phone number")
    .notEmpty()
    .trim()
    .matches("^[0-9]+$")
    .isLength({ min: 6, max: 12 }),
  body("password", "Passwrod must be 8 digits")
    .notEmpty()
    .trim()
    .matches("^[0-9]+$")
    .isLength({ min: 8, max: 8 }),
  body("token", "Invalid Token").notEmpty().trim().escape(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      const error: any = new Error(errors[0].msg);
      error.status = 400;
      error.message = errorCode.invalid;
      return next(error);
    }

    let { phone, password, token } = req.body;

    const user = await getUserByPhone(phone);
    checkUserExist(user);

    const otpRow = await getOtpByPhone(phone);
    checkOtpRow(otpRow);

    // OTP error count is over limit
    if (otpRow!.error === 5) {
      const error: any = new Error("This request may be an attack");
      error.status = 400;
      error.message = errorCode.attack;
      return next(error);
    }

    // Token is wrong
    if (otpRow!.verifyToken !== token) {
      const otpData = {
        error: 5,
      };
      await updateOtp(otpRow!.id, otpData);

      const error: any = new Error("Invalid Token");
      error.status = 401;
      error.message = errorCode.invalid;
      return next(error);
    }

    // Request is expired
    const isExpired = moment().diff(otpRow!.updatedAt, "minutes") > 10;
    if (isExpired) {
      const error: any = new Error(
        "Your request is expired. Please try again.",
      );
      error.status = 403;
      error.message = errorCode.requestExpired;
      return next(error);
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const randToken = "I will replace Refresh Token soon";

    // Create new account
    const userData = {
      phone,
      password: hashPassword,
      randToken,
    };
    const newUser = await createUser(userData);

    const accessTokenPayload = { id: newUser.id };
    const refreshTokenPayload = { id: newUser.id, phone: newUser.phone };

    const accessToken = jwt.sign(
      accessTokenPayload,
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: 60 * 15,
      },
    );

    const refreshToken = jwt.sign(
      refreshTokenPayload,
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "30d",
      },
    );

    // Updating randToken with refreshToken
    const userUpdateData = {
      randToken: refreshToken,
    };
    await updateUser(newUser.id, userUpdateData);

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 15 * 60 * 1000, // 15 min
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      })
      .status(201)
      .json({
        message: "Successfully created an account",
        userId: newUser.id,
      });
  },
];

export const login = [
  body("phone", "Invalid phone")
    .trim()
    .notEmpty()
    .matches("^[0-9]+$")
    .isLength({ min: 6, max: 12 }),
  body("password", "Password must be 8 digits")
    .trim()
    .notEmpty()
    .matches("^[0-9]+$")
    .isLength({ min: 8, max: 8 }),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      const error: any = new Error(errors[0].msg);
      error.status = 400;
      error.code = errorCode.invalid;
      return next(error);
    }

    let password = req.body.password;
    let phone = req.body.phone;
    if (phone.slice(0, 2) === "09") {
      phone = phone.substring(2, phone.length);
    }

    const user = await getUserByPhone(phone);
    checkUserIfNotExist(user);

    // If wrong password was over limit
    if (user!.status === "FREEZE") {
      const error: any = new Error(
        "Your account is temporarily locked. Please contact us.",
      );
      error.status = 400;
      error.code = errorCode.accountFreeze;
      return next(error);
    }

    const isMatchPassword = await bcrypt.compare(password, user!.password);
    if (!isMatchPassword) {
      // Starting to record wrong times
      const lastRequest = new Date(user!.updatedAt).toLocaleDateString();
      const today = new Date().toLocaleDateString();
      const isSameDate = lastRequest === today;

      // Today passwrod is wrong first time
      if (!isSameDate) {
        const userData = {
          errorLoginCount: 1,
        };
        await updateUser(user!.id, userData);
      } else {
        // Today password was wrong 2 times
        if (user!.errorLoginCount >= 2) {
          const userData = {
            status: "FREEZE",
          };
          await updateUser(user!.id, userData);
        } else {
          // Today password was wrong 1 time
          const userData = {
            errorLoginCount: {
              increment: 1,
            },
          };
          await updateUser(user!.id, userData);
        }
      }
      // Ending
      const error: any = new Error("Password is wrong");
      error.status = 401;
      error.code = errorCode.invalid;
      return next(error);
    }

    // Authorization token
    const accessTokenPayload = { id: user!.id };
    const refreshTokenPayload = { id: user!.id, phone: user!.phone };

    const accessToken = jwt.sign(
      accessTokenPayload,
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: 60 * 2,
      },
    );

    const refreshToken = jwt.sign(
      refreshTokenPayload,
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "30d",
      },
    );

    const userData = {
      errorLoginCount: 0,
      randToken: refreshToken,
    };
    await updateUser(user!.id, userData);

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 15 * 60 * 1000, // 15 min
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      })
      .status(200)
      .json({
        message: "Successfully logged in",
        userId: user!.id,
      });
  },
];

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Clear HttpOnly cookies
  const refreshToken = req.cookies ? req.cookies.refreshToken : null;
  if (!refreshToken) {
    const error: any = new Error("You are not an authenticated user.");
    error.status = 401;
    error.code = errorCode.unauthenticated;
    return next(error);
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
      id: number;
      phone: string;
    };
  } catch (err) {
    const error: any = new Error("You are not an authenticated user.");
    error.status = 401;
    error.code = errorCode.unauthenticated;
    return next(error);
  }

  const user = await getUserById(decoded.id);
  checkUserIfNotExist(user);

  if (user?.phone !== decoded.phone) {
    const error: any = new Error("You are not an authenticated user.");
    error.status = 401;
    error.code = errorCode.unauthenticated;
    return next(error);
  }

  // Update randToken in User Table
  const userData = {
    randToken: generateToken(),
  };
  await updateUser(user.id, userData);

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });

  res.status(200).json({ message: "Successfully logged out. See you soon." });
};
