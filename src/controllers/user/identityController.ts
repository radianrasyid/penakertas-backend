import { Request, Response } from "express";
import prisma from "../../../prisma/prisma";
import { Data } from "../../lib/types/general";

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

export const DELETEPartner = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await prisma.relationship.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "delete relationship success",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      data: error,
    });
  }
};

export const POSTAddPartner = async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const body = req.body as {
      partnerData: {
        id: string;
        fullname: string;
        status: string;
        profession: string;
        phoneNumber: string;
      }[];
    };

    const currentUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        relationships: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    console.log("ini data", {
      reqUser: user.id,
      currentUser: currentUser?.id,
    });
    let resultData: any[] = [];
    body.partnerData.map(async (e) => {
      const isThereAny = currentUser?.relationships.find(
        (test) => test.id === e.id
      );
      if (!!isThereAny) {
        const newObj = Object.keys(isThereAny).reduce((acc, key) => {
          acc[key] = (e as Data)[key];
          return acc;
        }, {} as { [key: string]: any });
        const result = await prisma.relationship.update({
          where: {
            id: isThereAny.id,
          },
          data: newObj,
        });
        resultData.push(result);
        return;
      }
      const result = await prisma.relationship.create({
        data: {
          fullname: e.fullname,
          phoneNumber: e.phoneNumber,
          profession: e.profession,
          status: e.status,
          relation: {
            connect: {
              id: currentUser?.id,
            },
          },
        },
      });
      resultData.push(result);
      return;
    });

    return res.status(200).json({
      status: "success",
      message: "add relationship success",
      data: resultData,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "failed",
      message: "add relationship failed",
      data: error,
    });
  }
};

export const DELETEEducation = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await prisma.education.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "delete education success",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "failed",
      message: "delete education failed",
      data: error,
    });
  }
};

export const POSTAddEducation = async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const body = req.body as {
      educationData: {
        id: string;
        no: number;
        educationPlace: string;
        educationLevel: string;
        address: string;
        major: string;
        graduationYear: string;
        aksi: null | string;
      }[];
    };

    const currentUser = await prisma.user.findUnique({
      where: {
        employmentId: user.nipp,
      },
      include: {
        educations: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    let resultData: any[] = [];
    body.educationData.map(async (e) => {
      const isThereAny = currentUser?.educations.find(
        (test) => test.id === e.id
      );
      if (!!isThereAny) {
        const newObj = Object.keys(isThereAny).reduce((acc, key) => {
          acc[key] = (e as Data)[key];
          return acc;
        }, {} as { [key: string]: any });
        const result = await prisma.education.update({
          where: {
            id: isThereAny.id,
          },
          data: newObj,
        });
        resultData.push(result);
        return;
      }
      const result = await prisma.education.create({
        data: {
          address: e.address,
          educationLevel: e.educationLevel,
          educationPlace: e.educationPlace,
          graduationYear: e.graduationYear,
          major: e.major,
          relation: {
            connect: {
              id: currentUser?.id,
            },
          },
        },
      });
      resultData.push(result);
      return;
    });

    return res.status(200).json({
      status: "success",
      message: "add relationship success",
      data: resultData,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "failed",
      message: "add relationship failed",
      data: error,
    });
  }
};

export const DELETEChild = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await prisma.child.delete({
      where: {
        id: id,
      },
    });
    return res.status(200).json({
      status: "success",
      message: "delete child success",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "failed",
      message: "delete child failed",
      data: error,
    });
  }
};

