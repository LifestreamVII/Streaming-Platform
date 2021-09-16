// Song List System

"use strict";

import playSGO from '../../player/player.js';
import fetchInfos from "../../player/fetchInfos.js";
import addListen from "./addListen.js";
import doesFileExist from "./fileCheck.js";


let nowPlaying;
let hls;

function playNext(){
    if (nowPlaying){
        if (nowPlaying.userTrax == true){
            if (tableFrames[nowPlaying.rowOrigin][nowPlaying.getInfoNextFromTB().nextPos]){
                tableFrames[nowPlaying.rowOrigin][nowPlaying.getInfoNextFromTB().nextPos].play();
            }
            else{
                tableFrames[nowPlaying.rowOrigin][0].play();
            }
        }
        else{
            if (tableFrames[nowPlaying.rowOrigin][nowPlaying.getInfoNext().nextPos]){
                tableFrames[nowPlaying.rowOrigin][nowPlaying.getInfoNext().nextPos].play();
            }
            else{
                tableFrames[nowPlaying.rowOrigin][0].play();
            }
        }
    }
}

function playPrev(){
    if (nowPlaying){
        if (tableFrames[nowPlaying.rowOrigin][nowPlaying.positionInList-1]){
            tableFrames[nowPlaying.rowOrigin][nowPlaying.positionInList-1].play();
        }
    }
}


class titleFrame {
    
    static songName;
    static songArtist;
    static coverPath;
    static positionInList;
    static originList;
    static rowOrigin;

    constructor(songId, rowLocation, origin, noInList, usertrax){
        if (usertrax == true)
        {
            this.songId = parseInt(songId);
        }
        else
        {
            this.songId = songId;
        }
        this.userTrax = usertrax;
        this.rowOrigin = rowLocation;
        this.getInfo(noInList, origin);
        this.create(rowLocation);
    }

    getInfo(noInList, origin) {
        let sId = this.songId;
        let sName;
        let sArtist;
        let sCover;
        let posInList;
        let origList;
        $.ajax({
            async: false,
            type: 'GET', 
            url: './res/track-data/info.json', 
            data: { get_param: 'value' }, 
            dataType: 'json',
            success: function (data) {
                sName = data.songs[sId].title;
                sArtist = data.songs[sId].artist;
                sCover = data.songs[sId].cover;
                posInList = noInList;
                origList = origin;
        }});
        this.songName = sName;
        this.songArtist = sArtist;
        if (doesFileExist(sCover)) {
            this.coverPath = sCover;
        }
        else{
            this.coverPath = "res/track-data/cover/default.jpg";
        }
        this.positionInList = posInList;
        this.originList = origList;
    }

    create(rowLocation) {
        let songInstance = $(`<div class="previewti" style="background-image:url('${this.coverPath}')"></div>`);
        songInstance.data("titleItem", this);
        $(`#selec${rowLocation}.selec`).find(".previewgrp").append(songInstance);
        songInstance.append(`<div class="tlinfo"><div class="pwrap"><p class="tl-art">${this.songArtist}</p><p class="tl-name">${this.songName}</p></div></div>`);
    }
    
    play() {
        if (this != nowPlaying) addListen(this.songId);
        nowPlaying = this;
        console.log(nowPlaying);
        console.log(tableFrames);
        let player = document.getElementById("player");
        let fakeplayer = document.getElementById("fakeplayer");
        $("#player").show("slow");
        setTimeout(() => {
          $("#player").css({"display":"flex"});
        }, 800);
        if (hls) hls.destroy();
        hls = new Hls();
        let source = "/smpgo/res/track-data/m3u8/"+this.songId+"/master.m3u8";
        let http = new XMLHttpRequest(); 
        http.open('HEAD', source, false); 
        http.send(); 
        if (http.status != 200) playNext();
        else {
            hls.loadSource(source);
            hls.attachMedia(fakeplayer);
            fakeplayer.play();
            fetchInfos(this);
            playSGO(hls, player, fakeplayer);
        } 
    }

    makeQueue(){
        // ...
    }

    getInfoNext(){
        let pos = nowPlaying.positionInList;
        let origin = nowPlaying.originList.substr(nowPlaying.originList.lastIndexOf("-")+1);
        let nextId;
        let nextTitle;
        let nextCover;
        let nextArtist;
        let nextPos = nowPlaying.positionInList+1;
            $.ajax({ 
                type: 'GET', 
                url: './res/track-data/categories.json', 
                data: { get_param: 'value' }, 
                dataType: 'json',
                async: false,
                success: function (data) {
                    nextId = data.categories[origin].list[pos+1];
                    $.ajax({ 
                        type: 'GET', 
                        url: './res/track-data/info.json', 
                        data: { get_param: 'value' }, 
                        dataType: 'json',
                        async: false,
                        success: function (data) {
                        nextTitle = data.songs[nextId].title;
                        nextCover = data.songs[nextId].cover;
                        nextArtist = data.songs[nextId].artist;
                    }
                });
            }})
            return {nextId, nextTitle, nextCover, nextArtist, nextPos};
        }

