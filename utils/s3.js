const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const bucketName = process.env.S3_BUCKET_NAME;

// Upload file (buffer or stream)
async function uploadFile(key, body, contentType = 'application/octet-stream') {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: contentType
  });
  await s3.send(command);
}

// Generate signed URL for download
async function getSignedDownloadUrl(key, expiresInSeconds = 3600) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key
  });
  const url = await getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
  return url;
}

// Delete file
async function deleteFile(key) {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key
  });
  await s3.send(command);
}

// List files under prefix
async function listFiles(prefix = '') {
  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: prefix
  });
  const response = await s3.send(command);
  return response.Contents || [];
}

module.exports = {
  uploadFile,
  getSignedDownloadUrl,
  deleteFile,
  listFiles
};
