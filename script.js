import musicDB from './music-db/music-db.js';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
        .then((registeration) => {
            console.log('Register Success:', registeration);
        })
        .catch((error) => {
            console.log('Register Failed', error);
        });
} else {
    console.log('Service Workers are not supported')
}

const messageOutput = document.getElementById('message-output');
const listOutput = document.getElementById('list-output');
const addNewSongForm = document.getElementById('music-add-form');
const musicList = document.getElementById('music-list');

musicDB.open().then(populateSongs)
    .catch((err) => {
        console.log('Failer to open', err);
        listOutput.innerHTML = `
    <div class='music-not-found'>
    There was an error opening the database.
    Please, check the connection and try again later.
    </div>`;
        document.getElementById('music-add-form').style.display = 'none';
        document.getElementsByClassName('content-heading')[0].style.display = 'none';
        document.getElementsByClassName('content-heading')[1].style.display = 'none';
    })

function addNewSong(e) {
    e.preventDefault();
    let message = []
    const songTitleInput = document.getElementById("song-title");
    const songArtistInput = document.getElementById("song-artist");

    // Validation checks
    const songTitle = songTitleInput.value.trim();
    const songArtist = songArtistInput.value.trim();

    if (songTitle === '' || songArtist === '') {
        message.push('Title and Artist fields are required.')
    }

    // If the form is valid, proceed to add the song
    const newSong = {
        songTitle,
        songArtist,
        songLike: 0
    }

    if (message.length === 0) {
        musicDB.add(newSong.songTitle, newSong.songArtist)
            .then(() => {
                messageOutput.innerHTML = `
                <div class='music-add-success'>
                    Song added successfully!
                </div>`;

                songTitleInput.value = '';
                songArtistInput.value = '';

            }).catch((err) => {
                console.log("Add error:", err);
                messageOutput.innerHTML = `
                <div class='validation-error'>
                    Database Error!
                    <span>Failed to add data to the database</span>
                </div>`;

            })

        populateSongs();

    } else {
        const description = message.join('<br>');
        messageOutput.innerHTML = `
        <div class='validation-error'>
            <span>${description}</span>
        </div>`;
    }
}

function populateSongs() {
    musicDB.getAll()
        .then(displayMusic)
        .catch((err) => {
            console.log('Failed to get songs', err)
        });
}

function displayMusic(music) {
    musicList.innerHTML = '';
    music.forEach((song) => {
        const elemMusic = document.createElement('div');
        elemMusic.className = 'song-item';
        musicList.append(elemMusic);

        const elemTitle = document.createElement('h3');
        elemTitle.innerText = song.songTitle
        elemMusic.append(elemTitle)

        const elemArtistLike = document.createElement('div');
        elemArtistLike.className = 'flex-container';
        const elemArtist = document.createElement('p');
        elemArtist.className = 'song-artist'
        elemArtist.innerText = song.songArtist
        elemArtistLike.append(elemArtist)

        const elemLike = document.createElement('p');
        elemLike.className = 'song-like'
        elemLike.innerText = `Likes: ${song.songLike}`
        elemArtistLike.append(elemLike)

        elemMusic.append(elemArtistLike)

        const br = document.createElement('br');
        elemMusic.append(br)

        const elemLikeRemove = document.createElement('div');
        elemLikeRemove.className = 'flex-container';
        const removeBtn = document.createElement('button');
        removeBtn.className = 'removeBtn';
        removeBtn.innerText = 'Remove';
        elemLikeRemove.append(removeBtn)

        removeBtn.addEventListener('click', () => {
            musicDB.delete(song.id)
            .then(() => { 
                elemMusic.remove() 
            }).catch((err) => { 
                console.log('Failed to Remove:', err) 
            });
        })

        const likeBtn = document.createElement('button');
        likeBtn.innerText = 'Like +1';
        likeBtn.className = 'likeBtn';
        elemLikeRemove.append(likeBtn)

        likeBtn.addEventListener('click', () => {
            song.songLike += 1;
            musicDB.update(song)
            .then(() => { 
                elemLike.innerText = `Likes: ${song.songLike}` 
            }).catch((err) => { 
                console.log('Failed to update:', err) 
            });
        })

        elemMusic.append(elemLikeRemove)

    })
}

document.addEventListener("DOMContentLoaded", function () {
    addNewSongForm.addEventListener("submit", function (e) {
        addNewSong(e)
    });
});
