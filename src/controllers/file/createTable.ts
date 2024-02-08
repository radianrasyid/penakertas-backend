import fs from "fs";
import { buildPaths } from "./buildpath";

const createRow = (item: any) => `
<tr>
    <td>${item.no}</td>
    <td>${item.fullname}</td>
    <td>${item.birth}</td>
    <td>${item.religion}</td>
    <td>${item.address}</td>
    <td>${item.gender}</td>
    <td>${item.workUnit}</td>
    <td>${item.status}</td>
    <td>${item.education}</td>
    <td>${item.marital}</td>
    <td>${item.jobDescription}</td>
    <td>${item.placementLocation}</td>
    <td>${item.startingYear}</td>
    <td>${item.gapStarting}</td>
    <td>${item.decisionLetterNumber}</td>
    <td>${item.familyCertificateNumber}</td>
    <td>${item.identityNumber}</td>
    <td>${item.bpjsOfHealth}</td>
    <td>${item.bpjsOfEmployment}</td>
    <td>${item.npwpNumber}</td>
    <td>${item.phoneNumber}</td>
</tr>`;

const createTable = (rows: any) => `
<table>
    <tr>
        <th>No</th>
        <th>Nama Lengkap</th>
        <th>TTL</th>
        <th>Agama</th>
        <th>Alamat</th>
        <th>Jenis Kelamin</th>
        <th>Unit Kerja</th>
        <th>Status</th>
        <th>Pendidikan</th>
        <th>Perkawinan</th>
        <th>Uraian Kerja</th>
        <th>Lokasi Penempatan</th>
        <th>Tahun Masuk</th>
        <th>Jangka Masuk</th>
        <th>Nomor Sk</th>
        <th>Nomor KK</th>
        <th>KTP</th>
        <th>BPJS Kesehatan</th>
        <th>BPJS Ketenagakerjaan</th>
        <th>NPWP</th>
        <th>HP</th>
    </tr>
    ${rows}
</table>
`;

const createHTML = (table: any) => `
<html>
  <head>
    <style>
      table {
        width: 100%;
        position: absolute;
        left: 0;
        top:0;
      }
      tr {
        text-align: left;
        border: 1px solid black;
      }
      th, td {
        padding: 15px;
      }
      tr:nth-child(odd) {
        background: #CCC
      }
      tr:nth-child(even) {
        background: #FFF
      }
      .no-content {
        background-color: red;
      }
    </style>
  </head>
  <body>
    ${table}
  </body>
</html>
`;

const doesFileExist = (filePath: any) => {
  try {
    fs.statSync(filePath); // get information of the specified file path.
    return true;
  } catch (error) {
    return false;
  }
};

export const finalize = async (data: any) => {
  try {
    /* Check if the file for `html` build exists in system or not */
    if (doesFileExist(buildPaths.buildPathHtml)) {
      console.log("Deleting old build file");
      /* If the file exists delete the file from system */
      fs.unlinkSync(buildPaths.buildPathHtml);
    }
    /* generate rows */
    const rows = await data.map(createRow).join("");
    /* generate table */
    const table = await createTable(rows);
    /* generate html */
    const html = await createHTML(table);
    /* write the generated html to file */
    await fs.writeFileSync(buildPaths.buildPathHtml, html);
    console.log("Succesfully created an HTML table");
    return {
      html,
    };
  } catch (error) {
    console.log("Error generating table", error);
  }
};
