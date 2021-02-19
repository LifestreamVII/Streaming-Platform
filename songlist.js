// Song List System
// Usage ; call method genCatFrames(x, y) to generate songs divs
// x => index of category in categories.JSON
// y => which ID (position) inside webpage (5 max)
// #selec element(s) must be present
// Last Updated: 16.02.2021

// TODO: Song path bind to player

"use strict";

class titleFrame {
    
    static songName;
    static songArtist;
    static coverPath;

    constructor(songId, rowLocation){
        this.songId = songId;
        this.getInfo();
        this.create(rowLocation);
    }

    getInfo() {
        let sId = this.songId;
        $.ajax({
            async: false,
            type: 'GET', 
            url: 'res/track-data/info.json', 
            data: { get_param: 'value' }, 
            dataType: 'json',
            success: function (data) {
                titleFrame.songName = data.songs[sId].title;
                titleFrame.songArtist = data.songs[sId].artist;
                titleFrame.coverPath = data.songs[sId].cover;
        }});
    }

    create(rowLocation) {
        let songInstance = $(`<div class="previewti" data-songId="${this.songId}" style="background-image:url('${titleFrame.coverPath}')"></div>`);
        $(`#selec${rowLocation}.selec`).find(".previewgrp").append(songInstance);
        songInstance.append(`<div class="tlinfo" style="display: none;"><div class="pwrap"><p class="tl-art">${titleFrame.songArtist}</p><p class="tl-name">${titleFrame.songName}</p></div></div>`);
    }
    
}


function genCatFrames(catIndex, rowLocation){
    $.ajax({ 
        type: 'GET', 
        url: 'res/track-data/categories.json', 
        data: { get_param: 'value' }, 
        dataType: 'json',
        success: function (data) {

            let listLength = data.categories[catIndex].list.length; 
            $(`#selec${rowLocation}.selec`).find(".hgrp").append(`<h2>${data.categories[catIndex].name}</h2>`);
            $(`#selec${rowLocation}.selec`).find(".hgrp").append(`<h3>${data.categories[catIndex].description}</h3>`);

            for(let i = 0; i < listLength; i++){
                let songId = data.categories[catIndex].list[i];
                console.log(songId);
                new titleFrame(songId, rowLocation);

            }

        }
    });
}

// genCatFrames(0, 1);


export default genCatFrames;