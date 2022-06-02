import { IncomingForm } from "formidable";
import { promises as fs } from "fs";

var mv = require("mv");

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();

    form.parse(req, (err, fields) => {
      if (err) return reject(err);
      // console.log(fields);

      fs.unlink(fields.path);
      res.status(200).json({ fields, files });
    });
  });
};
