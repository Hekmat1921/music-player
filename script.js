// ========== هوشمندترین پلیر ==========
class SmartMusicPlayer {
    constructor() {
        this.songs = [];
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.isShuffle = false;
        this.isRepeat = false;
        this.filteredSongs = [];
        this.currentFilter = 'all';
        this.searchQuery = '';
        
        this.initElements();
        this.loadSongsFromGitHub();
        this.attachEvents();
    }

    initElements() {
        this.audio = document.getElementById('audioPlayer');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.repeatBtn = document.getElementById('repeatBtn');
        this.progressFill = document.getElementById('progressFill');
        this.currentTimeSpan = document.getElementById('currentTime');
        this.durationSpan = document.getElementById('duration');
        this.songTitle = document.getElementById('songTitle');
        this.artistName = document.getElementById('artistName');
        this.playlistDiv = document.getElementById('playlist');
        this.vinylDisc = document.getElementById('vinylDisc');
        this.searchInput = document.getElementById('searchInput');
        this.songLinks = document.getElementById('songLinks');
    }

    async loadSongsFromGitHub() {
        // لیست پیش‌فرض آهنگ‌ها (تو میتونی اینجا اضافه کنی)
        this.songs = [
            {
                id: 1,
                title: "آهنگ آرامش",
                artist: "Hekmat",
                file: "songs/song1.mp3",
                duration: "3:45",
                genre: "persian",
                instagram: "https://instagram.com/example",
                video: "https://youtube.com/watch?v=example",
                lyrics: "متن آهنگ آرامش..."
            },
            {
                id: 2,
                title: "شادترین آهنگ",
                artist: "Hekmat Music",
                file: "songs/song2.mp3",
                duration: "4:20",
                genre: "persian",
                instagram: "https://instagram.com/example2",
                video: "https://youtube.com/watch?v=example2",
                lyrics: "متن آهنگ شاد..."
            }
        ];
        
        this.filteredSongs = [...this.songs];
        this.displayPlaylist();
        if(this.songs.length > 0) this.loadSong(0);
    }

    displayPlaylist() {
        let songsToShow = this.filteredSongs;
        
        // اعمال فیلتر ژانر
        if(this.currentFilter !== 'all') {
            songsToShow = songsToShow.filter(s => s.genre === this.currentFilter);
        }
        
        // اعمال جستجو (حتی با تیکه‌ای از متن!)
        if(this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            songsToShow = songsToShow.filter(s => 
                s.title.toLowerCase().includes(query) ||
                s.artist.toLowerCase().includes(query) ||
                (s.lyrics && s.lyrics.toLowerCase().includes(query))
            );
        }
        
        this.filteredSongs = songsToShow;
        this.playlistDiv.innerHTML = '';
        
        songsToShow.forEach((song, idx) => {
            const originalIndex = this.songs.findIndex(s => s.id === song.id);
            const card = document.createElement('div');
            card.className = 'song-card';
            if(originalIndex === this.currentSongIndex) card.classList.add('active');
            
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center">
                    <div>
                        <strong>🎵 ${song.title}</strong><br>
                        <small>${song.artist}</small>
                    </div>
                    <span>${song.duration}</span>
                </div>
            `;
            
            card.onclick = () => this.playSong(originalIndex);
            this.playlistDiv.appendChild(card);
        });
    }

    loadSong(index) {
        const song = this.songs[index];
        if(!song) return;
        
        this.currentSongIndex = index;
        this.audio.src = song.file;
        this.songTitle.textContent = song.title;
        this.artistName.textContent = song.artist;
        
        // آپدیت لینک‌ها
        const links = this.songLinks.querySelectorAll('a');
        if(links[0]) links[0].href = song.instagram || '#';
        if(links[1]) links[1].href = song.video || '#';
        if(links[2]) links[2].onclick = () => alert(song.lyrics || 'متن آهنگی موجود نیست');
        
        this.displayPlaylist();
    }

    playSong(index) {
        this.loadSong(index);
        this.audio.play();
        this.isPlaying = true;
        this.playPauseBtn.textContent = '⏸';
        this.vinylDisc.classList.add('playing');
    }

    togglePlay() {
        if(this.isPlaying) {
            this.audio.pause();
            this.playPauseBtn.textContent = '▶';
            this.vinylDisc.classList.remove('playing');
        } else {
            this.audio.play();
            this.playPauseBtn.textContent = '⏸';
            this.vinylDisc.classList.add('playing');
        }
        this.isPlaying = !this.isPlaying;
    }

    nextSong() {
        let nextIndex;
        if(this.isShuffle) {
            nextIndex = Math.floor(Math.random() * this.songs.length);
        } else {
            nextIndex = (this.currentSongIndex + 1) % this.songs.length;
        }
        this.playSong(nextIndex);
    }

    prevSong() {
        let prevIndex = this.currentSongIndex - 1;
        if(prevIndex < 0) prevIndex = this.songs.length - 1;
        this.playSong(prevIndex);
    }

    updateProgress() {
        if(this.audio.duration) {
            const percent = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressFill.style.width = `${percent}%`;
            this.currentTimeSpan.textContent = this.formatTime(this.audio.currentTime);
            this.durationSpan.textContent = this.formatTime(this.audio.duration);
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    setProgress(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        this.audio.currentTime = percent * this.audio.duration;
    }

    handleSearch() {
        this.searchQuery = this.searchInput.value;
        this.displayPlaylist();
    }

    attachEvents() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        this.nextBtn.addEventListener('click', () => this.nextSong());
        this.prevBtn.addEventListener('click', () => this.prevSong());
        this.shuffleBtn.addEventListener('click', () => {
            this.isShuffle = !this.isShuffle;
            this.shuffleBtn.style.opacity = this.isShuffle ? '1' : '0.5';
        });
        this.repeatBtn.addEventListener('click', () => {
            this.isRepeat = !this.isRepeat;
            this.repeatBtn.style.opacity = this.isRepeat ? '1' : '0.5';
        });
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => {
            if(this.isRepeat) this.playSong(this.currentSongIndex);
            else this.nextSong();
        });
        document.querySelector('.progress-bar').addEventListener('click', (e) => this.setProgress(e));
        this.searchInput.addEventListener('input', () => this.handleSearch());
        
        // فیلترها
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.displayPlaylist();
            });
        });
    }
}

// راه‌اندازی
const player = new SmartMusicPlayer();
