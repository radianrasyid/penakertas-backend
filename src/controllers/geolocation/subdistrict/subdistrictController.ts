import { Request, Response } from "express";
import prisma from "../../../../prisma/prisma";

export const POSTCreateSubdistrict = async (req: Request, res: Response) => {
  try {
    const { subdistrict, district } = req.body;

    const result = await prisma.subdistrict.create({
      data: {
        name: subdistrict,
        value: subdistrict.toUpperCase(),
        cityDistricts: {
          connect: {
            id: district.id,
          },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      message: "successfully create subdistrict",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "failed create subdistrict",
      data: error,
    });
  }
};

export const PUTEditSubdistrict = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const { id } = req.query;

    const result = await prisma.subdistrict.update({
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
      message: "successfully edited subdistrict data",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "failed edited subdistrict data",
      data: error,
    });
  }
};

export const GETSubdistrictById = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    const result = await prisma.subdistrict.findUnique({
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

export const GETAllSubdistrict = async (req: Request, res: Response) => {
  try {
    const { districtname } = req.query;
    const result = await prisma.subdistrict.findMany({
      where: {
        cityDistrictId: {
          contains: districtname as string,
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

export const GETSubdistrictPaginate = async (req: Request, res: Response) => {
  try {
    const { pageSize, pageNumber, searchQuery } = req.query;

    const datas = await prisma.subdistrict.findMany({
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
    const allDatas = await prisma.subdistrict.count({
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

export const DELETESubdistrict = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    const result = await prisma.subdistrict.delete({
      where: {
        id: id as string,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "successfully deleted subdistrict data",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "failed deleted subdistrict data",
      data: error,
    });
  }
};
