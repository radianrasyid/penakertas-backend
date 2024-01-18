import { Request, Response } from "express";
import prisma from "../../../prisma/prisma";

export const GETListReligion = async (req: Request, res: Response) => {
  try {
    const result = await prisma.religion.findMany();

    return res.status(200).json({
      status: "success",
      message: "retreive data successfull",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "retreive data failed",
      data: error,
    });
  }
};

export const GETListGender = async (req: Request, res: Response) => {
  try {
    const result = await prisma.gender.findMany();

    return res.status(200).json({
      status: "success",
      message: "retreive data successfull",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "retreive data failed",
      data: error,
    });
  }
};

export const GETListLatestEducation = async (req: Request, res: Response) => {
  try {
    const result = await prisma.educationLevel.findMany();

    return res.status(200).json({
      status: "success",
      message: "retreive data successfull",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "retreive data failed",
      data: error,
    });
  }
};

export const GETListMaritalStatus = async (req: Request, res: Response) => {
  try {
    const result = await prisma.maritalStatus.findMany();

    return res.status(200).json({
      status: "success",
      message: "retreive data successfull",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "retreive data failed",
      data: error,
    });
  }
};
