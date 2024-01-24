const { driver } = require("./g-api");
const fileSystem = require("fs");

const getListFiles = async (api) => {
  let listFiles = new Array();
  await api.then(async (api) => {
    const file = await api.files.list({
      pageSize: 1000,
      q: "mimeType != 'application/vnd.google-apps.folder'",
      fields: "nextPageToken, files(id, name, mimeType)",
    });
    listFiles = file;
  });
  return listFiles;
};

const downloadAllFiles = async (apifiles, api) => {
  if (!fileSystem.existsSync("./backup")) fileSystem.mkdirSync("./backup");

  let files = apifiles.filter(
    (file) => !file.mimeType.includes("application/vnd.google-apps")
  );

  try {
    for (let i = 0; i < files.length; i++) {
      var tempName = files[i].name.toString().replace(/[/\\?%*:|"<>]/g, "-");
      const dest = fileSystem.createWriteStream(`./backup/${tempName}`);
      await api.then(async (api) => {
        const { data } = await api.files.get(
          { fileId: files[i].id, alt: "media", acknowledgeAbuse: true },
          { responseType: "stream" }
        );
        data.on("end", () => {
          console.log(`[+] ${files[i].name} downloading`);
        });
        data.pipe(dest);
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getListFiles, downloadAllFiles };
