var express = require("express");
const { oauth2Client } = require("../functions/g-api");
var router = express.Router();

/* GET home page. */
router.get("/google", function (req, res, next) {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/drive.readonly"],
  });
  res.redirect(url);
});

module.exports = router;
