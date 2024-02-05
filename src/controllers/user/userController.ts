import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import exampleModel, {
  ExampleDocument,
  userAccess,
} from "../../../prisma/mongooseModel";
import prisma from "../../../prisma/prisma";
import { createChecksum } from "../../lib/processors";
import { Data, reqFiles } from "../../lib/types/general";

export const POSTUserLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    console.log("ini req body", req.body);

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: username,
          },
          {
            employmentId: username,
          },
        ],
      },
    });
    if (user?.email == undefined) {
      return res.status(400).json({
        status: "failed",
        message: "credential might be wrong",
      });
    }
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
        image: !!user?.photograph
          ? `http://localhost:52000/api/file/${user?.photograph}`
          : null,
        role: user?.role,
        expire: new Date().getTime() + 5000,
        nipp: user.employmentId,
        access: await userAccess.findOne({ "data.title": user?.role }),
      },
      process.env.JWT_SECRET_KEY as string
    );

    return res.status(200).json({
      status: "success",
      message: "successfully logged in",
      data: jwt,
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

export const GETRefreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized!",
      });
    }

    const decoded = jsonwebtoken.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as any;

    if (!decoded.username) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized!",
      });
    }

    const timeDifference =
      (new Date().getTime() - decoded.iat * 1000) / 1000 / 60;

    if (Number(timeDifference.toFixed()))
      return res.status(401).json({
        status: "failed",
        message: "unauthorized",
      });

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: decoded.username,
          },
          {
            email: decoded.email,
          },
        ],
      },
    });

    const jwt = jsonwebtoken.sign(
      {
        username: user?.username,
        fullname: `${user?.firstName} ${user?.lastName}`,
        id: user?.id,
        email: user?.email,
        image: !!user?.photograph
          ? `http://localhost:52000/api/file/${user?.photograph}`
          : null,
        role: user?.role,
        expire: new Date().getTime() + 5000,
        access: await userAccess.findOne({ "data.title": user?.role }),
      },
      process.env.JWT_SECRET_KEY as string
    );

    return res.status(200).json({
      status: "success",
      message: "refreshed",
      data: jwt,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: "failed",
      message: "Unauthorized!",
      data: error,
    });
  }
};