export const POSTAddChild = async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const body = req.body as {
      childData: {
        id: string;
        no: number;
        name: string;
        status: string;
        childOrder: string | number;
        aksi: null | string;
      }[];
    };

    console.log("TESTING BOS", req.body);

    const currentUser = await prisma.user.findUnique({
      where: {
        employmentId: user.nipp,
      },
      include: {
        childs: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    let resultData: any[] = [];
    body.childData.map(async (e) => {
      const isThereAny = currentUser?.childs.find((test) => test.id === e.id);
      if (!!isThereAny) {
        const newObj = Object.keys(isThereAny).reduce((acc, key) => {
          acc[key] = (e as Data)[key];
          if (key === "childOrder") {
            acc[key] = Number((e as Data)[key]);
          }
          return acc;
        }, {} as { [key: string]: any });
        const result = await prisma.child.update({
          where: {
            id: isThereAny.id,
          },
          data: newObj,
        });
        resultData.push(result);
        return;
      }
      const result = await prisma.child.create({
        data: {
          childOrder: Number(e.childOrder),
          name: e.name,
          status: e.status,
          parent: {
            connect: {
              id: currentUser?.id,
            },
          },
        },
      });
      resultData.push(result);
      return;
    });

    return res.status(200).json({
      status: "success",
      message: "add relationship success",
      data: resultData,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "failed",
      message: "add relationship failed",
      data: error,
    });
  }
};

export const DELETEParent = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await prisma.parent.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "delete parent success",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "failed",
      message: "delete parent failed",
      data: error,
    });
  }
};

export const POSTAddParent = async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const body = req.body as {
      parentData: {
        id: string;
        no: number;
        fullname: string;
        status: string;
        profession: string;
        aksi: null | string;
      }[];
    };

    const currentUser = await prisma.user.findUnique({
      where: {
        employmentId: user.nipp,
      },
      include: {
        parents: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    let resultData: any[] = [];
    body.parentData.map(async (e) => {
      const isThereAny = currentUser?.parents.find((test) => test.id === e.id);
      if (!!isThereAny) {
        const newObj = Object.keys(isThereAny).reduce((acc, key) => {
          acc[key] = (e as Data)[key];
          return acc;
        }, {} as { [key: string]: any });
        const result = await prisma.parent.update({
          where: {
            id: isThereAny.id,
          },
          data: newObj,
        });
        resultData.push(result);
        return;
      }
      const result = await prisma.parent.create({
        data: {
          fullname: e.fullname,
          profession: e.profession,
          status: e.status,
          relation: {
            connect: {
              id: currentUser?.id,
            },
          },
        },
      });
      resultData.push(result);
      return;
    });

    return res.status(200).json({
      status: "success",
      message: "add relationship success",
      data: resultData,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "failed",
      message: "add relationship failed",
      data: error,
    });
  }
};

export const DELETELeave = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await prisma.leave.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "delete leave success",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "failed",
      message: "delete leave failed",
      data: error,
    });
  }
};

export const POSTAddLeave = async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const body = req.body as {
      leaveData: {
        id: string;
        no: number;
        skNumber: string;
        skDate: string | Date;
        startDate: string | Date;
        leaveType: string;
        endDate: string | Date;
        aksi: null | string;
      }[];
    };

    const currentUser = await prisma.user.findUnique({
      where: {
        employmentId: user.nipp,
      },
      include: {
        leaves: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    let resultData: any[] = [];
    body.leaveData.map(async (e) => {
      const isThereAny = currentUser?.leaves.find((test) => test.id === e.id);
      if (!!isThereAny) {
        const newObj = Object.keys(isThereAny).reduce((acc, key) => {
          acc[key] = (e as Data)[key];
          return acc;
        }, {} as { [key: string]: any });
        const result = await prisma.leave.update({
          where: {
            id: isThereAny.id,
          },
          data: newObj,
        });
        resultData.push(result);
        return;
      }
      const result = await prisma.leave.create({
        data: {
          endDate: e.endDate,
          leaveType: e.leaveType,
          skDate: e.skDate,
          skNumber: e.skNumber,
          startDate: e.startDate,
          relation: {
            connect: {
              id: currentUser?.id,
            },
          },
        },
      });
      resultData.push(result);
      return;
    });

    return res.status(200).json({
      status: "success",
      message: "add relationship success",
      data: resultData,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "failed",
      message: "add relationship failed",
      data: error,
    });
  }
};

export const GETChildStatusList = async (req: Request, res: Response) => {
  try {
    const result = await prisma.childStatus.findMany();

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
