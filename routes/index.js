var express = require("express");
const { oauth2Client, driver, getUserReq } = require("../functions/g-api");
const { getListFiles, downloadAllFiles } = require("../functions/download");
const { checkDirUserProfile } = require("../functions/menagerFiles");
var router = express.Router();

/* GET home page. */
router.get("/", async function (req, res) {
  oauth2Client.on("tokens", (tokens) => {
    if (tokens.refresh_token) {
      res.cookie("_app", `${JSON.stringify(tokens)}`);
      console.log("TOKENS", tokens);
    }
  });

  let user;
  let awaitDrive;
  if (req.cookies._app) {
    const credential = JSON.parse(req.cookies._app);
    user = await getUserReq(credential);
    if (user === "DEU ERRO") {
      res.clearCookie("_app");
      return res.redirect("/");
    }
    checkDirUserProfile(user);
    const { data } = await getListFiles(api(credential), req.query.nextPage);
    awaitDrive = data;
  }

  res.render("index", {
    title: "G-SYNC",
    nextPage: awaitDrive?.nextPageToken || "",
    files: awaitDrive?.files || [],
    user: user || {},
  });
});

router.get("/callback", async function (req, res) {
  if (!req.query.code) return res.redirect("/");
  const { tokens } = await oauth2Client.getToken(req.query.code);
  res.cookie("_app", `${JSON.stringify(tokens)}`);
  res.redirect("/");
});

router.get("/download", async function (req,res){
  if (req.cookies._app) {
    const nextPage = req.query.nextPage;
    const credential = JSON.parse(req.cookies._app);
    let user = await getUserReq(credential);
    const { data } = await getListFiles(api(credential), nextPage);
    downloadAllFiles(data.files, api(credential), user);
    res.status(201).json({ message: "Download iniciado" });
  }
})

const api = (user) => {
  return driver(user);
};
(module.exports = router), api;
