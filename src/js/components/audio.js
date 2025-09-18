export function initCustomAudioPlayers() {
    document.querySelectorAll('.custom-audio-player').forEach(player => {
        const audio = player.querySelector('.audio-element');
        const playPauseBtn = player.querySelector('.play-pause-btn');
        const playIcon = playPauseBtn.querySelector('i');
        const progressBar = player.querySelector('.progress-bar');
        const progressContainer = player.querySelector('.progress-container');
        const timeDisplay = player.querySelector('.time-display');

        const formatTime = (seconds) => {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        };

        audio.addEventListener('loadedmetadata', () => {
            if (audio.duration) {
                timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
            }
        });
        
        playPauseBtn.addEventListener('click', () => {
            if (audio.paused) { audio.play(); playIcon.className = 'fas fa-pause'; } 
            else { audio.pause(); playIcon.className = 'fas fa-play'; }
        });
        
        audio.addEventListener('timeupdate', () => {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
            if (audio.duration) {
                timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
            }
        });
        
        progressContainer.addEventListener('click', (e) => {
            const width = progressContainer.clientWidth;
            const clickX = e.offsetX;
            audio.currentTime = (clickX / width) * audio.duration;
        });

        audio.addEventListener('ended', () => {
            playIcon.className = 'fas fa-play';
            progressBar.style.width = '0%';
        });
    });
}
