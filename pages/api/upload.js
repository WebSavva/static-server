import nextConnect from "next-connect";
import multer from "multer";
import getConfig from "next/config";
import fs from "fs";
import { mkdir, unlink, rm } from "fs/promises";
import unzipper from "unzipper";
import path from "path";

import { ContentReader } from "../../utils/readContentDir";
import getPath from '../../utils/getPath';

const {
  serverRuntimeConfig: { contentDir },
} = getConfig();

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const { directoryId = null } = req.query;
      const tree = ContentReader.read();

      const { endNode: { path = null } = {} } = getPath(tree, directoryId);

      if (!path) cb(new Error("Directory is not found"));

      cb(null, path);
    },
    filename: (_, file, cb) => cb(null, file.originalname),
  }),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single("file"));

apiRoute.post(async (req, res) => {
  const { file, query: { toDecompress = false } = {} } = req;

  if (/^application\/zip$/.test(file.mimetype) && toDecompress) {
    const fullPath = path.join(
      file.destination,
      file.filename.replace(/\..+$/, "")
    );

    await rm(fullPath, {
      recursive: true,
      force: true,
    });

    await mkdir(fullPath);

    const extracter = unzipper.Extract({ path: fullPath });

    fs.createReadStream(file.path).pipe(extracter);

    const decompressionEndPromise = new Promise((resolve, reject) => {
      extracter.on("close", resolve);
      extracter.on("error", reject);
    });

    await decompressionEndPromise;

    await unlink(file.path);
  }
  
  return res.status(200).json({ data: "success" });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false
  },
};
