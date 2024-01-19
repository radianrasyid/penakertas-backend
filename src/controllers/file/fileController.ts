import { Request, Response } from "express";
import ExampleModel, { ExampleDocument } from "../../../prisma/mongooseModel"; // Replace with the actual path

export const GETFileById = async (req: Request, res: Response) => {
  const fileId = req.params.fileId;

  try {
    const file: ExampleDocument | null = await ExampleModel.findById(fileId);

    if (!file) {
      return res.status(404).send("File not found");
    }

    res.setHeader("Content-Length", file.data.file.buffer.length);
    res.setHeader("Content-Type", file.data.file.mimetype as string);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${file.data.file.originalname}`
    );

    res.end(file.data.file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
