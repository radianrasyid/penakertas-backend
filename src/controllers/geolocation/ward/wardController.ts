import { Request, Response } from "express";
import prisma from "../../../../prisma/prisma";

export const POSTCreateWard = async (req: Request, res: Response) => {
  try {
    const { wardName, subdistrict } = req.body;
    console.log("INI CREATE WARD", {
      wardName,
      subdistrict,
    });

    const result = await prisma.ward.create({
      data: {
        name: wardName,
        value: wardName.toUpperCase(),
        subdistrict: {
          connect: {
            id: subdistrict.id,
          },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      message: "successfully create ward",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "failed create ward",
      data: error,
    });
  }
};

export const PUTEditWard = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const { id } = req.query;

    const result = await prisma.ward.update({
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
      message: "successfully edited ward data",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "failed edited ward data",
      data: error,
    });
  }
};

export const GETWardById = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    const result = await prisma.ward.findUnique({
      where: {
        id: id as string,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "success retreive data",
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

export const GETAllWard = async (req: Request, res: Response) => {
  try {
    const { wardname } = req.query;
    const result = await prisma.ward.findMany({
      where: {
        subdistrictId: {
          contains: wardname as string,
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

export const GETWardPaginate = async (req: Request, res: Response) => {
  try {
    const { pageSize, pageNumber, searchQuery } = req.query;

    const datas = await prisma.ward.findMany({
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
    const allDatas = await prisma.ward.count({
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

export const DELETEWard = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    const result = await prisma.ward.delete({
      where: {
        id: id as string,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "successfully deleted ward data",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "failed deleted ward data",
      data: error,
    });
  }
};
