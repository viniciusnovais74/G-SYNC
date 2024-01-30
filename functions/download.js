const fileSystem = require("fs");
const crypto = require("crypto");
const getListFiles = async (api, nextPage) => {
  return await api.then(async (loadedApi) => {
    const file = await loadedApi.files.list({
      pageSize: 20,
      q: "mimeType != 'application/vnd.google-apps.folder'",
      fields: "nextPageToken, files(id, name, mimeType, md5Checksum)",
      pageToken: nextPage || null,
    });
    return file;
  });
};

const downloadAllFiles = async (apifiles, api, user) => {
  if (!fileSystem.existsSync("./backup")) fileSystem.mkdirSync("./backup");

  let files = apifiles.filter(
    (file) => !file.mimeType.includes("application/vnd.google-apps")
  );

  function substituirCaracteresInvalidos(str) {
    return str.replace(/[\/\?<>\\:\*\|":]/g, "_");
  }

  function criarEstruturaDePastas(array) {
    array.forEach((item) => {
      const mimeType = substituirCaracteresInvalidos(item.mimeType);
      const pasta = `./users/${user.id}/${mimeType}`;

      if (!fileSystem.existsSync(pasta)) {
        fileSystem.mkdirSync(pasta);
      }
    });
  }

  try {
    criarEstruturaDePastas(files);
    for (let i = 0; i < files.length; i++) {
      const pasta = `./users/${user.id}/${substituirCaracteresInvalidos(
        files[i].mimeType
      )}`;
      var tempName = files[i].name.toString().replace(/[/\\?%*:|"<>]/g, "-");
      const dest = fileSystem.createWriteStream(`${pasta}/${tempName}`);
      const hash = crypto.createHash("md5");
      await api.then(async (api) => {
        const { data } = await api.files.get(
          { fileId: files[i].id, alt: "media", acknowledgeAbuse: true },
          { responseType: "stream" }
        );

        data.on("data", (chunk) => {
          hash.update(chunk);
        });

        data.on("end", () => {
          console.log(
            `[+] ${files[i].name} Baixado | Corrompido? ${
              hash.digest("hex") !== files[i].md5Checksum
            }`
          );
          console.log(`[${i + 1}/${files.length}]`);
        });
        data.pipe(dest);
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getListFiles, downloadAllFiles };
