import {createCookie, getCookie, checkCookie} from "./cookieManage.js";
import sessionChk from './sessionChk.js';

let session = false;

if (sessionChk() == true){
    session = true;
}

function downloadTrackFromLST(songId, songTitle){
  if (session){
    proceed();
  }
  else{
    if (checkCookie("downloads")){ 
      if (getCookie("downloads") == 5)
      {
        alert("limite de dls atteinte");
      }
      else{
          proceed();
        }
      }
  }
    function proceed(){
      if (!session){
        let dlValue = parseInt(getCookie("downloads"));
        createCookie("downloads", dlValue+1, 1);
      }
      $.ajax({
        type: "POST",
        url: "/smpgo/scripts/php/downloadHandle.php",
        data: {songId : songId},
        dataType: "html",
      }).done (function (data) {
        if (!data.includes("already in list"))
        saveAs(`/res/track-data/mp3/${songId}/input.mp3`, songTitle);
      });
  }
}

function saveAs(url, title) {
    // var filename = url.substring(url.lastIndexOf("/") + 1).split("?")[0];
    var filename = `${title}.mp3`;
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
      var a = document.createElement('a');
      var ignored = document.createAttribute("data-ignored");
      ignored.value = "yes";
      a.setAttributeNode(ignored);
      a.href = window.URL.createObjectURL(xhr.response);
      a.download = filename; 
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
    };
    xhr.open('GET', url);
    xhr.send();
  }

  export default downloadTrackFromLST;