console.log("let's write javascript")
let currentSong = new Audio();
let songs;
let currFolder;

//Function to change seconds to minute
function secTomint(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingsSecond = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingsSecond).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;

    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    // console.log(response)

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")

    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }


    //show all the songs in Left side playlist
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUl.innerHTML = ""
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>
        
                            <img class = "invert music" src="img/music.svg" alt="">
                            <div class="info">
                                <div class="songName">${song.replaceAll("%20", " ")}</div>
                                <div class="songArtist">Darshan Raval</div>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img class="playnowsvg" src="img/play.svg" alt="">
                            </div> </li> `;
    }
    //attach an event listner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {

            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            //function to play the music playmusic(targetMusic)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    return songs
}
//playMusic Function
const playMusic = (track, pause = false) => {
    //   let audio = new Audio("/songs/" + track)
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {

        currentSong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"



}

async function displayAlbums() {
    let a = await fetch(`/songs/`);
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response;

    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for(let index = 0; index < array.length; index++) {
        const e = array[index];


        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0]

            //get metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();

            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
            <div class="play">

                <svg xmlns="http://www.w3.org/2000/svg" height="13.4666mm" width="13.4666mm"
                    viewBox="0 0 847 847">
                    <circle cx="423" cy="423" r="398" fill="#11a739" />
                    <polygon points="642,423 467,322 292,221 292,423 292,625 467,524" fill="#000000" />
                </svg>
            </div>

            <img src="/songs/${folder}/cover.jpeg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
    }

    //load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async (item) => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)

            playMusic(songs[0])

        })

    })
}

async function main() {

    //get the list of song
    await getSongs("songs/ncs")

    playMusic(songs[0], true)
    // console.log(songs) //it was to see if we are getting all the songs or not

    //display all the albums in songs folder
    displayAlbums()


    //attach an event listner to play next and previous songs

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        } else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    //Listen for timeupdate event 
    currentSong.addEventListener("timeupdate", () => {
        //   console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secTomint(currentSong.currentTime)}/ ${secTomint(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //Add eventListener for seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        const percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    //Add eventlistner to hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    //Add eventlistner to close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    //Add eventlistner to play previous and next songs
    previous.addEventListener("click", () => {
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])

        }
    })
    next.addEventListener("click", () => {
        console.log("Next clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])

        }

    })

    //add event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value)
        currentSong.volume = parseInt(e.target.value) / 100

        if(currentSong.volume == 0){
            document.querySelector(".volume>img").src = "img/mute.svg"
        } else {
            document.querySelector(".volume>img").src = "img/volume.svg"
        }
    })

    //add eventlistner to mute on click 
    document.querySelector(".volume>img").addEventListener("click",e => {
      if(e.target.src.includes("img/volume.svg")){
        e.target.src = "img/mute.svg"
        currentSong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0
      } else{
        e.target.src = "img/volume.svg"
        currentSong.volume = .1;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10
      }
    }
    )


}
main()
