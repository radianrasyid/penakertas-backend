import { Request, Response } from "express";
import prisma from "../../../prisma/prisma";

export const GETWorkPartById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await prisma.workPart.findUnique({
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

export const POSTCreateWorkPart = async (req: Request, res: Response) => {
  try {
    const { name } = req.body as { name: string };

    const createdWorkPart = await prisma.workPart.create({
      data: {
        name: name,
        value: name.toUpperCase(),
      },
    });

    return res.status(200).json({
      status: "success",
      message: "create work part success",
      data: createdWorkPart,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "failed",
      message: "create work part failed",
      data: error,
    });
  }
};

export const PUTEditWorkPart = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body as { name: string };

    const editedData = await prisma.workPart.update({
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

export const GETWorkPartPaginated = async (req: Request, res: Response) => {
  try {
    const { pageSize, pageNumber, searchQuery } = req.query;

    const datas = await prisma.workPart.findMany({
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
              {
                value: {
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
    const allDatas = await prisma.workPart.count({
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
              {
                value: {
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
