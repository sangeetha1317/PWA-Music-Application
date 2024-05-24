const addNewSongForm = document.getElementById('music-add-form');
const musicList = document.getElementById('music-list');
const addButton = document.getElementById('add-button');
const message = document.getElementById('message');

let mySongs = [];

function addNewSong(e) {
    e.preventDefault();

    const songTitleInput = document.getElementById("song-title");
    const songArtistInput = document.getElementById("song-artist");
    
    // Validation checks
    const songTitle = songTitleInput.value.trim();
    const songArtist = songArtistInput.value.trim();

    if (songTitle === '' || songArtist === '') {
        message.textContent = 'Please enter both song title and artist.';
        return;
    }

    // If the form is valid, proceed to add the song
    const newSong = {
        songTitle,
        songArtist
    }

    mySongs.push(newSong);

    // Clear input fields after successful submission
    songTitleInput.value = '';
    songArtistInput.value = '';

    populateSongs();

    // Clear message after successful submission
    message.textContent = '';
}

function populateSongs() {
    musicList.innerHTML = "";
    mySongs.forEach((song, i)=>{
        const songCard = `
        <div class="data">
        <h3>${song.songTitle} </h3>
        <p>${song.songArtist} </p>
        </div>`;
    
        const element = document.createElement('div');
        element.innerHTML = songCard;
        musicList.appendChild(element);
    })
}

document.addEventListener("DOMContentLoaded", function() {
    addNewSongForm.addEventListener("submit", function(e) {
        addNewSong(e)
    });
});
