// List System
// for Search/Artist pages

"use strict"

import playFromId from './playFromId.js';

$(document).ready(function(){
    $(document).on("click", ".pwrap > .tl-art", function(){
        console.log("e");
        let ArtName = $(this).closest(".previewti").data("titleItem").songArtist;
        let url = `artist/ar.php?ar=${ArtName}`;
        console.log(ArtName);
        $('.mainwrap').load(encodeURI(url), function(){$(".mainwrap").hide().fadeIn();});
        history.pushState({}, `- ${ArtName}`, url);
        return false;
})

$(document).on("click", ".track-name-grp > .track-artist", function(){
    console.log("e");
    let ArtName = $(this).text();
    let url = `artist/ar.php?ar=${ArtName}`;
    console.log(ArtName);
    $('.mainwrap').load(encodeURI(url), function(){$(".mainwrap").hide().fadeIn();});
    history.pushState({}, `- ${ArtName}`, url);
    return false;
})

$(document).on("dblclick", ".track-list > .track-0", function(){
    console.log("e");
    playFromId($(this).attr("data-id"));
})

})