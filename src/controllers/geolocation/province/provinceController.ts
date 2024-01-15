import { Request, Response } from "express";
import prisma from "../../../../prisma/prisma";

export const POSTCreateProvince = async (req: Request, res: Response) => {
  try {
    const { provinceName } = req.body;

    const result = await prisma.province.create({
      data: {
        name: provinceName,
        value: provinceName.toUpperCase(),
      },
    });

    return res.status(200).json({
      status: "success",
      message: "create province successful",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: "success",
      message: "create province successful",
      data: error,
    });
  }
};

export const DELETEProvince = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    const result = await prisma.province.delete({
      where: {
        id: id as string,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "successfully deleted province data",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "failed deleted province data",
      data: error,
    });
  }
};

export const PUTProvince = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const { id } = req.query;

    const result = await prisma.province.update({
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
      message: "edit province data success",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "edit province data failed",
      data: error,
    });
  }
};

export const GETAllProvince = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    const result = await prisma.province.findMany({
      where: {
        name: {
          contains: name as string,
          mode: "insensitive",
        },
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

export const GETProvinceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    const result = await prisma.province.findUnique({
      where: {
        id: id as string,
      },
    });

    console.log("get province by id", result);

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

export const GETProvincePaginate = async (req: Request, res: Response) => {
  try {
    const { pageSize, pageNumber, searchQuery } = req.query;
    console.log("TESTING PAGINATE BRO", {
      pageSize,
      pageNumber,
      searchQuery,
    });

    const datas = await prisma.province.findMany({
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
    const allDatas = await prisma.province.count({
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
      message: "successfully retreive data",
      data: datas,
      totalPages: Math.ceil(allDatas / Number(pageSize)),
      currentPage: Number(pageNumber),
      pageSize: Number(pageSize),
      totalData: allDatas,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "failed retreive data",
      data: error,
    });
  }
};