export const POSTCheckRole = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

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
    const test1 = await userAccess.create({
      data: {
        title: "ROOT",
        access: {
          menu: [
            {
              name: "Beranda",
              access: {
                read: true,
                add: false,
                update: false,
                delete: false,
                detail: false,
              },
            },
            {
              name: "Data Master",
              access: {
                read: true,
                add: true,
                update: true,
                delete: true,
                detail: true,
              },
              children: [
                {
                  name: "Provinsi",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Kabupaten/Kota",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Kecamatan",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Kelurahan",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Agama",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Bagian",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Golongan",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Jabatan",
                  access: {
                    read: false,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
                {
                  name: "Jenis Kelamin",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Jenis Cuti",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Kegiatan Anak",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Kelompok Pekerjaan",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Pekerjaan",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Pendidikan",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Status Anak",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Sumber Gaji",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Status Orang Tua",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Status Pasangan",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Status Perkawinan",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Tunjangan Anak",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Unit Kerja",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
              ],
            },
            {
              name: "Pegawai",
              access: {
                read: true,
                add: true,
                update: true,
                delete: true,
                detail: true,
              },
            },
            {
              name: "Biodata",
              access: {
                read: true,
                add: false,
                update: false,
                delete: false,
                detail: false,
              },
            },
            {
              name: "Riwayat Pendidikan",
              access: {
                read: true,
                add: true,
                update: true,
                delete: true,
                detail: true,
              },
            },
            {
              name: "Riwayat Pernikahan",
              access: {
                read: true,
                add: true,
                update: true,
                delete: true,
                detail: true,
              },
            },
            {
              name: "Data Anak",
              access: {
                read: true,
                add: true,
                update: true,
                delete: true,
                detail: true,
              },
            },
            {
              name: "Data Orang Tua",
              access: {
                read: true,
                add: true,
                update: true,
                delete: true,
                detail: true,
              },
            },
            {
              name: "Cuti",
              access: {
                read: true,
                add: true,
                update: true,
                delete: true,
                detail: true,
              },
            },
            {
              name: "SK Kerja",
              access: {
                read: true,
                add: true,
                update: true,
                delete: true,
                detail: false,
              },
            },
            {
              name: "Laporan",
              access: {
                read: true,
                add: false,
                update: false,
                delete: false,
                detail: false,
              },
              children: [
                {
                  name: "Laporan Pegawai",
                  access: {
                    read: true,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
                {
                  name: "Laporan Pegawai ASN",
                  access: {
                    read: false,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
                {
                  name: "Laporan Pegawai CPNS",
                  access: {
                    read: false,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
                {
                  name: "Laporan Pegawai Honor",
                  access: {
                    read: false,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
              ],
            },
            {
              name: "Akun",
              access: {
                read: true,
                add: false,
                update: false,
                delete: false,
                detail: false,
              },
              children: [
                {
                  name: "Role",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Akun",
                  access: {
                    read: true,
                    add: false,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Akses",
                  access: {
                    read: true,
                    add: false,
                    update: true,
                    delete: false,
                    detail: false,
                  },
                },
                {
                  name: "Profil",
                  access: {
                    read: true,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
              ],
            },
          ],
        },
      },
    });
    const test2 = await userAccess.create({
      data: {
        title: "ADMIN",
        access: {
          menu: [
            {
              name: "Beranda",
              access: {
                read: true,
                add: false,
                update: false,
                delete: false,
                detail: false,
              },
            },
            {
              name: "Data Master",
              access: {
                read: true,
                add: false,
                update: false,
                delete: false,
                detail: false,
              },
              children: [
                {
                  name: "Provinsi",
                  access: {
                    read: true,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
                {
                  name: "Kabupaten/Kota",
                  access: {
                    read: true,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
                {
                  name: "Kecamatan",
                  access: {
                    read: true,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
                {
                  name: "Kelurahan",
                  access: {
                    read: true,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
                {
                  name: "Agama",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Bagian",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Golongan",
                  access: {
                    read: true,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
                {
                  name: "Jabatan",
                  access: {
                    read: false,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
                {
                  name: "Jenis Kelamin",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Jenis Cuti",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Kegiatan Anak",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Kelompok Pekerjaan",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Pekerjaan",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Pendidikan",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Status Anak",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Sumber Gaji",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Status Orang Tua",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Status Pasangan",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Status Perkawinan",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Tunjangan Anak",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Unit Kerja",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
              ],
            },
            {
              name: "Pegawai",
              access: {
                read: true,
                add: true,
                update: true,
                delete: false,
                detail: true,
              },
            },
            {
              name: "Biodata",
              access: {
                read: true,
                add: false,
                update: false,
                delete: false,
                detail: false,
              },
            },
            {
              name: "Riwayat Pendidikan",
              access: {
                read: true,
                add: true,
                update: true,
                delete: true,
                detail: true,
              },
            },
            {
              name: "Riwayat Pernikahan",
              access: {
                read: true,
                add: true,
                update: true,
                delete: true,
                detail: true,
              },
            },
            {
              name: "Data Anak",
              access: {
                read: true,
                add: true,
                update: true,
                delete: true,
                detail: true,
              },
            },
            {
              name: "Data Orang Tua",
              access: {
                read: true,
                add: true,
                update: true,
                delete: true,
                detail: true,
              },
            },
            {
              name: "Cuti",
              access: {
                read: true,
                add: true,
                update: true,
                delete: true,
                detail: true,
              },
            },
            {
              name: "SK Kerja",
              access: {
                read: true,
                add: true,
                update: true,
                delete: true,
                detail: false,
              },
            },
            {
              name: "Laporan",
              access: {
                read: true,
                add: false,
                update: false,
                delete: false,
                detail: false,
              },
              children: [
                {
                  name: "Laporan Pegawai",
                  access: {
                    read: true,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
                {
                  name: "Laporan Pegawai ASN",
                  access: {
                    read: false,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
                {
                  name: "Laporan Pegawai CPNS",
                  access: {
                    read: false,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
                {
                  name: "Laporan Pegawai Honor",
                  access: {
                    read: false,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
              ],
            },
            {
              name: "Akun",
              access: {
                read: true,
                add: false,
                update: false,
                delete: false,
                detail: false,
              },
              children: [
                {
                  name: "Role",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Akun",
                  access: {
                    read: true,
                    add: false,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Akses",
                  access: {
                    read: true,
                    add: false,
                    update: true,
                    delete: false,
                    detail: false,
                  },
                },
                {
                  name: "Profil",
                  access: {
                    read: true,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
              ],
            },
          ],
        },
      },
    });
    const test3 = await userAccess.create({
      data: {
        title: "PEGAWAI",
        access: {
          menu: [
            {
              name: "Beranda",
              access: {
                read: true,
                add: false,
                update: false,
                delete: false,
                detail: false,
              },
            },
            {
              name: "Data Master",
              access: {
                read: true,
                add: false,
                update: false,
                delete: false,
                detail: false,
              },
              children: [
                {
                  name: "Provinsi",
                  access: {
                    read: true,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
                {
                  name: "Kabupaten/Kota",
                  access: {
                    read: true,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
                {
                  name: "Kecamatan",
                  access: {
                    read: true,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
                {
                  name: "Kelurahan",
                  access: {
                    read: true,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
                {
                  name: "Agama",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Bagian",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Golongan",
                  access: {
                    read: true,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
                {
                  name: "Jabatan",
                  access: {
                    read: false,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
                {
                  name: "Jenis Kelamin",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Jenis Cuti",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Kegiatan Anak",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Kelompok Pekerjaan",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Pekerjaan",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Pendidikan",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Status Anak",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Sumber Gaji",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Status Orang Tua",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Status Pasangan",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Status Perkawinan",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Tunjangan Anak",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Unit Kerja",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
              ],
            },
            {
              name: "Pegawai",
              access: {
                read: true,
                add: true,
                update: true,
                delete: false,
                detail: true,
              },
            },
            {
              name: "Biodata",
              access: {
                read: true,
                add: false,
                update: false,
                delete: false,
                detail: false,
              },
            },
            {
              name: "Riwayat Pendidikan",
              access: {
                read: true,
                add: true,
                update: true,
                delete: true,
                detail: true,
              },
            },
            {
              name: "Riwayat Pernikahan",
              access: {
                read: true,
                add: true,
                update: true,
                delete: true,
                detail: true,
              },
            },
            {
              name: "Data Anak",
              access: {
                read: true,
                add: true,
                update: true,
                delete: true,
                detail: true,
              },
            },
            {
              name: "Data Orang Tua",
              access: {
                read: true,
                add: true,
                update: true,
                delete: true,
                detail: true,
              },
            },
            {
              name: "Cuti",
              access: {
                read: true,
                add: true,
                update: true,
                delete: true,
                detail: true,
              },
            },
            {
              name: "SK Kerja",
              access: {
                read: true,
                add: true,
                update: true,
                delete: true,
                detail: false,
              },
            },
            {
              name: "Laporan",
              access: {
                read: true,
                add: false,
                update: false,
                delete: false,
                detail: false,
              },
              children: [
                {
                  name: "Laporan Pegawai",
                  access: {
                    read: true,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
                {
                  name: "Laporan Pegawai ASN",
                  access: {
                    read: false,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
                {
                  name: "Laporan Pegawai CPNS",
                  access: {
                    read: false,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
                {
                  name: "Laporan Pegawai Honor",
                  access: {
                    read: false,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
              ],
            },
            {
              name: "Akun",
              access: {
                read: true,
                add: false,
                update: false,
                delete: false,
                detail: false,
              },
              children: [
                {
                  name: "Role",
                  access: {
                    read: true,
                    add: true,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Akun",
                  access: {
                    read: true,
                    add: false,
                    update: true,
                    delete: true,
                    detail: false,
                  },
                },
                {
                  name: "Akses",
                  access: {
                    read: true,
                    add: false,
                    update: true,
                    delete: false,
                    detail: false,
                  },
                },
                {
                  name: "Profil",
                  access: {
                    read: true,
                    add: false,
                    update: false,
                    delete: false,
                    detail: false,
                  },
                },
              ],
            },
          ],
        },
      },
    });

    await prisma.category.createMany({
      data: [
        {
          name: "Juru Muda",
          additionalName: "Ia",
          value: "Ia / Juru Muda",
        },
        {
          name: "Juru Muda Tk I",
          additionalName: "Ib",
          value: "Ib / Juru Muda Tk I",
        },
        {
          name: "Juru",
          additionalName: "Ic",
          value: "Ic / Juru",
        },
      ],
    });
    await prisma.leaveType.createMany({
      data: [
        {
          name: "A",
          description: "A",
        },
        {
          name: "B",
          description: "B",
        },
      ],
    });
    await prisma.childActivity.createMany({
      data: ["Pelajar", "Mahasiswa", "Pekerja", "Belum Sekolah"].map((i) => {
        return {
          name: i,
          value: i.toUpperCase(),
        };
      }),
    });
    await prisma.profession.createMany({
      data: [
        "Swasta",
        "Pegawai Negeri Sipil",
        "Non ASN (PTT/THL)",
        "Pensiunan",
        "Lainnya",
      ].map((i) => {
        return {
          name: i,
          value: i.toUpperCase(),
        };
      }),
    });
    await prisma.childStatus.createMany({
      data: ["Anak Kandung", "Anak Sambung"].map((i) => {
        return {
          name: i,
          value: i.toUpperCase(),
        };
      }),
    });
    await prisma.sourceOfSalary.createMany({
      data: ["APBD", "APBN"].map((i) => {
        return {
          name: i,
          value: i.toUpperCase(),
        };
      }),
    });
    await prisma.parentStatus.createMany({
      data: ["Hidup", "Meninggal"].map((i) => {
        return {
          name: i,
          value: i.toUpperCase(),
        };
      }),
    });
    await prisma.partnerStatus.createMany({
      data: ["Suami", "Istri"].map((i) => {
        return {
          name: i,
          value: i.toUpperCase(),
        };
      }),
    });
    await prisma.childSupport.createMany({
      data: ["Dapat", "Tidak Dapat"].map((i) => {
        return {
          name: i,
          value: i.toUpperCase(),
        };
      }),
    });
    await prisma.user.createMany({
      data: [
        {
          firstName: "Radian",
          lastName: "Rasyid",
          password: await bcrypt.hash("12345678", 10),
          email: "radian.rasyid@gmail.com",
          username: "radianrasyid",
          role: "ROOT",
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
          role: "PEGAWAI",
        },
        {
          firstName: "Ramonzha",
          lastName: "",
          password: await bcrypt.hash("12345678", 10),
          email: "ramonzha@gmail.com",
          username: "ramonzha",
          role: "ROOT",
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
    console.log("TEST BRO", {
      test1,
      test2,
      test3,
    });
    return res.status(200).json({
      status: "success",
      message: "successfully inserted",
      data: {
        test1,
        test2,
        test3,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      data: "DAH DI UPLOAD KEKNYA",
    });
  }
};

export const PATCHUserData = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      backTitle,
      birthPlace,
      bpjsOfEmployment,
      bpjsOfHealth,
      childs,
      cityDistrict,
      createdAt,
      dateOfBirth,
      decisionLetterNumber,
      email,
      employmentId,
      familyCertificateNumber,
      firstName,
      frontTitle,
      gender,
      homeAddress,
      identityNumber,
      jobDescription,
      lastName,
      latestEducationLevel,
      leaves,
      maritalStatus,
      neighborhood,
      neighborhoodHead,
      npwpNumber,
      phoneNumber,
      placementLocation,
      Province,
      relationships,
      religion,
      startingYear,
      subdistrict,
      telephone,
      ward,
      workGroup,
      workPart,
      workUnit,
    } = req.body;
    const duplicatedReqBody: Data = { ...req.body };
    console.log("ini data yang masuk ke dalam cok", {
      duplicatedReqBody,
      id,
    });
    const result = await prisma.user.update({
      where: {
        employmentId: id,
      },
      data: {
        ...duplicatedReqBody,
      },
    });
    return res.status(200).json({
      status: "success",
      message: "data has been edited",
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

export const GETWhoAmI = async (req: Request, res: Response) => {
  try {
    const data = (req as any).user;
    console.log("ini data masuk ke whoami", data);

    const user = await prisma.user.findUnique({
      where: {
        id: data.id,
      },
      select: {
        id: true,
        email: true,
        username: true,
        employmentId: true,
        firstName: true,
        lastName: true,
        frontTitle: true,
        backTitle: true,
        workGroup: true,
        workUnit: true,
        workPart: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
        leaves: true,
        childs: true,
        relationships: true,
        identity: true,
        photograph: true,
        familyCertificate: true,
        bpjsOfEmploymentFile: true,
        bpjsOfHealthFile: true,
        npwp: true,
        latestEducationLevel: true,
        maritalStatus: true,
        religion: true,
        identityNumber: true,
        npwpNumber: true,
        familyCertificateNumber: true,
        jobDescription: true,
        placementLocation: true,
        startingYear: true,
        decisionLetterNumber: true,
        homeAddress: true,
        neighborhood: true,
        neighborhoodHead: true,
        Province: true,
        cityDistrict: true,
        subdistrict: true,
        ward: true,
        birthPlace: true,
        dateOfBirth: true,
        phoneNumber: true,
        telephone: true,
        decisionLetter: true,
        bpjsOfEmployment: true,
        bpjsOfHealth: true,
        role: true,
      },
    });
    console.log(
      "ini file photograph hasil upload baru",
      await exampleModel.findById(user?.identity)
    );
    const result = {
      ...user,
      identity: !!user?.identity
        ? {
            mimetype: (
              (await exampleModel.findById(user.identity)) as ExampleDocument
            ).data.file.mimetype,
            link: `http://localhost:52000/api/file/${
              ((await exampleModel.findById(user.identity)) as ExampleDocument)
                ._id
            }`,
          }
        : null,
      photograph: !!user?.photograph
        ? {
            mimetype: (
              (await exampleModel.findById(user.photograph)) as ExampleDocument
            ).data.file.mimetype,
            link: `http://localhost:52000/api/file/${
              (
                (await exampleModel.findById(
                  user.photograph
                )) as ExampleDocument
              )._id
            }`,
          }
        : null,
      familyCertificate: !!user?.familyCertificate
        ? {
            mimetype: (
              (await exampleModel.findById(
                user.familyCertificate
              )) as ExampleDocument
            ).data.file.mimetype,
            link: `http://localhost:52000/api/file/${
              (
                (await exampleModel.findById(
                  user.familyCertificate
                )) as ExampleDocument
              )._id
            }`,
          }
        : null,
      bpjsOfEmploymentFile: !!user?.bpjsOfEmploymentFile
        ? {
            mimetype: (
              (await exampleModel.findById(
                user.bpjsOfEmploymentFile
              )) as ExampleDocument
            ).data.file.mimetype,
            link: `http://localhost:52000/api/file/${
              (
                (await exampleModel.findById(
                  user.bpjsOfEmploymentFile
                )) as ExampleDocument
              )._id
            }`,
          }
        : null,
      bpjsOfHealthFile: !!user?.bpjsOfHealthFile
        ? {
            mimetype: (
              (await exampleModel.findById(
                user.bpjsOfHealthFile
              )) as ExampleDocument
            ).data.file.mimetype,
            link: `http://localhost:52000/api/file/${
              (
                (await exampleModel.findById(
                  user.bpjsOfHealthFile
                )) as ExampleDocument
              )._id
            }`,
          }
        : null,
      npwp: !!user?.npwp
        ? {
            mimetype: (
              (await exampleModel.findById(user.npwp)) as ExampleDocument
            ).data.file.mimetype,
            link: `http://localhost:52000/api/file/${
              ((await exampleModel.findById(user.npwp)) as ExampleDocument)._id
            }`,
          }
        : null,
      decisionLetter: !!user?.decisionLetter
        ? {
            mimetype: (
              (await exampleModel.findById(
                user.decisionLetter
              )) as ExampleDocument
            ).data.file.mimetype,
            link: `http://localhost:52000/api/file/${
              (
                (await exampleModel.findById(
                  user.decisionLetter
                )) as ExampleDocument
              )._id
            }`,
          }
        : null,
      access: await userAccess.findOne({ "data.title": user?.role }),
    };

    return res.status(200).json({
      status: "success",
      message: "data retreived successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: "failed",
      message: "invalid token",
    });
  }
};

export const GETEmployeeDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("ini id", id);

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            id: id,
          },
          {
            username: id,
          },
          {
            email: id,
          },
        ],
      },
      select: {
        id: true,
        email: true,
        username: true,
        employmentId: true,
        firstName: true,
        lastName: true,
        frontTitle: true,
        educations: true,
        parents: true,
        backTitle: true,
        workGroup: true,
        workUnit: true,
        workPart: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
        leaves: true,
        childs: true,
        relationships: true,
        identity: true,
        photograph: true,
        familyCertificate: true,
        bpjsOfEmploymentFile: true,
        bpjsOfHealthFile: true,
        npwp: true,
        latestEducationLevel: true,
        maritalStatus: true,
        religion: true,
        identityNumber: true,
        npwpNumber: true,
        familyCertificateNumber: true,
        jobDescription: true,
        placementLocation: true,
        startingYear: true,
        decisionLetterNumber: true,
        homeAddress: true,
        neighborhood: true,
        neighborhoodHead: true,
        Province: true,
        cityDistrict: true,
        subdistrict: true,
        ward: true,
        birthPlace: true,
        dateOfBirth: true,
        phoneNumber: true,
        telephone: true,
        decisionLetter: true,
        bpjsOfEmployment: true,
        bpjsOfHealth: true,
      },
    });
    const result = {
      ...user,
      identity: !!user?.identity
        ? {
            id: user.identity,
            mimetype: (
              (await exampleModel.findById(user.identity)) as ExampleDocument
            ).data.file.mimetype,
            link: `http://localhost:52000/api/file/${
              ((await exampleModel.findById(user.identity)) as ExampleDocument)
                ._id
            }`,
          }
        : null,
      photograph: !!user?.photograph
        ? {
            id: user.photograph,
            mimetype: (
              (await exampleModel.findById(user.photograph)) as ExampleDocument
            ).data.file.mimetype,
            link: `http://localhost:52000/api/file/${
              (
                (await exampleModel.findById(
                  user.photograph
                )) as ExampleDocument
              )._id
            }`,
          }
        : null,
      familyCertificate: !!user?.familyCertificate
        ? {
            id: user.familyCertificate,
            mimetype: (
              (await exampleModel.findById(
                user.familyCertificate
              )) as ExampleDocument
            ).data.file.mimetype,
            link: `http://localhost:52000/api/file/${
              (
                (await exampleModel.findById(
                  user.familyCertificate
                )) as ExampleDocument
              )._id
            }`,
          }
        : null,
      bpjsOfEmploymentFile: !!user?.bpjsOfEmploymentFile
        ? {
            id: user.bpjsOfEmploymentFile,
            mimetype: (
              (await exampleModel.findById(
                user.bpjsOfEmploymentFile
              )) as ExampleDocument
            ).data.file.mimetype,
            link: `http://localhost:52000/api/file/${
              (
                (await exampleModel.findById(
                  user.bpjsOfEmploymentFile
                )) as ExampleDocument
              )._id
            }`,
          }
        : null,
      bpjsOfHealthFile: !!user?.bpjsOfHealthFile
        ? {
            id: user.bpjsOfHealthFile,
            mimetype: (
              (await exampleModel.findById(
                user.bpjsOfHealthFile
              )) as ExampleDocument
            ).data.file.mimetype,
            link: `http://localhost:52000/api/file/${
              (
                (await exampleModel.findById(
                  user.bpjsOfHealthFile
                )) as ExampleDocument
              )._id
            }`,
          }
        : null,
      npwp: !!user?.npwp
        ? {
            id: user.npwp,
            mimetype: (
              (await exampleModel.findById(user.npwp)) as ExampleDocument
            ).data.file.mimetype,
            link: `http://localhost:52000/api/file/${
              ((await exampleModel.findById(user.npwp)) as ExampleDocument)._id
            }`,
          }
        : null,
      decisionLetter: !!user?.decisionLetter
        ? {
            id: user.decisionLetter,
            mimetype: (
              (await exampleModel.findById(
                user.decisionLetter
              )) as ExampleDocument
            ).data.file.mimetype,
            link: `http://localhost:52000/api/file/${
              (
                (await exampleModel.findById(
                  user.decisionLetter
                )) as ExampleDocument
              )._id
            }`,
          }
        : null,
    };

    Object.keys(result).map((i) => {
      (result as Data)[i] === "undefined" || (result as Data)[i] == undefined
        ? ((result as Data)[i] = null)
        : (result as Data)[i];
    });

    // console.log("ini result user data", user);

    return res.status(200).json({
      status: "success",
      message: "retreive data successfull",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "user not found",
      data: error,
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

    switch (true) {
      case !!photographFile:
        try {
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
        } catch (error) {}
      case !!familyCertificateFile:
        try {
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
        } catch (error) {}
      case !!bpjsOfEmploymentFile:
        try {
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
        } catch (error) {}
      case !!decisionLetterFile:
        try {
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
        } catch (error) {}
      case !!identityFile:
        try {
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
        } catch (error) {}
      case !!npwpFile:
        try {
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
        } catch (error) {}
      case !!bpjsOfHealthFile:
        try {
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
        } catch (error) {}
    }

    const officerData = await prisma.user.create({
      data: {
        firstName: firstname,
        lastName: lastname,
        password: await bcrypt.hash("12345678", 10),
        role: "PEGAWAI",
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
        startingYear: startYear,
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
