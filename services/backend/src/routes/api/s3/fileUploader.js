require('dotenv').config();

const AWS = require('aws-sdk');
const fs = require('fs');

const bucketConfig = { 
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY, 
  accessKeyId: process.env.S3_ACCESS_KEY, 
  region: process.env.S3_BUCKET_REGION, 
};

AWS.config.update(bucketConfig); 


const uploadFile = async (ctx) => {
  const files = ctx.request.files.userImages;
  const images = Array.isArray(files) ? files : typeof files === "object" ? [files] : null;
  
  if (images) {
    try {
      const filePromises = images.map(image => {
        const s3 = new AWS.S3()

        const { path, name, type } = image;
        const body = fs.createReadStream(path);

        const params = {
          Bucket: `${process.env.S3_BUCKET_NAME}/files`,
          Key: name,
          Body: body,
          ContentType: type
        };

        return new Promise(function (resolve, reject) {
          s3.upload(params, function (error, data) {
            if (error) {
              reject(error);
              return;
            }
            resolve(data);
            return;
          });
        });
      })

      const results = await Promise.all(filePromises);
      return results;
    } catch (error) {
        ctx.body = error;
        ctx.throw(400, error);
    }
  }
}

module.exports = { uploadFile }