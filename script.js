console.log("let's write javascript")
let currentSong = new Audio();

//Function to change seconds to minute
function secTomint(seconds){
    if(isNaN(seconds) || seconds < 0){
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingsSecond = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2,'0');
    const formattedSeconds = String(remainingsSecond).padStart(2,'0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(){

    let a = await fetch("http://127.0.0.1:3000/songs");
    let response = await a.text();
    // console.log(response)

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")

    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}
//playMusic Function
const playMusic = (track,pause = false) => {
//   let audio = new Audio("/songs/" + track)
    currentSong.src = "/songs/" + track
    if(!pause){
        
        currentSong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}



async function main(){
    
    //get the list of song
    let songs = await getSongs()

    playMusic(songs[0],true)
    // console.log(songs) //it was to see if we are getting all the songs or not

    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>
        
                            <img class = "invert music" src="music.svg" alt="">
                            <div class="info">
                                <div class="songName">${song.replaceAll("%20"," ")}</div>
                                <div class="songArtist">Darshan Raval</div>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img class="invert playnowsvg" src="play.svg" alt="">
                            </div> </li> `;
    }
    //attach an event listner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{

            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            //function to play the music playmusic(targetMusic)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    //attach an event listner to play next and previous songs

    play.addEventListener("click",() => {
      if(currentSong.paused){
        currentSong.play()
        play.src = "pause.svg"
      } else {
        currentSong.pause()
        play.src = "play.svg"
      }
    })

    //Listen for timeupdate event 
    currentSong.addEventListener("timeupdate",() => {
    //   console.log(currentSong.currentTime, currentSong.duration);
      document.querySelector(".songtime").innerHTML = `${secTomint(currentSong.currentTime)} / ${secTomint(currentSong.duration)}`

      document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%" ;
    })
    
    //Add eventListener for seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

}
main()
