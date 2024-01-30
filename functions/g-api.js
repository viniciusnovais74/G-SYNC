const { google } = require("googleapis");
require("dotenv").config();

const oauth2Client = new google.auth.OAuth2({
  clientId: process.env.CLIENTID,
  clientSecret: process.env.CLIENTSEC,
  redirectUri: process.env.REDIRECT,
});

const driver = async (user) => {
  await oauth2Client.setCredentials(user);
  return google.drive({
    version: "v3",
    auth: oauth2Client,
  });
};

const getUserReq = async (credential) => {
  let error;
  if (credential) {
    oauth2Client.on("tokens", (tokens) => {
      if (tokens.refresh_token) {
        console.log("TOKENS", tokens);
      }
    });
    oauth2Client.setCredentials(credential);
    const { data } = await google
      .oauth2({ auth: oauth2Client, version: "v2" })
      .userinfo.get().catch((err)=> error = err);
    if (error) return "DEU ERRO"
    let user = {
      tokens: credential,
      ...data,
    };
    return user;
  }
};

module.exports = { driver, oauth2Client, getUserReq };
