const { google } = require("googleapis");

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

module.exports = { driver, oauth2Client };
