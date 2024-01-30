const fs = require("fs");
function checkDir() {
  if (!fs.existsSync("./backup")) fs.mkdirSync("./backup");
}

function checkDirUser() {
  if (!fs.existsSync("./users")) fs.mkdirSync("./users");
}

function checkDirUserProfile(user) {
  if (!fs.existsSync(`./users/${user.id}`)) fs.mkdirSync(`./users/${user.id}`);
}


module.exports = { checkDir, checkDirUser, checkDirUserProfile };
