let params = new URLSearchParams(window.location.search);
document.addEventListener("DOMContentLoaded", () => {
  let token = JSON.parse(params.get("json"));

  if (!token) return;

  buttonDownload.addEventListener("click", () => {
    const content = async () => {
      let data = [];
      await fetch("/download?option=server", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(token),
      })
        .then((res) => res.json())
        .then((res) => (data = res));
      return data;
    };
    content().then((res) => {
      console.log(res);
      const table = document.getElementsByTagName("table")[0];
      const tbody = table.getElementsByTagName("tbody")[0];
      res.forEach((element) => {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        const td3 = document.createElement("td");
        td1.innerHTML = element.id;
        td2.innerHTML = element.name;
        td3.innerHTML = element.mimeType;
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tbody.appendChild(tr);
      });
    });
  });
});
