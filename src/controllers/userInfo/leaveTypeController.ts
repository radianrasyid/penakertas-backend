import { Request, Response } from "express";
import prisma from "../../../prisma/prisma";

export const GETAllLeaveType = async (req: Request, res: Response) => {
  try {
    const { leaveType } = req.query;
    const result = await prisma.leaveType.findMany({
      where: {
        name: {
          contains: leaveType as string,
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

export const GETLeaveTypeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await prisma.leaveType.findUnique({
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

export const POSTCreateLeaveType = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body as {
      name: string;
      description: string;
    };

    const result = await prisma.leaveType.create({
      data: {
        name: name,
        description: description,
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

export const PUTEditLeaveType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body as {
      name: string;
      description: string;
    };

    const editedData = await prisma.leaveType.update({
      where: {
        id: id as string,
      },
      data: {
        name: name,
        description: description.toUpperCase(),
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

export const GETLeaveTypePaginated = async (req: Request, res: Response) => {
  try {
    const { pageSize, pageNumber, searchQuery } = req.query;

    const datas = await prisma.leaveType.findMany({
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
                description: {
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
    const allDatas = await prisma.leaveType.count({
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
                description: {
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
