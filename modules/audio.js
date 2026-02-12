
export default class AudioPlayer {
    constructor() {
        this.tracks = [
            {
                id: 1,
                name: 'Lo-Fi бит',
                icon: '🎵',
                color: '#8b5cf6',
                description: 'Спокойная фоновая музыка',
                frequency: 200,
                type: 'sine'
            },
            {
                id: 2,
                name: 'Дождь',
                icon: '🌧️',
                color: '#3b82f6',
                description: 'Звук дождя для концентрации',
                url: 'https://assets.mixkit.co/sfx/preview/mixkit-rain-loop-1245.mp3'
            },
            {
                id: 3,
                name: 'Кофейня',
                icon: '☕',
                color: '#f59e0b',
                description: 'Фоновый шум кафе',
                url: 'https://assets.mixkit.co/sfx/preview/mixkit-busy-coffee-shop-1012.mp3'
            },
            {
                id: 4,
                name: 'Белый шум',
                icon: '📻',
                color: '#64748b',
                description: 'Монотонный фоновый звук',
                url: 'https://assets.mixkit.co/sfx/preview/mixkit-white-noise-1044.mp3'
            },
            {
                id: 5,
                name: 'Тишина',
                icon: '🔇',
                color: '#ef4444',
                description: 'Без звука',
                url: null
            }
        ];
        
        this.currentTrack = null;
        this.volume = 0.3;
        this.isPlaying = false;
        this.audio = new Audio();
        this.trackListElement = null;
        this.volumeSlider = null;
        this.volumeValue = null;
        

        this.audio.loop = true;
        this.audio.volume = this.volume;
        
        this.init();
    }
    
    init() {
        console.log('🎵 Аудиоплеер инициализируется...');
        this.cacheElements();
        this.renderTrackList();
        this.setupEventListeners();
        this.updateVolumeDisplay();
        
        this.selectTrack(this.tracks[0]);
    }
    
    cacheElements() {
        this.trackListElement = document.getElementById('trackList');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.volumeValue = document.getElementById('volumeValue');
        
        console.log('DOM элементы аудио:', {
            trackList: !!this.trackListElement,
            volumeSlider: !!this.volumeSlider,
            volumeValue: !!this.volumeValue
        });
    }
    
    renderTrackList() {
        if (!this.trackListElement) return;
        
        this.trackListElement.innerHTML = '';
        
        this.tracks.forEach(track => {
            const trackElement = document.createElement('div');
            trackElement.className = 'track-item';
            if (this.currentTrack?.id === track.id) {
                trackElement.classList.add('active');
            }
            
            trackElement.innerHTML = `
                <div class="track-info">
                    <span class="track-icon">${track.icon}</span>
                    <div>
                        <div class="track-name">${track.name}</div>
                        <div class="track-description">${track.description}</div>
                    </div>
                </div>
                <div class="track-controls">
                    ${track.url ? `
                        <button class="icon-btn small play-btn" data-id="${track.id}">
                            <i class="fas fa-${this.isPlaying && this.currentTrack?.id === track.id ? 'pause' : 'play'}"></i>
                        </button>
                    ` : ''}
                </div>
            `;
            

            trackElement.addEventListener('click', (e) => {
                if (!e.target.closest('.play-btn')) {
                    this.selectTrack(track);
                }
            });
            
            this.trackListElement.appendChild(trackElement);
            

            const playBtn = trackElement.querySelector('.play-btn');
            if (playBtn) {
                playBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleTrack(track);
                });
            }
        });
    }
    
    selectTrack(track) {
        console.log('Track selected:', track.name);
        

        this.currentTrack = track;
        

        if (!track.url) {
            this.pause();
            this.showNotification(`${track.icon} ${track.name}`);
            this.renderTrackList();
            return;
        }
        

        if (this.audio.src !== track.url) {
            this.audio.src = track.url;
            this.audio.load();
        }
        

        if (this.isPlaying) {
            this.play();
        }
        
        this.showNotification(`🎵 Is playing now: ${track.name}`);
        this.renderTrackList();
    }
    
    toggleTrack(track) {
        if (this.currentTrack?.id === track.id && this.isPlaying) {
            this.pause();
        } else {
            if (this.currentTrack?.id !== track.id) {
                this.selectTrack(track);
            }
            this.play();
        }
    }
    
    play() {
        if (!this.currentTrack?.url) {
            console.log('There is no track to play');
            return;
        }
        
        this.audio.play()
            .then(() => {
                this.isPlaying = true;
                this.renderTrackList();
                this.showNotification('▶️ Music on');
            })
            .catch(error => {
                console.error('Ошибка воспроизведения:', error);
                this.showNotification('❌ Failed to play music');
            });
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.renderTrackList();
        this.showNotification('⏸️ Music off');
    }
    
    togglePlayback() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    setupEventListeners() {

        this.volumeSlider?.addEventListener('input', (e) => {
            this.setVolume(e.target.value / 100);
        });
        

        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch(e.code) {
                case 'KeyM':
                    e.preventDefault();
                    this.togglePlayback();
                    break;
                case 'BracketLeft':
                    e.preventDefault();
                    this.setVolume(Math.max(0, this.volume - 0.1));
                    break;
                case 'BracketRight':
                    e.preventDefault();
                    this.setVolume(Math.min(1, this.volume + 0.1));
                    break;
                case 'Comma':
                    if (e.ctrlKey) this.previousTrack();
                    break;
                case 'Period':
                    if (e.ctrlKey) this.nextTrack();
                    break;
            }
        });
    }
    
    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        this.audio.volume = this.volume;
        this.updateVolumeDisplay();
        

        localStorage.setItem('audio-volume', this.volume.toString());
    }
    
    updateVolumeDisplay() {
        if (this.volumeSlider) {
            this.volumeSlider.value = this.volume * 100;
        }
        
        if (this.volumeValue) {
            this.volumeValue.textContent = `${Math.round(this.volume * 100)}%`;
        }
    }
    
    previousTrack() {
        const currentIndex = this.tracks.findIndex(t => t.id === this.currentTrack?.id);
        const prevIndex = (currentIndex - 1 + this.tracks.length) % this.tracks.length;
        this.selectTrack(this.tracks[prevIndex]);
    }
    
    nextTrack() {
        const currentIndex = this.tracks.findIndex(t => t.id === this.currentTrack?.id);
        const nextIndex = (currentIndex + 1) % this.tracks.length;
        this.selectTrack(this.tracks[nextIndex]);
    }
    
    showNotification(message) {
        if (window.showNotification) {
            window.showNotification(message, 2000);
        }
    }
    

    getCurrentTrackInfo() {
        return this.currentTrack ? {
            name: this.currentTrack.name,
            duration: this.audio.duration || 'Неизвестно',
            currentTime: this.audio.currentTime || 0,
            volume: this.volume
        } : null;
    }
}