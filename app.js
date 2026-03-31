const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'ap-south-1'
});

app.post('/upload', upload.single('file'), async (req, res) => {
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: Date.now() + '-' + req.file.originalname,
    Body: req.file.buffer
  };

  const data = await s3.upload(params).promise();
  res.json({ url: data.Location });
});

app.listen(3002, () => console.log('Gallery running on 3002'));