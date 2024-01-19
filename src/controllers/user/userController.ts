import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import exampleModel from "../../../prisma/mongooseModel";
import prisma from "../../../prisma/prisma";
import { createChecksum } from "../../lib/processors";
import { reqFiles } from "../../lib/types/general";

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
        image: `https://relaxed-caiman-strongly.ngrok-free.app/api/file/${user?.photograph}`,
        role: user?.role,
      },
      process.env.JWT_SECRET_KEY as string
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
        {
          firstName: "Ramonzha",
          lastName: "",
          password: await bcrypt.hash("12345678", 10),
          email: "ramonzha@gmail.com",
          username: "ramonzha",
          role: "SUPER_ADMIN",
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
          name: "Islam",
          value: "ISLAM",
        },
        {
          name: "Kristen",
          value: "KRISTEN",
        },
        {
          name: "Katolik",
          value: "KATOLIK",
        },
        {
          name: "Hindu",
          value: "HINDU",
        },
        {
          name: "Buddha",
          value: "BUDDHA",
        },
        {
          name: "Khonghucu",
          value: "KHONGHUCU",
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

    await prisma.workUnit.createMany({
      data: [
        "Biro Pemerintahan dan Otonomi Daerah",
        "Biro Kesejahteraan Rakyat",
        "Biro Hukum",
        "Biro Perekonomian dan Pembangunan",
        "Biro Pengadaan Barang dan Jasa",
        "Biro Organisasi",
        "Biro Umum",
        "Biro Administrasi Pimpinan",
      ].map((i) => {
        return {
          name: i,
          value: i.toUpperCase(),
        };
      }),
    });

    await prisma.workPart.createMany({
      data: [
        "Bagian Kerjasama",
        "Sub Bagian Tata Usaha",
        "Bagian Peraturan Perundang-Undangan Provinsi",
        "Bagian Peraturan Perundang-Undangan Kabupaten/Kota",
        "Bagian Bantuan Hukum",
        "Bagian Pengelolaan Pengadaan Barang dan Jasa",
        "Bagian Pengelolaan Layanan Pengadaan Secara Elektronik",
        "Bagian Pembinaan dan Advokasi Pengadaan Barang dan Jasa",
        "Bagian Kelembagaan dan Analisis Jabatan",
        "Bagian Reformasi Birokrasi dan Akuntabilitas Kinerja",
        "Bagian Tatalaksana",
        "Bagian Rumah Tangga",
        "Bagian Administrasi Keuangan dan Aset",
        "Bagian Tata Usaha",
        "Sub Bagian Tata Usaha Pimpinan dan Staf Ahli",
        "Bagian Perencanaan dan Kepegawaian Setda",
        "Bagian Materi dan Komunikasi Pimpinan",
        "Bagian Protokol",
        "Sub Bagian Pembinaan Kelembagaan Pengadaan Badang dan Jasa",
      ].map((e) => {
        return {
          name: e,
          value: e.toUpperCase(),
        };
      }),
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
      photographFile,
      familyCertificateFile,
      bpjsOfEmploymentFile,
      decisionLetterFile,
      identityFile,
      npwpFile,
      bpjsOfHealthFile,
    } = req.files as reqFiles;
    let filesResponse = {
      resMongoPhotograph: null,
      resMongoFamCert: null,
      resMongoBpjsEmploy: null,
      resMongoDecLetter: null,
      resMongoIdFile: null,
      resMongoNpFile: null,
      resMongoBpjsHealth: null,
    } as {
      resMongoPhotograph: null | any;
      resMongoFamCert: null | any;
      resMongoBpjsEmploy: null | any;
      resMongoDecLetter: null | any;
      resMongoIdFile: null | any;
      resMongoNpFile: null | any;
      resMongoBpjsHealth: null | any;
    };

    console.log("testing file", req.files);

    switch (true) {
      case !!photographFile:
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
        filesResponse = {
          ...filesResponse,
          resMongoPhotograph: resMongoPhotograph,
        };
      case !!familyCertificateFile:
        const famCert = familyCertificateFile[0];
        const combinedFamCertCheckum = `${famCert.fieldname}${
          famCert.originalname
        }${famCert.size}${famCert.buffer.toString()}`;
        const checksumFamCert = createChecksum(combinedFamCertCheckum);

        const famCertToSave = new exampleModel({
          data: {
            id: new Date().getTime(),
            file: {
              ...famCert,
              checksum: checksumFamCert,
            },
          },
        });

        const resMongoFamCert = await famCertToSave.save();
        filesResponse = {
          ...filesResponse,
          resMongoFamCert: resMongoFamCert,
        };
      case !!bpjsOfEmploymentFile:
        const bpjsEmploy = bpjsOfEmploymentFile[0];
        const combinedbpjsEmployCheckum = `${bpjsEmploy.fieldname}${
          bpjsEmploy.originalname
        }${bpjsEmploy.size}${bpjsEmploy.buffer.toString()}`;
        const checksumBpjsEmploy = createChecksum(combinedbpjsEmployCheckum);

        const bpjsEmployToSave = new exampleModel({
          data: {
            id: new Date().getTime(),
            file: {
              ...bpjsEmploy,
              checksum: checksumBpjsEmploy,
            },
          },
        });

        const resMongoBpjsEmploy = await bpjsEmployToSave.save();
        filesResponse = {
          ...filesResponse,
          resMongoBpjsEmploy: resMongoBpjsEmploy,
        };
      case !!decisionLetterFile:
        const decLetter = decisionLetterFile[0];
        const combinedDecLetterCheckum = `${decLetter.fieldname}${
          decLetter.originalname
        }${decLetter.size}${decLetter.buffer.toString()}`;
        const checksumDecLetter = createChecksum(combinedDecLetterCheckum);

        const decLetterToSave = new exampleModel({
          data: {
            id: new Date().getTime(),
            file: {
              ...decLetter,
              checksum: checksumDecLetter,
            },
          },
        });

        const resMongoDecLetter = await decLetterToSave.save();
        filesResponse = {
          ...filesResponse,
          resMongoDecLetter: resMongoDecLetter,
        };
      case !!identityFile:
        const idFile = identityFile[0];
        const combinedIdFileCheckum = `${idFile.fieldname}${
          idFile.originalname
        }${idFile.size}${idFile.buffer.toString()}`;
        const checksumIdFile = createChecksum(combinedIdFileCheckum);

        const idFileToSave = new exampleModel({
          data: {
            id: new Date().getTime(),
            file: {
              ...idFile,
              checksum: checksumIdFile,
            },
          },
        });

        const resMongoIdFile = await idFileToSave.save();
        filesResponse = {
          ...filesResponse,
          resMongoIdFile: resMongoIdFile,
        };
      case !!npwpFile:
        const npFile = npwpFile[0];
        const combinedNpFileCheckum = `${npFile.fieldname}${
          npFile.originalname
        }${npFile.size}${npFile.buffer.toString()}`;
        const checksumNpFile = createChecksum(combinedNpFileCheckum);

        const npFileToSave = new exampleModel({
          data: {
            id: new Date().getTime(),
            file: {
              ...npFile,
              checksum: checksumNpFile,
            },
          },
        });

        const resMongoNpFile = await npFileToSave.save();
        filesResponse = {
          ...filesResponse,
          resMongoNpFile: resMongoNpFile,
        };
      case !!bpjsOfHealthFile:
        const bpjsHealth = bpjsOfHealthFile[0];
        const combinedbpjsHealthCheckum = `${bpjsHealth.fieldname}${
          bpjsHealth.originalname
        }${bpjsHealth.size}${bpjsHealth.buffer.toString()}`;
        const checksumBpjsHealth = createChecksum(combinedbpjsHealthCheckum);

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
        filesResponse = {
          ...filesResponse,
          resMongoBpjsHealth: resMongoBpjsHealth,
        };
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
        photograph: filesResponse.resMongoPhotograph?._id || null,
        npwp: filesResponse.resMongoNpFile?._id || null,
        identity: filesResponse.resMongoIdFile?._id || null,
        decisionLetter: filesResponse.resMongoDecLetter?._id || null,
        familyCertificate: filesResponse.resMongoFamCert?._id || null,
        bpjsOfEmploymentFile: filesResponse.resMongoBpjsEmploy?._id || null,
        bpjsOfHealthFile: filesResponse.resMongoBpjsHealth?._id || null,
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

export const POSTWhoAmI = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
