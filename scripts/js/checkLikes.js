// Add to Favorites action
// Checking if the song is already in favorites

"use strict";

function checkLikes(songId, callback){
    let liked;
    $.ajax({
        type: "POST",
        url: "/smpgo/scripts/php/fetchlikes.php",
        data: {songId : songId},
        dataType: "html",
        success: function (data) {
            if (data.includes("not in list")){
                liked = false;
                callback(liked);
            }
            else
            if (data.includes("already in list")){
                liked = true;
                callback(liked);
            }
        }
    });
}


  export default checkLikes;