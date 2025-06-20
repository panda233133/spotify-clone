let songs;
let currentsong=new Audio()
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
  // This function now scans the root /songs/ directory and one level of subdirectories
  // to find all available songs, addressing the issue of not loading songs from folders like 'favourites'.
  const songs = [];
  const rootUrl = 'http://127.0.0.1:3000/songs/';
  
  try {
    const response = await fetch(rootUrl);
    if (!response.ok) {
        console.error("Could not fetch the main songs directory.");
        return [];
    }
    const responseText = await response.text();
    const div = document.createElement('div');
    div.innerHTML = responseText;
    const anchors = div.getElementsByTagName('a');
    const subfolders = [];

    // First, get songs and folders from the root directory
    for (const anchor of anchors) {
        const href = anchor.getAttribute('href');
        // Simple filter to avoid parent directory links or absolute paths on some servers
        if (!href || href.startsWith('?') || href.startsWith('/') || href.includes(':')) continue;

        if (href.endsWith('.mp3')) {
            songs.push(href);
        } else if (href.endsWith('/')) {
            subfolders.push(href);
        }
    }

    // Then, get songs from the discovered subfolders
    for (const folder of subfolders) {
        const subResponse = await fetch(rootUrl + folder);
        if(subResponse.ok){
            const subResponseText = await subResponse.text();
            const subDiv = document.createElement('div');
            subDiv.innerHTML = subResponseText;
            const subAnchors = subDiv.getElementsByTagName('a');
            for (const anchor of subAnchors) {
                const href = anchor.getAttribute('href');
                if (href && href.endsWith('.mp3')) {
                    // We construct the full path relative to the /songs/ directory
                    songs.push(folder + href);
                }
            }
        }
    }
  } catch (e) {
    console.error("Error fetching songs:", e);
  }
  
  return songs;
}
let playsong=((track)=>{
  // let audio=new Audio("/songs/"+track)
  currentsong.src="/songs/"+track
  currentsong.play()
  play.src="pause.svg"
  document.querySelector(".songInfo").innerHTML=decodeURI(track);
 
})
async function main(){
  
     songs =await getSongs();
    console.log(songs)
    let songUl=document.querySelector('.playlist').getElementsByTagName('ul')[0]
    for (const song of songs) {
        songUl.innerHTML+=`<li>
                <img class="invert padding" src="music.svg" alt="">
                <div class="songInfo2">
                  <div class="songdetail">${song.replaceAll("%20"," ")}</div>
                  <div class="artistname">Harry</div>

                </div>
                <div class="playbtn">
                  <div class="play">Play Now</div>
                  <img class="invert"src="play.svg" alt="">
                </div>
              </li>`
       
        
    }
    
   Array.from( document.querySelector('.playlist').getElementsByTagName('li')).forEach(element => {
     element.addEventListener('click',()=>{
       console.log(element.getElementsByTagName('div')[1].innerHTML);
       playsong(element.getElementsByTagName('div')[1].innerHTML.trim())
       
       
    })
    
});
play.addEventListener('click',()=>{
  if(currentsong.paused){
    currentsong.play()
    play.src="pause.svg"
  }
  else{
    currentsong.pause()
    play.src="play.svg"
  }
})

// Example Usage:

currentsong.addEventListener("timeupdate",()=>{
  console.log(currentsong.currentTime,currentsong.duration)
  document.querySelector('.songDuration').innerHTML=`${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
 document.querySelector('.circle').style.left=(currentsong.currentTime/currentsong.duration)*100+"%"
})

document.querySelector(".seekbar").addEventListener("click",(e)=>{
  let percentage=e.offsetX/e.target.getBoundingClientRect().width*100
  document.querySelector(".circle").style.left=percentage+"%"
  currentsong.currentTime=(currentsong.duration*percentage)/100
})
//previous and next 
document.querySelector(".previous").addEventListener("click",()=>{
  console.log("previous");
  let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
  if((index-1)>=0){
    playsong(songs[index-1])
  }
})
document.querySelector(".next").addEventListener("click",()=>{
  console.log("next");
  let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
  console.log(index)
  if((index+1)<songs.length){
    playsong(songs[index+1])
  }
  else{
  playsong(songs[0])
  }

})
document.querySelector(".voldur").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
  console.log(e.target.value)
  currentsong.volume=e.target.value/100
})


}
main()