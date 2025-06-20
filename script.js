let songs;
let currentFolder;
let currentsong = new Audio();
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currentFolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${folder}`);
  const response = await a.text();
  console.log(response);

  const div = document.createElement("div");
  div.innerHTML += response;

  const anchors = div.getElementsByTagName("a");
  songs = [];

  for (let index = 0; index < anchors.length; index++) {
    const element = anchors[index];
    if (element.href.endsWith("mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  let songUl = document
    .querySelector(".playlist")
    .getElementsByTagName("ul")[0];
  songUl.innerHTML = " ";
  for (const song of songs) {
    songUl.innerHTML += `<li>
                <img class="invert padding" src="music.svg" alt="">
                <div class="songInfo2">
                  <div class="songdetail">${song.replaceAll("%20", " ")}</div>
                  <div class="artistname">Harry</div>

                </div>
                <div class="playbtn">
                  <div class="play">Play Now</div>
                  <img class="invert"src="play.svg" alt="">
                </div>
              </li>`;
  }

  Array.from(
    document.querySelector(".playlist").getElementsByTagName("li")
  ).forEach((element) => {
    element.addEventListener("click", () => {
      console.log(element.getElementsByTagName("div")[1].innerHTML);
      playsong(element.getElementsByTagName("div")[1].innerHTML.trim());
    });
  });
  return songs
}
async function displayAlbums() {
  console.log("displaying albums");
  let  a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  console.log(anchors);
  let cardContainer = document.querySelector(".card-container");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
      let folder = e.href.split("/").slice(-2)[0];
      console.log(folder);
      // Get the metadata of the folder
      let a = await fetch(`/songs/${folder}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div data-folder="${folder}"class="cards">
            <div class="playbutton">
              <img class="buttonr" src="playbutton.svg" alt="" />
            </div>

            <img width="125px"
              src="/songs/${folder}/cover.jpg"
              alt=""
            />
            <h2>${response.title}</h2>
            <p>
              ${response.description}
            </p>
          </div>`;
    }
  }
  Array.from(document.getElementsByClassName("cards")).forEach((e) => {
    console.log(e);
    e.addEventListener("click", async (item) => {
      console.log(item, item.currentTarget.dataset.folder);
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playsong(songs[0])
    });
  });
}

let playsong = (track, pause = false) => {
  currentsong.src = `/${currentFolder}/` + track;
  // let audio=new Audio("/songs/"+track)
  if (!pause) {
    currentsong.play();
    play.src = "pause.svg";
  }

  document.querySelector(".songInfo").innerHTML = decodeURI(track);
};
async function main() {
  await getSongs("songs/favourites");
  playsong(songs[0], true);
  console.log(songs);

  //display all the albums on the page
  await displayAlbums();

  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "pause.svg";
    } else {
      currentsong.pause();
      play.src = "play.svg";
    }
  });

  // Example Usage:

  currentsong.addEventListener("timeupdate", () => {
    console.log(currentsong.currentTime, currentsong.duration);
    document.querySelector(
      ".songDuration"
    ).innerHTML = `${secondsToMinutesSeconds(
      currentsong.currentTime
    )}/${secondsToMinutesSeconds(currentsong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percentage = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percentage + "%";
    currentsong.currentTime = (currentsong.duration * percentage) / 100;
  });
  //previous and next
  document.querySelector(".previous").addEventListener("click", () => {
    console.log("previous");
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playsong(songs[index - 1]);
    }
  });
  document.querySelector(".next").addEventListener("click", () => {
    console.log("next");
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    console.log(index);
    if (index + 1 < songs.length) {
      playsong(songs[index + 1]);
    } else {
      playsong(songs[0]);
    }
  });
  document
    .querySelector(".voldur")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log(e.target.value);
      currentsong.volume = e.target.value / 100;
      if (e.target.value>0){
        document.querySelector(".width>img").src=document.querySelector(".width>img").src.replace("mute.svg","volume.svg")
      }
    });

  document.querySelector(".hamburgerr").addEventListener("click", () => {
    document.querySelector(".right").style.transform = "translateX(0px)";
    document.querySelector(".right").style.width = "44vh";
  });
  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".right").style.transform = "translateX(-2000px)";
    document.querySelector(".right").style.width = "25vh";
  });
  document.querySelector(".width>img").addEventListener("click",(e=>{
    if(e.target.src.includes("volume.svg")){
      e.target.src=e.target.src.replace("volume.svg","mute.svg")
      currentsong.volume=0
      document
    .querySelector(".voldur")
    .getElementsByTagName("input")[0].value=0
    }
    else{
      e.target.src=e.target.src.replace("mute.svg","volume.svg")
      currentsong.volume=.10
      document
    .querySelector(".voldur")
    .getElementsByTagName("input")[0].value=10
    }
  }))
}

main();
