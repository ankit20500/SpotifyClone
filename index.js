let currSong=new Audio();
let currentSongIndex = 0;
let songs;

function minutesAndSecondsFormat(minutes, seconds) {
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${Math.floor(seconds)}` : Math.floor(seconds);
    return `${formattedMinutes}:${formattedSeconds}`;
}
function totalSecondsToMinutesAndSeconds(totalSeconds) {
    if (isNaN(totalSeconds) || totalSeconds < 0) {
        return "Invalid input";
    }
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return minutesAndSecondsFormat(minutes, seconds);
}
async function getsongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.querySelectorAll("a");
    songs = [];
    for (let x = 0; x < as.length; x++) {
        const element = as[x];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
        }
    }
    return songs;
}

const playMusic = (track) => {
    const decodedTrack = decodeURIComponent(track); 
    currSong.src=decodedTrack;
    console.log(decodedTrack);
    currSong.play();
    document.querySelector(".songtime").innerHTML="00:00/00:00";

}

async function main() {
    let songs = await getsongs();
    let songul = document.querySelector(".songs").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songul.innerHTML += `<li>
                <i class="fa-solid fa-music"></i>
                <div class="info">
                    <div>${song}</div>
                </div> <!-- Closing angle bracket was missing here -->
                <span class="play-now" data-song="${song}">Play now</span>
                <i class="fa-solid fa-circle-play"></i>
            </li>`;
    }
    
const elements = document.querySelector('.songs').getElementsByTagName('li');
for (const listItem of elements) {
    listItem.addEventListener("click", (event) => {
        let a = event.currentTarget.querySelector(".info").firstElementChild.innerHTML;
        playMusic(event.currentTarget.querySelector(".info").firstElementChild.innerHTML);
    });
}

let playButton = document.querySelector(".play_buttonInfo");
let pauseButton = playButton.querySelector(".pause");

pauseButton.addEventListener("click", () => {
    if (currSong.paused) {
        currSong.play();
        pauseButton.innerHTML = '<i class="fa-solid fa-circle-pause"></i>';
    } else {
        currSong.pause();
        pauseButton.innerHTML = '<i class="fa-solid fa-circle-play"></i>';
    }
});
currSong.addEventListener("timeupdate",()=>{
    document.querySelector(".songtime").innerHTML=`${totalSecondsToMinutesAndSeconds(currSong.currentTime)}:${totalSecondsToMinutesAndSeconds(currSong.duration)}`;
    document.querySelector(".circle").style.left=(currSong.currentTime/currSong.duration)*100+"%";
})

document.querySelector(".seekbar").addEventListener("click", e => {
    const percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currSong.currentTime=(currSong.duration*percent)/100;
});

let previous=document.querySelector(".previous");
let next=document.querySelector(".next");
previous.addEventListener("click",()=>{
    let index=songs.indexOf(currSong.src);
    if((index-1)>=0){
        playMusic(songs[index-1]);
    }
})
next.addEventListener("click",()=>{
    let index=songs.indexOf(currSong.src);
    if((index+1)<songs.length){
        playMusic(songs[index+1]);
    }
})

document.querySelector(".menu").addEventListener("click",()=>{
    document.querySelector(".left").style.display="block";
})
document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.display="none";
})
}
main();
