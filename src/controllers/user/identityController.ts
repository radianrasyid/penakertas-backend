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

export const POSTCreateLatestEducation = async (
  req: Request,
  res: Response
) => {
  try {
    const { name } = req.body as { name: string };

    const createdLatestEducation = await prisma.educationLevel.create({
      data: {
        name: name,
        value: name.toUpperCase(),
      },
    });

    return res.status(200).json({
      status: "success",
      message: "success create education level",
      data: createdLatestEducation,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "failed",
      message: "failed create education levek",
      data: error,
    });
  }
};

export const GETLatestEducationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await prisma.educationLevel.findUnique({
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
    console.log(error);
    return res.status(400).json({
      status: "failed",
      message: "failed retreive data",
      data: error,
    });
  }
};

export const PUTEditLatestEducation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body as { name: string };

    const editedData = await prisma.educationLevel.update({
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

export const DELETELatestEducation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await prisma.educationLevel.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "delete data success",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "failed",
      message: "delete data failed",
      data: error,
    });
  }
};

export const GETLatestEducationPaginate = async (
  req: Request,
  res: Response
) => {
  try {
    const { pageSize, pageNumber, searchQuery } = req.query;

    const datas = await prisma.educationLevel.findMany({
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
    const allDatas = await prisma.educationLevel.count({
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

export const POSTCreateReligion = async (req: Request, res: Response) => {
  try {
    const { name } = req.body as { name: string };

    const createdReligion = await prisma.religion.create({
      data: {
        name: name,
        value: name.toUpperCase(),
      },
    });

    return res.status(200).json({
      status: "success",
      message: "success create religion",
      data: createdReligion,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "failed",
      message: "failed create religion",
      data: error,
    });
  }
};

export const GETReligionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await prisma.religion.findUnique({
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
    console.log(error);
    return res.status(400).json({
      status: "failed",
      message: "failed retreive data",
      data: error,
    });
  }
};

export const PUTEditReligion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body as { name: string };

    const editedData = await prisma.religion.update({
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

export const GETReligionPaginate = async (req: Request, res: Response) => {
  try {
    const { pageSize, pageNumber, searchQuery } = req.query;

    const datas = await prisma.religion.findMany({
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
    const allDatas = await prisma.religion.count({
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
    console.log({
      data: datas,
      totalPages: Math.ceil(allDatas / Number(pageSize)),
      currentPage: Number(pageNumber),
      pageSize: Number(pageSize),
      totalData: allDatas,
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

export const DELETEReligion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await prisma.religion.delete({
      where: {
        id: id,
      },
    });

    return res.status(201).json({
      status: "success",
      message: "delete data success",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "failed",
      message: "delete data failed",
      data: error,
    });
  }
};
