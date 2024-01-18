import { Request, Response } from "express";
import prisma from "../../../prisma/prisma";

export const GETListWorkGroup = async (req: Request, res: Response) => {
  try {
    const result = await prisma.workGroup.findMany();

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

export const GETListWorkUnit = async (req: Request, res: Response) => {
  try {
    const result = await prisma.workUnit.findMany();

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

export const GETListWorkPart = async (req: Request, res: Response) => {
  try {
    const result = await prisma.workPart.findMany();

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