        getInfoNextFromTB(){
            let nextTitle = "";
            let nextCover = "";
            let nextArtist = "";
            let nextPos = nowPlaying.positionInList+1;
            return {nextTitle, nextCover, nextArtist, nextPos};
            }

        
}

let tableFrames = [];

function likesToArr(outputFn){
    $.ajax({
        url: "./scripts/php/likesToArr.php",
        type: "GET",
        dataType: "json",
        success: function(data) {
            outputFn(data);
        },error: function(xhr, ajaxOptions, thrownError){
           // err
        }
    });
 }

 function listensToArr(outputFn){
    $.ajax({
        url: "./scripts/php/listensToArr.php",
        type: "GET",
        dataType: "json",
        success: function(data) {
            outputFn(data);
        },error: function(xhr, ajaxOptions, thrownError){
            // err
        }
    });
 }

 function downloadsToArr(outputFn){
    $.ajax({
        url: "./scripts/php/downloadsToArr.php",
        type: "GET",
        dataType: "json",
        success: function(data) {
            outputFn(data);
        },error: function(xhr, ajaxOptions, thrownError){
            // err
        }
    });
 }

function genCatFrames(categoryId, rowLocation){
    $.ajax({ 
        type: 'GET', 
        url: './res/track-data/categories.json', 
        data: { get_param: 'value' }, 
        dataType: 'json',
        success: function (data) {
            tableFrames[rowLocation] = [];
            let listLength = data.categories[categoryId].list.length; // tracks count in category
            $(`#selec${rowLocation}.selec`).find(".hgrp").append(`<h2>${data.categories[categoryId].name}</h2>`); // displays the category name
            $(`#selec${rowLocation}.selec`).find(".hgrp").append(`<h3>${data.categories[categoryId].description}</h3>`); // its description as well
            let origin = "category-"+categoryId; // put ID of category in origin var
            for(let i = 0; i < listLength; i++){ // for every track found
                let songId = data.categories[categoryId].list[i];
                let noInList = i;
                tableFrames[rowLocation][i] = new titleFrame(songId, rowLocation, origin, noInList, false);
            }

        }
    });
}

function genTbFrames(source, rowLocation){
    if (source == "likes"){
        likesToArr(function (data){
            tableFrames[rowLocation] = [];
            let listLength = data.length; // same stuff as above
            console.log("longueur de la liste likes : "+ data.length);
            $(`#selec${rowLocation}.selec`).find(".hgrp").append(`<h2>Titres likés</h2>`);
            $(`#selec${rowLocation}.selec`).find(".hgrp").append(`<h3>Vos titres likés apparaissent ici</h3>`);
            let origin = "source-"+source;
            for(let i = 0; i < listLength; i++){
                let songId = data[i];
                let noInList = i;
                tableFrames[rowLocation][i] = new titleFrame(songId, rowLocation, origin, noInList, true);
            }
        }) 
    }

    if (source == "listens"){
        listensToArr(function (data){
            tableFrames[rowLocation] = [];
            let listLength = data.length;
            $(`#selec${rowLocation}.selec`).find(".hgrp").append(`<h2>Titres écoutés</h2>`);
            $(`#selec${rowLocation}.selec`).find(".hgrp").append(`<h3>Vos titres écoutés apparaissent ici</h3>`);
            let origin = "source-"+source;
            for(let i = 0; i < listLength; i++){
                let songId = data[i];
                let noInList = i;
                tableFrames[rowLocation][i] = new titleFrame(songId, rowLocation, origin, noInList, true);
            }
        }) 
    }

    if (source == "downloads"){
        downloadsToArr(function (data){
            tableFrames[rowLocation] = [];
            let listLength = data.length;
            $(`#selec${rowLocation}.selec`).find(".hgrp").append(`<h2>Titres téléchargés</h2>`);
            $(`#selec${rowLocation}.selec`).find(".hgrp").append(`<h3>Vos titres téléchargés apparaissent ici</h3>`);
            let origin = "source-"+source;
            for(let i = 0; i < listLength; i++){
                let songId = data[i];
                let noInList = i;
                tableFrames[rowLocation][i] = new titleFrame(songId, rowLocation, origin, noInList, true);
            }
        }) 
    }

}

// genCatFrames(0, 1); - old


export default genCatFrames;
export {genTbFrames, playNext, playPrev};