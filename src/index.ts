import bodyParser from "body-parser";
import cors from "cors";
import express, { Request, Response } from "express";
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
import { GETEmployeeStatistic } from "./controllers/statistic/statisticController";
import {
  POSTBulkInsert,
  POSTCheckRole,
  POSTCreateUser,
  POSTUserLogin,
} from "./controllers/user/userController";
import { upload } from "./lib/processors";

const app = express();
app.use(cors());
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

// USER
app.post("/api/user/check-role", POSTCheckRole);
app.post(
  "/api/user/create",
  upload.fields([
    {
      name: "photograph",
      maxCount: 1,
    },
  ]),
  POSTCreateUser
);

app.listen(PORT, HOST, () => {
  console.log(`server is running on http://${HOST}:${PORT}`);
});
