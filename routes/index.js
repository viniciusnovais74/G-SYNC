var express = require("express");
const { oauth2Client, driver } = require("../functions/g-api");
const { getListFiles, downloadAllFiles } = require("../functions/download");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "G-SYNC",
    token: req.query.json ? JSON.parse(req.query.json).access_token : "",
    files: [],
  });
});

router.get("/callback", async function (req, res, next) {
  const { tokens } = await oauth2Client.getToken(req.query.code);
  res.redirect(`/?json=${JSON.stringify(tokens)}`);
});

router.post("/download", async function (req, res, next) {
  let option = req.query.option.toLowerCase();
  if (option == "server") {
    const list = await getListFiles(api(req.body).then(res=>res));
    res.status(200).json(list.data.files);
    await downloadAllFiles(list.data.files, api(req.body).then(res=>res));
  }
});

const api = (user) => {
 return new Promise(async (resolve, reject) => {
    await driver(user).then((res) => resolve(res));
  });
};
(module.exports = router), api;
