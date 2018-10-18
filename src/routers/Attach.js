const express = require('express')
const multiparty = require('connect-multiparty');
const path = require('path')
const fs = require('fs')

const { homePath } = require('../config/global')
const { getErrorInfo } = require('../common/utils');

const uploadDir = homePath + '/upload';
const pathSep = path.sep;
const router = express.Router();

fs.exists(uploadDir, (exists) => {
    if (!exists) {
        fs.mkdirSync(uploadDir);
    }
})

var multipartMiddleware = multiparty({ uploadDir });

//  若同时上传多个文件，会被分开调用多次
router.post('/', multipartMiddleware, async (req, res) => {
    try {
        let { originalFilename, path: oldPath } = req.files.file;
        let newPath = new Date().getTime() + parseInt(Math.random() * 1000).toString() + path.extname(originalFilename);
        fs.renameSync(oldPath, uploadDir + pathSep + newPath);
        res.json({ Code: true, Data: newPath });
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
});

router.get('/:path', async (req, res) => {    
    try {
        const { path } = req.params;
        res.sendFile(uploadDir + pathSep + path);
    } catch (err) {
        res.end(getErrorInfo(err));
    }
})

module.exports = router;