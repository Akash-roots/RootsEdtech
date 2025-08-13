// utils/s3.js
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const REGION = process.env.AWS_REGION || 'ap-southeast-1';
const BUCKET = process.env.S3_BUCKET_NAME;

if (!BUCKET) throw new Error('S3_BUCKET_NAME not set');

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Normalize to avoid leading slashes
const k = (key) => key.replace(/^\/+/, '');


async function head(key) {
  return s3.send(new HeadObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: key.replace(/^\/+/,'') }));
}
// 1) Server-side upload (buffer/stream) — **SSE enforced**
async function uploadFile(key, body, contentType = 'application/octet-stream') {
  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: k(key),
    Body: body,
    ContentType: contentType,
    ServerSideEncryption: 'AES256',   // <-- required by your bucket policy
  });
  return s3.send(cmd);
}

// 2) Presigned **download** URL
async function getSignedDownloadUrl(key, expiresInSeconds = 3600) {
  const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: k(key) });
  return getSignedUrl(s3, cmd, { expiresIn: expiresInSeconds });
}

// 3) Presigned **upload** URL (for browser PUTs) — client must send the SSE header
async function getSignedUploadUrl(key, contentType, expiresInSeconds = 900) {
  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: k(key),
    ContentType: contentType,
    ServerSideEncryption: 'AES256',   // <-- bakes requirement into the signature
  });
  return getSignedUrl(s3, cmd, { expiresIn: expiresInSeconds });
}

// 4) Delete
async function deleteFile(key) {
  const cmd = new DeleteObjectCommand({ Bucket: BUCKET, Key: k(key) });
  return s3.send(cmd);
}

// 5) List with pagination
async function listFiles(prefix = '', max = 1000) {
  const clean = (prefix || '').replace(/^\/+/, ''); // no leading slash
  let ContinuationToken;
  const out = [];

  do {
    const page = await s3.send(new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: clean,
      MaxKeys: Math.min(1000, max - out.length),
      ContinuationToken,
    }));
    (page.Contents || []).forEach(o => {
      out.push({
        key: o.Key,
        size: o.Size,
        lastModified: o.LastModified,
        eTag: o.ETag,
        storageClass: o.StorageClass,
      });
    });
    ContinuationToken = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (ContinuationToken && out.length < max);

  return out;
}


module.exports = {
  uploadFile,
  getSignedDownloadUrl,
  getSignedUploadUrl,   // <-- new
  deleteFile,
  listFiles,
  head,
};
