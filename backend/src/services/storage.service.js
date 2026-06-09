const ImageKit = require("imagekit");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile(fileBuffer) {
  const result = await imagekit.upload({
    file: fileBuffer,
    fileName: uuidv4(),
    folder: "nebula-products",
  });

  return result;
}

module.exports = {uploadFile};
