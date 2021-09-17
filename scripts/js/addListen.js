// Add Listen
// Listening History (registered accounts)

function addListen(songId){
    $.ajax({
        type: "POST",
        url: "/smpgo/scripts/php/listenHandle.php",
        data: {songId : songId},
        dataType: "html",
    }).done (function (data) {
    })
}

  export default addListen;