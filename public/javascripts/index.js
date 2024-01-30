let params = new URLSearchParams(window.location.search);

function nextPage(token) {
  window.location.replace("/?nextPage=" + token);
}
function downloadPage(){
  let pdaarams = '/download';
  if (params.get('nextPage')) {
    pdaarams =`/download?nextPage=${new URL(window.location).searchParams.get('nextPage')}`
  }
  fetch(pdaarams)
}
