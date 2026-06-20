import e from "express";
import { prisma } from "../lib/prisma";

export const getUserByPhone = async (phone: string) => {
  return await prisma.user.findUnique({
    where: { phone },
  });
};

export const createOtp = async (userData: any) => {
  return await prisma.otp.create({
    data: userData,
  });
};

export const getOtpByPhone = async (phone: string) => {
  return await prisma.otp.findUnique({
    where: { phone },
  });
};

export const updateOtp = async (id: number, userData: any) => {
  return await prisma.otp.update({
    where: { id },
    data: userData,
  });
};

export const createUser = async (userData: any) => {
  return await prisma.user.create({
    data: userData,
  });
};

export const updateUser = async (id: number, userData: any) => {
  return await prisma.user.update({
    where: { id },
    data: userData,
  });
};
