import { Request, Response } from "express";
import exampleModel from "../../../prisma/mongooseModel";
import prisma from "../../../prisma/prisma";
import { createChecksum } from "../../lib/processors";
import { reqFiles } from "../../lib/types/general";

export const POSTUploadUserPhotograph = async (req: Request, res: Response) => {
  try {
    const { photographFile } = req.files as reqFiles;
    const { id } = req.query;

    const photograph = photographFile[0];
    const combinedPhotographChecksum = `${photograph.fieldname}${
      photograph.originalname
    }${photograph.size}${photograph.buffer.toString()}`;
    const checksumPhotograph = createChecksum(combinedPhotographChecksum);

    const photographToSave = new exampleModel({
      data: {
        id: new Date().getTime(),
        file: {
          ...photograph,
          checksum: checksumPhotograph,
        },
      },
    });

    const resMongoPhotograph = await photographToSave.save();

    const response = await prisma.user.update({
      data: {
        photograph: resMongoPhotograph._id,
      },
      where: {
        id: id as string,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "successfully uploaded file",
      data: response,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "failed uploaded file",
      data: error,
    });
  }
};

export const POSTUploadUserFamilyCertificate = async (
  req: Request,
  res: Response
) => {
  try {
    const { familyCertificateFile } = req.files as reqFiles;
    const { id } = req.query;

    const familyCertificate = familyCertificateFile[0];
    const combinedFamilyCertificateChecksum = `${familyCertificate.fieldname}${
      familyCertificate.originalname
    }${familyCertificate.size}${familyCertificate.buffer.toString()}`;
    const checksumFamilyCertificate = createChecksum(
      combinedFamilyCertificateChecksum
    );

    const familyCertificateToSave = new exampleModel({
      data: {
        id: new Date().getTime(),
        file: {
          ...familyCertificate,
          checksum: checksumFamilyCertificate,
        },
      },
    });

    const resMongoFamilyCertificate = await familyCertificateToSave.save();

    const response = await prisma.user.update({
      data: {
        familyCertificate: resMongoFamilyCertificate._id,
      },
      where: {
        id: id as string,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "successfully uploaded file",
      data: response,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "failed uploaded file",
      data: error,
    });
  }
};

export const POSTUploadUserBpjsEmployment = async (
  req: Request,
  res: Response
) => {
  try {
    const { bpjsOfEmploymentFile } = req.files as reqFiles;
    const { id } = req.query;

    const bpjsEmployment = bpjsOfEmploymentFile[0];
    const combinedBpjsEmploymentChecksum = `${bpjsEmployment.fieldname}${
      bpjsEmployment.originalname
    }${bpjsEmployment.size}${bpjsEmployment.buffer.toString()}`;
    const checksumBpjsEmployment = createChecksum(
      combinedBpjsEmploymentChecksum
    );

    const bpjsEmploymentToSave = new exampleModel({
      data: {
        id: new Date().getTime(),
        file: {
          ...bpjsEmployment,
          checksum: checksumBpjsEmployment,
        },
      },
    });

    const resMongoBpjsEmployment = await bpjsEmploymentToSave.save();

    const response = await prisma.user.update({
      data: {
        bpjsOfEmploymentFile: resMongoBpjsEmployment._id,
      },
      where: {
        id: id as string,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "successfully uploaded file",
      data: response,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "failed uploaded file",
      data: error,
    });
  }
};

export const POSTUploadUserBpjsHealth = async (req: Request, res: Response) => {
  try {
    const { bpjsOfHealthFile } = req.files as reqFiles;
    const { id } = req.query;

    const bpjsHealth = bpjsOfHealthFile[0];
    const combinedBpjsHealthChecksum = `${bpjsHealth.fieldname}${
      bpjsHealth.originalname
    }${bpjsHealth.size}${bpjsHealth.buffer.toString()}`;
    const checksumBpjsHealth = createChecksum(combinedBpjsHealthChecksum);

    const bpjsHealthToSave = new exampleModel({
      data: {
        id: new Date().getTime(),
        file: {
          ...bpjsHealth,
          checksum: checksumBpjsHealth,
        },
      },
    });

    const resMongoBpjsHealth = await bpjsHealthToSave.save();

    const response = await prisma.user.update({
      data: {
        bpjsOfHealthFile: resMongoBpjsHealth._id,
      },
      where: {
        id: id as string,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "successfully uploaded file",
      data: response,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "failed uploaded file",
      data: error,
    });
  }
};

export const POSTUploadUserDecisionLetter = async (
  req: Request,
  res: Response
) => {
  try {
    const { decisionLetterFile } = req.files as reqFiles;
    const { id } = req.query;

    const decisionLetter = decisionLetterFile[0];
    const combinedDecisionLetterChecksum = `${decisionLetter.fieldname}${
      decisionLetter.originalname
    }${decisionLetter.size}${decisionLetter.buffer.toString()}`;
    const checksumDecisionLetter = createChecksum(
      combinedDecisionLetterChecksum
    );

    const decisionLetterToSave = new exampleModel({
      data: {
        id: new Date().getTime(),
        file: {
          ...decisionLetter,
          checksum: checksumDecisionLetter,
        },
      },
    });

    const resMongoDecisionLetter = await decisionLetterToSave.save();

    const response = await prisma.user.update({
      data: {
        decisionLetter: resMongoDecisionLetter._id,
      },
      where: {
        id: id as string,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "successfully uploaded file",
      data: response,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "failed uploaded file",
      data: error,
    });
  }
};

export const POSTUploadUserIdentity = async (req: Request, res: Response) => {
  try {
    const { identityFile } = req.files as reqFiles;
    const { id } = req.query;

    const identity = identityFile[0];
    const combinedIdentityChecksum = `${identity.fieldname}${
      identity.originalname
    }${identity.size}${identity.buffer.toString()}`;
    const checksumIdentity = createChecksum(combinedIdentityChecksum);

    const identityToSave = new exampleModel({
      data: {
        id: new Date().getTime(),
        file: {
          ...identity,
          checksum: checksumIdentity,
        },
      },
    });

    const resMongoIdentity = await identityToSave.save();

    const response = await prisma.user.update({
      data: {
        identity: resMongoIdentity._id,
      },
      where: {
        id: id as string,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "successfully uploaded file",
      data: response,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "failed uploaded file",
      data: error,
    });
  }
};

export const POSTUploadUserNpwp = async (req: Request, res: Response) => {
  try {
    const { npwpFile } = req.files as reqFiles;
    const { id } = req.query;

    const npwp = npwpFile[0];
    const combinedNpwpChecksum = `${npwp.fieldname}${npwp.originalname}${
      npwp.size
    }${npwp.buffer.toString()}`;
    const checksumNpwp = createChecksum(combinedNpwpChecksum);

    const npwpToSave = new exampleModel({
      data: {
        id: new Date().getTime(),
        file: {
          ...npwp,
          checksum: checksumNpwp,
        },
      },
    });

    const resMongoNpwp = await npwpToSave.save();

    const response = await prisma.user.update({
      data: {
        npwp: resMongoNpwp._id,
      },
      where: {
        id: id as string,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "successfully uploaded file",
      data: response,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "failed uploaded file",
      data: error,
    });
  }
};

export const GETAllUserPaginated = async (req: Request, res: Response) => {
  try {
    const { pageSize, pageNumber, searchQuery } = req.query;

    const datas = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                firstName: {
                  contains: searchQuery as string,
                  mode: "insensitive",
                },
              },
              {
                lastName: {
                  contains: searchQuery as string,
                  mode: "insensitive",
                },
              },
            ],
            role: "USER",
          },
        ],
      },
      skip: (Number(pageNumber) - 1) * Number(pageSize),
      take: Number(pageSize),
      orderBy: {
        createdAt: "desc",
      },
    });
    const allDatas = await prisma.user.count({
      where: {
        AND: [
          {
            OR: [
              {
                firstName: {
                  contains: searchQuery as string,
                  mode: "insensitive",
                },
              },
              {
                lastName: {
                  contains: searchQuery as string,
                  mode: "insensitive",
                },
              },
            ],
            role: "USER",
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
