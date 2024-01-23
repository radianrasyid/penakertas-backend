import { Request, Response } from "express";
import prisma from "../../../prisma/prisma";

export const GETAllPartnerStatus = async (req: Request, res: Response) => {
  try {
    const { partnerStatus } = req.query;
    const result = await prisma.partnerStatus.findMany({
      where: {
        name: {
          contains: partnerStatus as string,
          mode: "insensitive",
        },
      },
    });

    return res.status(200).json({
      status: "success",
      message: "successfuly retreive data",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "failed retreive data",
      data: error,
    });
  }
};

export const GETPartnerStatusById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await prisma.partnerStatus.findUnique({
      where: {
        id: id as string,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "retreive data success",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "failed",
      message: "retreive data failed",
      data: error,
    });
  }
};

export const POSTCreatePartnerStatus = async (req: Request, res: Response) => {
  try {
    const { name } = req.body as { name: string };

    const result = await prisma.partnerStatus.create({
      data: {
        name: name,
        value: name.toUpperCase(),
      },
    });

    return res.status(200).json({
      status: "success",
      message: "create work group success",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "failed",
      message: "create work group failed",
      data: error,
    });
  }
};

export const PUTEditPartnerStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body as { name: string };

    const editedData = await prisma.partnerStatus.update({
      where: {
        id: id as string,
      },
      data: {
        name: name,
        value: name.toUpperCase(),
      },
    });

    return res.status(200).json({
      status: "success",
      message: "edit data success",
      data: editedData,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "failed",
      message: "edit data failed",
      data: error,
    });
  }
};

export const GETPartnerStatusPaginated = async (
  req: Request,
  res: Response
) => {
  try {
    const { pageSize, pageNumber, searchQuery } = req.query;

    const datas = await prisma.partnerStatus.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                name: {
                  contains: searchQuery as string,
                  mode: "insensitive",
                },
              },
            ],
          },
        ],
      },
      skip: (Number(pageNumber) - 1) * Number(pageSize),
      take: Number(pageSize),
      orderBy: {
        name: "desc",
      },
    });
    const allDatas = await prisma.partnerStatus.count({
      where: {
        AND: [
          {
            OR: [
              {
                name: {
                  contains: searchQuery as string,
                  mode: "insensitive",
                },
              },
            ],
          },
        ],
      },
    });

    return res.status(200).json({
      status: "success",
      message: "retreive data successful",
      data: datas,
      totalPages: Math.ceil(allDatas / Number(pageSize)),
      currentPage: Number(pageNumber),
      pageSize: Number(pageSize),
      totalData: allDatas,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "retreive data failed",
      data: error,
    });
  }
};
