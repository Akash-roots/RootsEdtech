const fs = require('fs');
const path = require('path');
const { uploadFile, getSignedDownloadUrl, deleteFile, listFiles } = require('../utils/s3');

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

// List files in test-folder
exports.listFiles = async (req, res) => {
  try {
    const files = await listFiles('Forms/AIMDSS/');
    res.json({ files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'List failed' });
  }
};

// Get signed download URL
exports.getDownloadUrl = async (req, res) => {
  try {
    const key = req.query.key;
    if (!key) {
      return res.status(400).json({ error: 'Missing key parameter' });
    }

    const url = await getSignedDownloadUrl(key);
    res.json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate download URL' });
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
