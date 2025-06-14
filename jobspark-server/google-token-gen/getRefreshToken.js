const { google } = require("googleapis");
require("dotenv").config();

const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

const code = "4/0AUJR-x7JSyR4nnGFyuh9QvsrPFPnUp1XjTA2Hfcc8C0IOGOAUYyz9IC5TNjslGjvf_QBWw";
// only the code part

async function getToken() {
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        console.log("✅ Your refresh token is:", tokens.refresh_token);
    } catch (error) {
        console.error("Error retrieving refresh token:", error.message);
    }
}

getToken();
