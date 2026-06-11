const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressFill = document.getElementById('progressFill');
const currentTimeSpan = document.getElementById('currentTime');
const durationSpan = document.getElementById('duration');
const nowPlayingSpan = document.getElementById('nowPlaying');
const playlistDiv = document.getElementById('playlist');
const vinyl = document.getElementById('vinyl');
const songCountSpan = document.getElementById('songCount');

let songs = [];
let currentSongIndex = 0;
let isPlaying = false;

// لیست آهنگ‌ها - تو اینجا آهنگ‌های خودتو اضافه کن
const songList = [
    {
        title: "آهنگ شماره ۱",
        artist: "Hekmat Music",
        file: "songs/song1.mp3",
        duration: "3:45"
    },
    {
        title: "آهنگ شماره ۲",
        artist: "Hekmat Music",
        file: "songs/song2.mp3",
        duration: "4:20"
    },
    {
        title: "آهنگ شماره ۳",
        artist: "Hekmat Music",
        file: "songs/song3.mp3",
        duration: "5:10"
    }
];

// بارگذاری آهنگ‌ها
function loadSongs() {
    songs = songList;
    displayPlaylist();
    if(songs.length > 0) {
        loadSong(0);
    }
    songCountSpan.textContent = `${songs.length} آهنگ`;
}

// نمایش لیست آهنگ‌ها
function displayPlaylist() {
    playlistDiv.innerHTML = '';
    songs.forEach((song, index) => {
        const songCard = document.createElement('div');
        songCard.className = 'song-card';
        if(index === currentSongIndex) {
            songCard.classList.add('active');
        }
        songCard.innerHTML = `
            <div class="song-icon">🎵</div>
            <div class="song-details">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <div class="song-duration">${song.duration}</div>
        `;
        songCard.onclick = () => playSong(index);
        playlistDiv.appendChild(songCard);
    });
}

// بارگذاری آهنگ
function loadSong(index) {
    currentSongIndex = index;
    const song = songs[index];
    audioPlayer.src = song.file;
    nowPlayingSpan.textContent = song.title;
    updateActiveSong();
}

// پخش آهنگ
function playSong(index) {
    loadSong(index);
    audioPlayer.play();
    isPlaying = true;
    playPauseBtn.textContent = '⏸';
    vinyl.classList.add('playing');
}

// توقف/ادامه
function togglePlay() {
    if(isPlaying) {
        audioPlayer.pause();
        playPauseBtn.textContent = '▶';
        vinyl.classList.remove('playing');
    } else {
        audioPlayer.play();
        playPauseBtn.textContent = '⏸';
        vinyl.classList.add('playing');
    }
    isPlaying = !isPlaying;
}

// آهنگ بعدی
function nextSong() {
    let nextIndex = currentSongIndex + 1;
    if(nextIndex >= songs.length) {
        nextIndex = 0;
    }
    playSong(nextIndex);
}

// آهنگ قبلی
function prevSong() {
    let prevIndex = currentSongIndex - 1;
    if(prevIndex < 0) {
        prevIndex = songs.length - 1;
    }
    playSong(prevIndex);
}

// آپدیت پخش پیشرفت
function updateProgress() {
    if(audioPlayer.duration) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressFill.style.width = `${progress}%`;
        
        currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
        durationSpan.textContent = formatTime(audioPlayer.duration);
    }
}

// فرمت زمان
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// تغییر موقعیت پخش
function setProgress(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = x / width;
    audioPlayer.currentTime = percentage * audioPlayer.duration;
}

// آپدیت آهنگ فعال در لیست
function updateActiveSong() {
    const songCards = document.querySelectorAll('.song-card');
    songCards.forEach((card, index) => {
        if(index === currentSongIndex) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
}

// رویدادها
playPauseBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);
audioPlayer.addEventListener('timeupdate', updateProgress);
audioPlayer.addEventListener('ended', nextSong);
document.querySelector('.progress-bar').addEventListener('click', setProgress);

// شروع
loadSongs();
