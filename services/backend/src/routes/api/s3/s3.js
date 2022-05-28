// require('dotenv').config();

// const fs = require("fs");
// const AWS = require('aws-sdk');


// const uploadFile = async (ctx) => {
//   const files = ctx.request.files.myFile;
//   const myFiles = Array.isArray(files) ? files : typeof files === "object" ? [files] : null;
    
//   if (myFiles) {
//     try {
//       const filePromises = myFiles.map(file => {
//         const s3 = new AWS.S3({
//           region: `${YOUR_AWS_REGION}`
//         });

//         let { path, name, type } = file;
//         const body = fs.createReadStream(path);

//         const params = {
//           Bucket: `${process.env.S3_BUCKET_NAME}/files`,
//           Key: name,
//           Body: body,
//           ContentType: type
//         };

//         return new Promise(function (resolve, reject) {
//           s3.upload(params, function (error, data) {
//             if (error) {
//               reject(error);
//               return;
//             }
//             console.log(data);
//             resolve(data);
//             return;
//           });
//         });
//       });

//       var results = await Promise.all(filePromises);
//       ctx.body = results;
//     } catch (error) {
//       console.error(error);
//       ctx.body = error;
//     }
//   }
// }

// module.exports = { uploadFile }