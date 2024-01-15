import { Request, Response } from "express";
import prisma from "../../../../prisma/prisma";

export const POSTCreateDistrict = async (req: Request, res: Response) => {
  try {
    const { cityDistrictName, province } = req.body;

    const result = await prisma.cityDistrict.create({
      data: {
        name: cityDistrictName,
        value: cityDistrictName.toUpperCase(),
        province: {
          connect: { id: province.id },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      message: "successfully create district",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "failed create district",
      data: error,
    });
  }
};

export const PUTEditDistrict = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const { id } = req.query;

    const result = await prisma.cityDistrict.update({
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
      message: "successfully edited district data",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "failed edited district data",
      data: error,
    });
  }
};

export const GETDistrictById = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    const result = await prisma.cityDistrict.findUnique({
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

export const GETAllDistrict = async (req: Request, res: Response) => {
  try {
    const { provinceName } = req.query;
    const result = await prisma.cityDistrict.findMany({
      where: {
        provinceId: {
          contains: provinceName as string,
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

export const GETDistrictPaginate = async (req: Request, res: Response) => {
  try {
    const { pageSize, pageNumber, searchQuery } = req.query;

    const datas = await prisma.cityDistrict.findMany({
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
    const allDatas = await prisma.cityDistrict.count({
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

export const DELETEDistrict = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    const result = await prisma.cityDistrict.delete({
      where: {
        id: id as string,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "successfully deleted district data",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "failed deleted district data",
      data: error,
    });
  }
};
