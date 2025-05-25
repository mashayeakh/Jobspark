// Controller/Test.js

async function testingReq(req, res) {
    res.status(200).json({
        message: "Hello Jobs"
    });
}

module.exports = { testingReq }; // ✅ CORRECT EXPORT
