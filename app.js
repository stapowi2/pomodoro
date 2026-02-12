
import Timer from './modules/timer.js';
import Notes from './modules/notes.js';
import AudioPlayer from './modules/audio.js';


window.showNotification = function(message, duration = 3000) {
    const notification = document.getElementById('notification');
    const text = document.getElementById('notificationText');
    
    if (!notification || !text) {
        console.log('Уведомление:', message);
        return;
    }
    
    text.textContent = message;
    notification.classList.add('show');
    

    const timeout = setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
    

    const closeBtn = document.getElementById('closeNotification');
    if (closeBtn) {

        closeBtn.replaceWith(closeBtn.cloneNode(true));
        const newCloseBtn = document.getElementById('closeNotification');
        
        newCloseBtn.onclick = () => {
            clearTimeout(timeout);
            notification.classList.remove('show');
        };
    }
};

class App {
    constructor() {
        this.timer = null;
        this.notes = null;
        this.audio = null;
        this.init();
    }
    
    init() {

        
        try {

            this.timer = new Timer();
            this.notes = new Notes();
            this.audio = new AudioPlayer();
            

            this.initTheme();
            

            this.loadAudioVolume();
            

            setTimeout(() => {
                showNotification('🎯 Концентратор готов! Space - таймер, M - музыка, Ctrl+Enter - сохранить');
            }, 1000);
            

            window.appInstance = this;
            
            console.log('✅ Все модули загружены!');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации:', error);
            showNotification('Ошибка загрузки приложения', 5000);
        }
    }
    
    initTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const savedTheme = localStorage.getItem('theme') || 'dark';
        

        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
        }
        

        themeToggle?.addEventListener('click', () => {
            const isLight = document.body.classList.toggle('light-theme');
            const newTheme = isLight ? 'light' : 'dark';
            

            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
            }
            

            localStorage.setItem('theme', newTheme);
            
            showNotification(`Тема изменена на ${isLight ? 'светлую' : 'тёмную'}`);
        });
        

        const icon = themeToggle?.querySelector('i');
        if (icon) {
            icon.className = savedTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
    
    loadAudioVolume() {
        const savedVolume = localStorage.getItem('audio-volume');
        if (savedVolume && this.audio) {
            const volume = parseFloat(savedVolume);
            if (!isNaN(volume)) {
                this.audio.setVolume(volume);
            }
        }
    }
    

    getStatus() {
        return {
            timer: {
                isRunning: this.timer?.isRunning,
                timeLeft: this.timer?.formatTime(this.timer?.timeLeft),
                sessionType: this.timer?.isWorkSession ? 'work' : 'break'
            },
            notes: {
                charCount: this.notes?.getCharCount(),
                wordCount: this.notes?.getWordCount()
            },
            audio: {
                currentTrack: this.audio?.currentTrack?.name,
                isPlaying: this.audio?.isPlaying,
                volume: this.audio?.volume
            }
        };
    }
}


document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});


export { Timer, Notes, AudioPlayer };