import { Request, Response } from "express";
import { userAccess } from "../../../prisma/mongooseModel";

export const GetAllAccessData = async (req: Request, res: Response) => {
  try {
    const result = await userAccess.find();
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

export const GETAccessDataById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await userAccess.findOne({ _id: id as string });

    return res.status(200).json({
      status: "success",
      message: "retreive data success",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "retreive data failed",
    });
  }
};

export const PUTUpdateData = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { updatedData } = req.body;

    const isSomeData = await userAccess.findById(id as string);

    if (!!isSomeData) {
      const updateData = await userAccess.findByIdAndUpdate(
        id as string,
        { data: updatedData },
        {
          new: true,
          runValidators: true,
        }
      );
      return res.status(200).json({
        status: "success",
        message: "edit data success",
        data: updateData,
      });
    }

    return res.status(304).json({
      status: "success",
      message: "no data found",
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

export const DELETEAccessData = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleteResult = await userAccess.findByIdAndDelete(id as string);

    return res.status(201).json({
      status: "success",
      message: "delete data success",
      data: deleteResult,
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
