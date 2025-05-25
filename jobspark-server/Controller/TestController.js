// Controller/Test.js

async function testingReq(req, res) {
    res.status(200).json({
        message: "Hello Jobs"
    });
}
async function testingNameReq(req, res) {
    res.status(200).json({
        message: "Hello Masayeakh"
    });
}

module.exports = { testingReq, testingNameReq }