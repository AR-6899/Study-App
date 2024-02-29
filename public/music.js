// console.log('Music script running');
let album = document.getElementsByClassName('album');
let music_bdy = document.querySelector('.music-bdy');
let song_name = document.querySelector('.song-nm');
let song_dur = document.querySelector('.song-dur');
let songs = [];

let prev_btn = document.querySelector('.prev-btn');
let play_btn = document.querySelector('.play-btn');
let next_btn = document.querySelector('.next-btn');
let seek_btn = document.querySelector('.seekbtn');
let seek_bar = document.querySelector('.seekbar');

let currsong = new Audio();
let state = false;

const convertSeconds = (seconds) => {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    return (minutes < 10 ? '0' : '') + minutes + ':' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
}

const getAlbum = async (album) => {
    let x = await fetch(`/music/${album}`);
    let response = await x.json();
    return response;
}

const playSong = (link) => {
    currsong.src = link;
    currsong.play();
    play_btn.innerHTML = `<span class="material-symbols-outlined">
    pause</span>`;
}

const renderAlbum = (songs) => {
    music_bdy.innerHTML = "";
    for (let i = 0; i < songs.length; i++) {
        let title = songs[i].Title;
        let artist = songs[i].Artist;
        let link = songs[i].location;

        let song = document.createElement('div');
        song.className = "song";
        song.innerHTML = `<img src="/assets/music.svg" alt="music" class="song_img"> <div>${title}</div> <div> - </div> <div>${artist}</div>`;
        music_bdy.append(song);

        song.addEventListener('click', () => {
            song_name.innerText = title;
            playSong(link);
            state = true;
        });
    }
}

const Main = () => {
    for (let i of album) {
        i.addEventListener('click', async () => {
            let x = await getAlbum(i.id);
            songs = Array.from(x);
            renderAlbum(songs);
        });
    }

    play_btn.addEventListener('click', () => {
        if (!currsong.paused) {
            currsong.pause();
            play_btn.innerHTML = `<span class="material-symbols-outlined">
            play_arrow</span>`;
        }
        else if (state) {
            currsong.play();
            play_btn.innerHTML = `<span class="material-symbols-outlined">
            pause</span>`;
        }
    });

    next_btn.addEventListener('click', () => {
        if (state) {
            let link, next;
            for (let i = 0; i < songs.length; i++) {
                if (songs[i].Title == song_name.innerText) {
                    next = (i + 1) % songs.length;
                    link = songs[next].location;
                    song_name.innerText = songs[next].Title;
                    playSong(link);
                    break;
                }
            }
            if (!link)
                alert("Select current album");
        }
    });

    prev_btn.addEventListener('click', () => {
        if (state) {
            let link, prev;
            for (let i = 0; i < songs.length; i++) {
                if (songs[i].Title == song_name.innerText) {
                    if (i == 0)
                        prev = songs.length - 1;
                    else
                        prev = i - 1;
                    link = songs[prev].location;
                    song_name.innerText = songs[prev].Title;
                    playSong(link);
                    break;
                }
            }
            if (!link)
                alert("Select current album");
        }
    });

    currsong.addEventListener('timeupdate', () => {
        let x = convertSeconds(Math.round(currsong.currentTime));
        let y = convertSeconds(Math.round(currsong.duration));
        song_dur.innerText = `${x}/${y}`;

        let num1 = currsong.currentTime;
        let num2 = currsong.duration;
        let percent = num1 / num2 * 100;

        if (percent <= 99.5)
            seek_btn.style.left = percent + "%";

        if (currsong.currentTime == currsong.duration) {
            let link, next;
            for (let i = 0; i < songs.length; i++) {
                if (songs[i].Title == song_name.innerText) {
                    next = (i + 1) % songs.length;
                    link = songs[next].location;
                    song_name.innerText = songs[next].Title;
                    playSong(link);
                    break;
                }
            }
            if (!link) {
                play_btn.innerHTML = `<span class="material-symbols-outlined">
            play_arrow</span>`;
            }
        }
    });

    seek_bar.addEventListener('click', e => {
        if (state) {
            let percent = e.offsetX / e.target.getBoundingClientRect().width * 100;
            seek_btn.style.left = percent + "%";
            currsong.currentTime = (currsong.duration * percent) / 100;
        }
    });
}

Main();