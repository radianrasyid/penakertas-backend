import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import exampleModel from "../../../prisma/mongooseModel";
import prisma from "../../../prisma/prisma";
import { createChecksum } from "../../lib/processors";

export const POSTUserLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    console.log("TEST BRO", {
      username,
      password,
    });

    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    const isPasswordMatch = await bcrypt.compareSync(
      password,
      user?.password as string
    );
    if (!isPasswordMatch)
      return res.status(400).json({
        status: "failed",
        message: "password or username incorrect",
      });

    const jwt = jsonwebtoken.sign(
      {
        username: user?.username,
        fullname: `${user?.firstName} ${user?.lastName}`,
        id: user?.id,
        email: user?.email,
        image: user?.photograph,
        role: user?.role,
      },
      "radianrasyid"
    );

    return res.status(200).json({
      status: "success",
      message: "successfully logged in",
      data: jwt,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      data: error,
    });
  }
};

export const POSTCheckRole = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    console.log("ini email bro", email);
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    console.log("ini setelah check db", user);

    if (!!user?.role) {
      return res.status(200).json({
        status: "success",
        message: "successfully checked",
        data: user?.role,
      });
    }
    return res.status(401).json({
      status: "failed",
      message: "something went wrong",
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      data: error,
    });
  }
};

export const POSTBulkInsert = async (req: Request, res: Response) => {
  try {
    await prisma.user.createMany({
      data: [
        {
          firstName: "Radian",
          lastName: "Rasyid",
          password: await bcrypt.hash("12345678", 10),
          email: "radian.rasyid@gmail.com",
          username: "radianrasyid",
          role: "SUPER_ADMIN",
        },
        {
          firstName: "Astrid Faradilla",
          lastName: "Pangesti",
          password: await bcrypt.hash("12345678", 10),
          email: "astridfaradilla@gmail.com",
          username: "astridf",
          role: "ADMIN",
        },
        {
          firstName: "Azra",
          lastName: "Ramadhani",
          password: await bcrypt.hash("12345678", 10),
          email: "azraramadhani@gmail.com",
          username: "azraramadhani",
          role: "USER",
        },
      ],
    });

    await prisma.gender.createMany({
      data: [
        {
          name: "MALE",
          value: "MALE",
        },
        {
          name: "FEMALE",
          value: "FEMALE",
        },
      ],
    });

    await prisma.religion.createMany({
      data: [
        {
          name: "ISLAM",
          value: "ISLAM",
        },
      ],
    });

    await prisma.educationLevel.createMany({
      data: [
        {
          name: "S1",
          value: "S1",
        },
        {
          name: "SMA",
          value: "SMA",
        },
        {
          name: "SMP",
          value: "SM",
        },
      ],
    });

    await prisma.maritalStatus.createMany({
      data: [
        {
          name: "Belum Kawin",
          value: "BELUM KAWIN",
        },
        {
          name: "Kawin",
          value: "KAWIN",
        },
        {
          name: "Cerai Hidup",
          value: "CERAI HIDUP",
        },
        {
          name: "Cerai Mati",
          value: "CERAII MATI",
        },
        {
          name: "Nikah Tercatat/Siri",
          value: "NIKAH SIRI",
        },
      ],
    });

    await prisma.workGroup.createMany({
      data: [
        {
          name: "ASN",
          value: "ASN",
        },
        {
          name: "PTT",
          value: "PTT",
        },
        {
          name: "THL",
          value: "THL",
        },
      ],
    });

    await prisma.province.createMany({
      data: [
        "Nanggroe Aceh Darussalam",
        "Sumatera Utara",
        "Sumatera Selatan",
        "Sumatera Barat",
        "Bengkulu",
        "Riau",
        "Kepulauan Riau",
        "Jambi",
        "Lampung",
        "Bangka Belitung",
        "Kalimantan Barat",
        "Kalimantan Timur",
        "Kalimantan Selatan",
        "Kalimantan Tengah",
        "Kalimantan Utara",
        "Banten",
        "DKI Jakarta",
        "Jawa Barat",
        "Jawa Tengah",
        "Daerah Istimewa Yogyakarta",
        "Jawa Timur",
        "Bali",
        "Nusa Tenggara Timur",
        "Nusa Tenggara Barat",
        "Gorontalo",
        "Sulawesi Barat",
        "Sulawesi Tengah",
        "Sulawesi Utara",
        "Sulawesi Tenggara",
        "Sulawesi Selatan",
        "Maluku Utara",
        "Maluku",
        "Papua Barat",
        "Papua",
        "Papua Tengah",
        "Papua Pegunungan",
        "Papua Selatan",
        "Papua Barat Daya",
      ].map((i) => {
        return {
          name: i,
          value: i,
        };
      }),
    });

    return res.status(200).json({
      status: "success",
      message: "successfully inserted",
      data: "MANTAP",
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      data: "DAH DI UPLOAD KEKNYA",
    });
  }
};

