const express = require('express');
const { testingReq, testingNameReq } = require('../Controller/TestController');

const router = express.Router();

router.get('/test', testingReq);
router.get('/name', testingNameReq);


module.exports = router;