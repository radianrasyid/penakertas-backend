import fs from "fs";
import puppeteer from "puppeteer";

import { buildPaths } from "./buildpath";

export const printPdf = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(buildPaths.buildPathHtml, {
    waitUntil: "networkidle0",
  });
  const pdf = await page.pdf({
    format: "A4",
    margin: {
      top: "20px",
      bottom: "20px",
      left: "20px",
      right: "20px",
    },
  });

  await browser.close();
  console.log("ending pdf generate process");
  return pdf;
};

export const init = async () => {
  try {
    const pdf = await printPdf();
    fs.writeFileSync(buildPaths.buildPathPdf, pdf);
    console.log("Succesfully created an PDF table");
  } catch (error) {
    console.log("Error generating PDF", error);
  }
};
