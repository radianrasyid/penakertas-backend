import bodyParser from "body-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import "../prisma/mongo";
import {
  DELETEAccessData,
  GETAccessDataById,
  GetAllAccessData,
  PUTUpdateData,
} from "./controllers/accessController/accessController";
import { GETFileById } from "./controllers/file/fileController";
import {
  DELETEDistrict,
  GETAllDistrict,
  GETDistrictById,
  GETDistrictPaginate,
  POSTCreateDistrict,
  PUTEditDistrict,
} from "./controllers/geolocation/district/districtController";
import {
  DELETEProvince,
  GETAllProvince,
  GETProvinceById,
  GETProvincePaginate,
  POSTCreateProvince,
  PUTProvince,
} from "./controllers/geolocation/province/provinceController";
import {
  DELETESubdistrict,
  GETAllSubdistrict,
  GETSubdistrictById,
  GETSubdistrictPaginate,
  POSTCreateSubdistrict,
  PUTEditSubdistrict,
} from "./controllers/geolocation/subdistrict/subdistrictController";
import {
  DELETEWard,
  GETAllWard,
  GETWardById,
  GETWardPaginate,
  POSTCreateWard,
  PUTEditWard,
} from "./controllers/geolocation/ward/wardController";
import { AuthMiddleware } from "./controllers/middleware/authMiddleware";
import { GETEmployeeStatistic } from "./controllers/statistic/statisticController";
import {
  DELETELatestEducation,
  DELETEReligion,
  GETLatestEducationById,
  GETLatestEducationPaginate,
  GETListGender,
  GETListLatestEducation,
  GETListMaritalStatus,
  GETListReligion,
  GETReligionById,
  GETReligionPaginate,
  POSTCreateLatestEducation,
  POSTCreateReligion,
  PUTEditLatestEducation,
  PUTEditReligion,
} from "./controllers/user/identityController";
import {
  GETEmployeeDetail,
  GETRefreshToken,
  GETWhoAmI,
  POSTBulkInsert,
  POSTCheckRole,
  POSTCreateUser,
  POSTUploadUserDocument,
  POSTUserLogin,
} from "./controllers/user/userController";
import { GETAllUserPaginated } from "./controllers/user/userFileUploadController";
import {
  DELETEWorkGroup,
  GETWorkGroupById,
  GETWorkGroupPaginated,
  POSTCreateWorkGroup,
  PUTEditWorkGroup,
} from "./controllers/userIdentity/workGroupController";
import {
  DELETEWorkPart,
  GETWorkPartById,
  GETWorkPartPaginated,
  POSTCreateWorkPart,
  PUTEditWorkPart,
} from "./controllers/userIdentity/workPartController";
import {
  DELETEWorkUnit,
  GETWorkUnitById,
  GETWorkUnitPaginated,
  POSTCreateWorkUnit,
} from "./controllers/userIdentity/workUnitController";
import {
  DELETEMaritalStatus,
  GETMaritalStatusById,
  GETMaritalStatusPaginated,
  POSTCreateMaritalStatus,
  PUTEditMaritalStatus,
} from "./controllers/userInfo/maritalStatusController";
import {
  GETListWorkGroup,
  GETListWorkPart,
  GETListWorkUnit,
} from "./controllers/work/workController";
import { upload } from "./lib/processors";

const app = express();
app.use(cors({ origin: "*" }));
const PORT = 52000;
const HOST = "localhost";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Berhasil",
  });
});

// USER UNGUARDED
app.post("/api/user/login", POSTUserLogin);
app.post("/api/user/bulk-insert", POSTBulkInsert);
app.get("/api/user/refresh", GETRefreshToken);
// FILE
app.get("/api/file/:fileId", GETFileById);
app.get("/api/access", GetAllAccessData);
app.get("/api/access/:id", GETAccessDataById);
app.put("/api/access/:id", PUTUpdateData);
app.delete("/api/access/:id", DELETEAccessData);

app.use(AuthMiddleware);
app.get("/api/user/whoami", GETWhoAmI);
// STATISTICS
app.get("/api/statistic/admin/dashboard", GETEmployeeStatistic);

// PROVINCE
app.post("/api/geolocation/province/create", POSTCreateProvince);
app.delete("/api/geolocation/province/delete", DELETEProvince);
app.put("/api/geolocation/province/edit", PUTProvince);
app.get("/api/geolocation/province/get-all", GETAllProvince);
app.get("/api/geolocation/province/get-by-id", GETProvinceById);
app.get("/api/geolocation/province/get-paginate", GETProvincePaginate);

// DISTRICT
app.post("/api/geolocation/district/create", POSTCreateDistrict);
app.delete("/api/geolocation/district/delete", DELETEDistrict);
app.put("/api/geolocation/district/edit", PUTEditDistrict);
app.get("/api/geolocation/district/get-all", GETAllDistrict);
app.get("/api/geolocation/district/get-by-id", GETDistrictById);
app.get("/api/geolocation/district/get-paginate", GETDistrictPaginate);

