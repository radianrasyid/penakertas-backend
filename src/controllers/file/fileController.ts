import { Request, Response } from "express";
import {
  ExampleDocument,
  default as ExampleModel,
  default as exampleModel,
} from "../../../prisma/mongooseModel"; // Replace with the actual path
import prisma from "../../../prisma/prisma";
import { createChecksum } from "../../lib/processors";
import { Data, reqFiles } from "../../lib/types/general";

export const GETFileById = async (req: Request, res: Response) => {
  const fileId = req.params.fileId;

  try {
    const file: ExampleDocument | null = await ExampleModel.findById(fileId);

    if (!file) {
      return res.status(404).send("File not found");
    }

    const filename = encodeURIComponent(file.data.file.originalname as string); // Encode filename for safe URL
    console.log("ini mimetypenya", file.data.file.mimetype);
    res.setHeader("Content-Length", file.data.file.buffer.length);
    res.setHeader("Content-Type", file.data.file.mimetype as string);
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    res.setHeader("Cache-Control", "public, max-age=0"); // Optional: Disable caching
    res.setHeader("ngrok-skip-browser-warning", "shit");

    res.end(file.data.file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const POSTUploadUserDocument = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { file } = req.files as reqFiles;
  const { fieldToUpdate } = req.body;
  if (!!file) {
    try {
      const currentFile = file[0];
      const combinedPhotographChecksum = `${currentFile.fieldname}${
        currentFile.originalname
      }${currentFile.size}${currentFile.buffer.toString()}`;
      const checksumPhotograph = createChecksum(combinedPhotographChecksum);

      const photographToSave = new exampleModel({
        data: {
          id: new Date().getTime(),
          file: {
            ...currentFile,
            checksum: checksumPhotograph,
          },
        },
      });

      await photographToSave.save();
      const data: Data = {};
      data[fieldToUpdate] = photographToSave._id;
      await prisma.user.update({
        where: {
          id: id as string,
        },
        data: {
          ...data,
        },
      });
      return res.status(201).json({
        status: "success",
        message: `successfully uploaded ${fieldToUpdate} file`,
        data: {
          id: photographToSave._id,
          mimetype: photographToSave.data.file.mimetype,
          link: `http://localhost:52000/api/file/${photographToSave._id}`,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: "failed",
        message: "something went wrong",
        data: error,
      });
    }
  }

  return res.status(400).json({
    status: "failed",
    message: "no file found!",
  });
};
