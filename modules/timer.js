export default class Timer {
    constructor() {
        this.workDuration = 25 * 60;
        this.breakDuration = 5 * 60;

        this.timeLeft = this.workDuration;
        this.isRunning = false;
        this.isWorkSession = true;
        this.intervalID = null;

        this.timeDisplay = null;
        this.sessionTypeDisplay = null;
        this.progressBar = null;


        this.audioContext = null;

        this.init();
    }

    init() {
        console.log("Timer initialize");
        this.cacheElements();
        this.render();
        this.setupEventListeners();
    }

    cacheElements() {
        this.timeDisplay = document.getElementById('timeDisplay');
        this.sessionTypeDisplay = document.getElementById('sessionType');
        this.progressBar = document.querySelector('.progress-bar');

    }

    render() {
        this.updateDisplay();
        this.updateProgress();
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    updateDisplay() {
        if (this.timeDisplay) {
            this.timeDisplay.textContent = this.formatTime(this.timeLeft);
        }

        if (this.sessionTypeDisplay) {
            const type = this.isWorkSession ? 'Work' : 'Break';
            const emoji = this.isWorkSession ? '💼' : '☕';
            this.sessionTypeDisplay.textContent = `${emoji} ${type}`;


            this.sessionTypeDisplay.className = 'badge';
            this.sessionTypeDisplay.classList.add(
                this.isWorkSession ? 'badge-work' : 'badge-break'
            );

        }
    }

    updateProgress() {
        if (!this.progressBar) return;
        
        const totalTime = this.isWorkSession ? this.workDuration : this.breakDuration;
        const progress = ((totalTime - this.timeLeft) / totalTime) * 100;
        

        const radius = 100;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (progress / 100) * circumference;
        

        this.progressBar.style.strokeDasharray = `${circumference}`;
        this.progressBar.style.strokeDashoffset = offset;
        

        this.progressBar.style.stroke = this.isWorkSession ? '#3b82f6' : '#10b981';
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        console.log('Timer is starting');

        this.intervalID = setInterval(() => {
            this.tick();
        }, 1000);

        this.updateButtonStates();
    }

    pause() {
        if (!this.isRunning) return;

        this.isRunning = false;
        clearInterval(this.intervalID);
        this.intervalID = null;
        console.log("Times on pause");

        this.updateButtonStates();
    }

    reset() {
        this.pause();
        this.isWorkSession = true;
        this.timeLeft = this.workDuration;
        this.render();
        console.log('Таймер сброшен');
        
        this.updateButtonStates();
    }

    tick() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.updateDisplay();
            this.updateProgress();
            
            if (this.timeLeft === 10) {
                this.playAlert('almost');
            }
        } else {
            this.playAlert('complete');
            this.switchSession();
        }
    }

    switchSession() {
        this.isWorkSession = !this.isWorkSession;
        this.timeLeft = this.isWorkSession ? this.workDuration : this.breakDuration;
        
        console.log(`Переключение на ${this.isWorkSession ? 'работу' : 'отдых'}`);
        this.updateDisplay();
        this.updateProgress();
        
        this.showSessionNotification();
    }

    updateButtonStates() {
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const resetBtn = document.getElementById('resetBtn');
        
        if (startBtn && pauseBtn && resetBtn) {
            startBtn.disabled = this.isRunning;
            pauseBtn.disabled = !this.isRunning;
            
            const startIcon = startBtn.querySelector('i');
            if (startIcon) {
                startIcon.className = this.isRunning ? 'fas fa-play hidden' : 'fas fa-play';
            }
            
            const pauseIcon = pauseBtn.querySelector('i');
            if (pauseIcon) {
                pauseIcon.className = !this.isRunning ? 'fas fa-pause hidden' : 'fas fa-pause';
            }
        }
    }

    showSessionNotification() {
        const message = this.isWorkSession 
            ? '⏰ Worktime! Focus!' 
            : '🎉 Break! Chill 5 minute';
        
        if (window.showNotification) {
            window.showNotification(message);
        } else {
            alert(message);
        }
    }

    playAlert(type) {
        console.log(`pum pum pum `);
        // song realization
    }

    setupEventListeners() {

        document.getElementById('startBtn')?.addEventListener('click', () => this.start());
        document.getElementById('pauseBtn')?.addEventListener('click', () => this.pause());
        document.getElementById('resetBtn')?.addEventListener('click', () => this.reset());
        

        const workInput = document.getElementById('workTime');
        const breakInput = document.getElementById('breakTime');
        
        if (workInput) {
            workInput.addEventListener('change', (e) => {
                this.workDuration = parseInt(e.target.value) * 60;
                if (!this.isRunning && this.isWorkSession) {
                    this.timeLeft = this.workDuration;
                    this.render();
                }
            });
        }
        
        if (breakInput) {
            breakInput.addEventListener('change', (e) => {
                this.breakDuration = parseInt(e.target.value) * 60;
                if (!this.isRunning && !this.isWorkSession) {
                    this.timeLeft = this.breakDuration;
                    this.render();
                }
            });
        }
        

        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    this.isRunning ? this.pause() : this.start();
                    break;
                case 'KeyR':
                    if (e.ctrlKey) this.reset();
                    break;
            }
        });
    }

    getCurrentDuration() {
        return this.isWorkSession ? this.workDuration : this.breakDuration;
    }
    
    getProgressPercentage() {
        const total = this.getCurrentDuration();
        return ((total - this.timeLeft) / total) * 100;
    }

}