// SUBDISTRICT
app.post("/api/geolocation/subdistrict/create", POSTCreateSubdistrict);
app.delete("/api/geolocation/subdistrict/delete", DELETESubdistrict);
app.put("/api/geolocation/subdistrict/edit", PUTEditSubdistrict);
app.get("/api/geolocation/subdistrict/get-all", GETAllSubdistrict);
app.get("/api/geolocation/subdistrict/get-by-id", GETSubdistrictById);
app.get("/api/geolocation/subdistrict/get-paginate", GETSubdistrictPaginate);

// WARD
app.post("/api/geolocation/ward/create", POSTCreateWard);
app.delete("/api/geolocation/ward/delete", DELETEWard);
app.put("/api/geolocation/ward/edit", PUTEditWard);
app.get("/api/geolocation/ward/get-all", GETAllWard);
app.get("/api/geolocation/ward/get-by-id", GETWardById);
app.get("/api/geolocation/ward/get-paginate", GETWardPaginate);

// RELIGION
app.post("/api/identity/religion", POSTCreateReligion);
app.delete("/api/identity/religion/:id", DELETEReligion);
app.put("/api/identity/religion/:id", PUTEditReligion);
app.get("/api/identity/religion", GETListReligion);
app.get("/api/identity/religion/:id", GETReligionById);
app.get("/api/identity/religion-paginate", GETReligionPaginate);

// GENDER
app.get("/api/identity/gender", GETListGender);

// EDUCATION LEVEL
app.post("/api/identity/education-level", POSTCreateLatestEducation);
app.delete("/api/identity/education-level/:id", DELETELatestEducation);
app.put("/api/identity/education-level/:id", PUTEditLatestEducation);
app.get("/api/identity/education-level", GETListLatestEducation);
app.get("/api/identity/education-level/:id", GETLatestEducationById);
app.get("/api/identity/education-level-paginate", GETLatestEducationPaginate);

// MARITAL STATUS
app.post("/api/identity/marital-status", POSTCreateMaritalStatus);
app.delete("/api/identity/marital-status/:id", DELETEMaritalStatus);
app.put("/api/identity/marital-status/:id", PUTEditMaritalStatus);
app.get("/api/identity/marital-status", GETListMaritalStatus);
app.get("/api/identity/marital-status/:id", GETMaritalStatusById);
app.get("/api/identity/marital-status-paginate", GETMaritalStatusPaginated);

// USER
app.post("/api/user/check-role", POSTCheckRole);
app.post(
  "/api/user/create",
  upload.fields([
    {
      name: "photographFile",
      maxCount: 1,
    },
    {
      name: "familyCertificateFile",
      maxCount: 1,
    },
    {
      name: "bpjsOfEmploymentFile",
      maxCount: 1,
    },
    {
      name: "decisionLetterFile",
      maxCount: 1,
    },
    {
      name: "identityFile",
      maxCount: 1,
    },
    {
      name: "npwpFile",
      maxCount: 1,
    },
    {
      name: "bpjsOfHealthFile",
      maxCount: 1,
    },
  ]),
  POSTCreateUser
);
app.post(
  "/api/upload/user/document/:id",
  upload.fields([
    {
      name: "file",
      maxCount: 1,
    },
  ]),
  POSTUploadUserDocument
);
app.get("/api/user/employee", GETAllUserPaginated);
app.get("/api/user/:id", GETEmployeeDetail);

// WORK GROUP
app.post("/api/work/group", POSTCreateWorkGroup);
app.delete("/api/work/group/:id", DELETEWorkGroup);
app.put("/api/work/group", PUTEditWorkGroup);
app.get("/api/work/group", GETListWorkGroup);
app.get("/api/work/group/:id", GETWorkGroupById);
app.get("/api/work/group-paginate", GETWorkGroupPaginated);

// WORK PART
app.post("/api/work/part", POSTCreateWorkPart);
app.delete("/api/work/part", DELETEWorkPart);
app.put("/api/work/part/:id", PUTEditWorkPart);
app.get("/api/work/part", GETListWorkPart);
app.get("/api/work/part/:id", GETWorkPartById);
app.get("/api/work/part-paginate", GETWorkPartPaginated);

// WORK UNIT
app.post("/api/work/unit", POSTCreateWorkUnit);
app.delete("/api/work/unit/:id", DELETEWorkUnit);
app.get("/api/work/unit", GETListWorkUnit);
app.get("/api/work/unit/:id", GETWorkUnitById);
app.get("/api/work/unit-paginate", GETWorkUnitPaginated);

app.listen(PORT, HOST, () => {
  console.log(`server is running on http://${HOST}:${PORT}`);
});
