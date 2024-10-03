const express = require('express');
const multer = require('multer');
const path = require('path');
const user = require('../controller/UserController');
const router = express.Router();


// multer 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 파일 저장 경로 지정
        cb(null, path.join(__dirname, '../public/portal_uploads')); // "portal_uploads" 디렉토리에 저장
    },
    filename: function (req, file, cb) {
            cb(null, file.originalname); 
    }
});

const upload = multer({ storage: storage });

//요청 경로 처리
router.post('/portal_upload', upload.single('image'), user.image_upload);

module.exports = router;