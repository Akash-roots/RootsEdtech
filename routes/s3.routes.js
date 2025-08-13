const express = require('express');
const router = express.Router();
const s3Controller = require('../controllers/s3.controller');

router.post('/upload-test', s3Controller.uploadTestFile);
router.get('/list-files', s3Controller.listFiles);
router.get('/get-download-url', s3Controller.getDownloadUrl);
router.delete('/delete-file', s3Controller.deleteFile);
router.post('/create-folder',s3Controller.createFolder);
router.post('/presign-upload',s3Controller.uploadFile);

module.exports = router;
