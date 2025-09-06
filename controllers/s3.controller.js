const fs = require('fs');
const path = require('path');
const { uploadFile, getSignedDownloadUrl, deleteFile, listFiles } = require('../utils/s3');
const { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const REGION = process.env.AWS_REGION || 'ap-southeast-1';
const BUCKET = process.env.S3_BUCKET_NAME;

const s3 = new S3Client({
  region: process.env.AWS_REGION, credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

// Upload a test file (local file or dummy buffer)
exports.uploadTestFile = async (req, res) => {
  try {
    // Example: upload a simple text file
    const content = 'Hello from RootsEdTech!';
    const key = `test-folder/hello.txt`;

    await uploadFile(key, Buffer.from(content), 'text/plain');

    res.json({ message: 'File uploaded!', key });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
};

exports.listFiles = async (req, res) => {
  try {
    const rawPrefix = (req.query.prefix || '').toString();
    const prefix = rawPrefix.replace(/^\/+/, ''); // normalize (no leading '/')
    const delimiter = req.query.delimiter === '/' ? '/' : undefined;

    const files = [];
    const folders = new Set(); // avoid dupes across pages
    let ContinuationToken;

    do {
      const params = {
        Bucket: BUCKET,
        Prefix: prefix,
        MaxKeys: 1000,
        ...(delimiter ? { Delimiter: '/' } : {}),
        ...(ContinuationToken ? { ContinuationToken } : {}),
      };

      const page = await s3.send(new ListObjectsV2Command(params));

      // Collect files
      (page.Contents || []).forEach((o) => {
        // Skip the “folder marker” keys that end with '/'
        if (o.Key && !o.Key.endsWith('/')) {
          files.push({
            key: o.Key,
            size: o.Size,
            lastModified: o.LastModified,
            eTag: o.ETag,
            storageClass: o.StorageClass,
          });
        }
      });

      // Collect folder prefixes when using delimiter
      if (delimiter && page.CommonPrefixes) {
        page.CommonPrefixes.forEach((cp) => {
          if (cp.Prefix) folders.add(cp.Prefix);
        });
      }

      ContinuationToken = page.IsTruncated ? page.NextContinuationToken : undefined;
    } while (ContinuationToken);

    // Shape response based on presence of delimiter
    if (delimiter) {
      return res.json({ folders: Array.from(folders), files });
    }
    return res.json({ files });
  } catch (err) {
    console.error('[S3 LIST ERROR]', err);
    return res.status(500).json({ error: 'List failed' });
  }
};


// Get signed download URL
exports.getDownloadUrl = async (req, res) => {
  try {
    const rawKey = (req.query.key || '').toString();
    if (!rawKey) return res.status(400).json({ error: 'key is required' });

    const key = rawKey.replace(/^\/+/, ''); // normalize
    const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    const url = await getSignedUrl(s3, cmd, { expiresIn: EXPIRES });

    return res.json({ url, bucket: BUCKET, key });
  } catch (e) {
    console.error('[GET_DOWNLOAD_URL_ERROR]', e);
    return res.status(500).json({ error: 'Failed to generate download URL' });
  }
};

// Delete file
exports.deleteFile = async (req, res) => {
  try {
    const key = req.query.key;
    if (!key) {
      return res.status(400).json({ error: 'Missing key parameter' });
    }

    await deleteFile(key);
    res.json({ message: 'File deleted', key });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
};

exports.createFolder = async (req, res) => {
  try {
    const { key } = req.body || {};
    if (!key || !key.endsWith('/')) return res.status(400).json({ error: 'key ending with / is required' });

    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key.replace(/^\/+/, ''),
      Body: new Uint8Array(0),
      ContentType: 'application/x-directory',
      ServerSideEncryption: 'AES256',
    }));
    res.json({ ok: true, key });
  } catch (e) {
    console.error('[CREATE_FOLDER_ERROR]', e);
    res.status(500).json({ error: 'Failed to create folder' });
  }
};
const EXPIRES = parseInt(process.env.PRESIGN_URL_EXPIRY || '900', 10);

exports.uploadFile = async (req, res) => {
  try {
    const { key, contentType } = req.body || {};
    if (!key || !contentType) return res.status(400).json({ error: 'key and contentType are required' });

    const cmd = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key.replace(/^\/+/, ''),
      ContentType: contentType,
      ServerSideEncryption: 'AES256', // bucket policy alignment
    });

    const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: EXPIRES });
    return res.json({ uploadUrl, bucket: BUCKET, key });
  } catch (e) {
    console.error('[PRESIGN_UPLOAD_ERROR]', e);
    return res.status(500).json({ error: 'Failed to presign upload' });
  }

}
