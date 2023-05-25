import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const saveFile = async (file: any) => {
  const extension = file.originalFilename.split('.').pop();
  const data = fs.readFileSync(file.filepath);
  fs.writeFileSync(`./pages/api/upload/${file.newFilename}.${extension}`, data);
  await fs.unlinkSync(file.filepath);
  return file.newFilename;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<{
    data: string | null;
    error: string | null;
  }>,
) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    const newFilename = await saveFile(files.test);
    res.status(200).json({
      data: newFilename,
      error: null,
    });
  });
};

export default handler;
