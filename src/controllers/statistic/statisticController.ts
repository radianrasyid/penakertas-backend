import { Request, Response } from "express";
import prisma from "../../../prisma/prisma";

export const GETEmployeeStatistic = async (req: Request, res: Response) => {
  try {
    const AsnAmount = await prisma.user.count({
      where: {
        workGroup: "ASN",
      },
    });
    const PttAmount = await prisma.user.count({
      where: {
        workGroup: "PTT",
      },
    });
    const ThlAmount = await prisma.user.count({
      where: {
        workGroup: "THL",
      },
    });

    return res.status(200).json({
      status: "success",
      message: "user statistics",
      data: {
        asn: AsnAmount,
        ptt: PttAmount,
        thl: ThlAmount,
        totalEmployee: AsnAmount + PttAmount + ThlAmount,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: error,
    });
  }
};