export const POSTCreateUser = async (req: Request, res: Response) => {
  interface reqFiles {
    [fieldname: string]: Express.Multer.File[];
  }
  try {
    const {
      address,
      backTitle,
      birthPlace,
      bpjsOfEmployment,
      bpjsOfHealth,
      dateOfBirth,
      decisionLetterNumber,
      district,
      email,
      familyCertificateNumber,
      firstname,
      frontTitle,
      gender,
      identityNumber,
      lastname,
      latestEducation,
      maritalStatus,
      neighborhood,
      neighborhoodHead,
      npwp,
      nrpt,
      phoneNumber,
      placement,
      province,
      religion,
      startYear,
      subdistrict,
      telephone,
      ward,
      workDescription,
      workGroup,
      workPart,
      npwpNumber,
      workUnit,
    }: {
      nrpt: string;
      firstname: string;
      lastname: string;
      frontTitle: string;
      backTitle: string;
      workGroup: string;
      workUnit: string;
      workPart: string;
      religion: string | null;
      gender: string | null;
      latestEducation: string | null;
      maritalStatus: string | null;
      workDescription: string | null;
      placement: string | null;
      startYear: string;
      decisionLetterNumber: string | null;
      neighborhood: string | null;
      neighborhoodHead: string | null;
      province: string | null;
      district: string | null;
      subdistrict: string | null;
      ward: string | null;
      address: string | null;
      birthPlace: string | null;
      dateOfBirth: string | Date | null;
      phoneNumber: string | null;
      telephone: string | null;
      email: string | null;
      familyCertificateNumber: string | null;
      identityNumber: string | null;
      npwp: string | null;
      npwpNumber: string | null;
      bpjsOfEmployment: string | null;
      bpjsOfHealth: string | null;
    } = req.body;

    const {
      photograph,
      
    } = req.files as reqFiles;

    switch (true) {
      case !!(req.files as reqFiles).photograph:
        const photograph = (req.files as reqFiles).photograph[0];
        const combinedPhotographChecksum = `${photograph.fieldname}${
          photograph.originalname
        }${photograph.size}${photograph.buffer.toString()}`;
        const checksumPhotograph = createChecksum(combinedPhotographChecksum);

        const newExample = new exampleModel({
          data: {
            id: new Date().getTime(),
            file: {
              ...(req.files as reqFiles).photograph[0],
              checksum: checksumPhotograph,
            },
          },
        });

        const resMongo = await newExample.save();
        break;
      case 
    }

    const officerData = await prisma.user.create({
      data: {
        firstName: firstname,
        lastName: lastname,
        password: await bcrypt.hash("12345678", 10),
        role: "USER",
        backTitle: backTitle,
        birthPlace: birthPlace,
        bpjsOfEmployment: bpjsOfEmployment,
        bpjsOfHealth: bpjsOfHealth,
        cityDistrict: district,
        dateOfBirth: new Date(dateOfBirth as string),
        decisionLetterNumber: decisionLetterNumber,
        email: email,
        employmentId: nrpt,
        frontTitle: frontTitle,
        gender: gender,
        jobDescription: workDescription,
        homeAddress: address,
        latestEducationLevel: latestEducation,
        maritalStatus: maritalStatus,
        religion: religion,
        neighborhood: neighborhood,
        neighborhoodHead: neighborhoodHead,
        phoneNumber: phoneNumber,
        Province: province,
        startingYear: new Date(),
        placementLocation: placement,
        subdistrict: subdistrict,
        telephone: telephone,
        username: `${firstname}${new Date().getTime()}`,
        ward: ward,
        workGroup: workGroup,
        workPart: workPart,
        workUnit: workUnit,
        familyCertificateNumber: familyCertificateNumber,
        identityNumber: identityNumber,
        npwpNumber: npwpNumber,
        photograph: (req.files as reqFiles).photograph[0].buffer,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "successfully created new user",
      data: officerData,
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
