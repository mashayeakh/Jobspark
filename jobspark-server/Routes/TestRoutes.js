const express = require('express');
const { testingReq } = require('../Controller/TestController'); // ✅ CORRECT IMPORT

const router = express.Router();

router.get('/test', testingReq); // ✅ testingReq is a function

module.exports = router;