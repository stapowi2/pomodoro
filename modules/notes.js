export default class Notes {
    constructor() {
        this.storageKey = 'study-concentrator-notes';
        this.textArea = null;
        this.saveBtn = null;
        this.clearBtn = null;
        this.notes = '';

        this.init();
    }

    init() {
        this.cacheElements();
        this.loadNotes();
        this.setupEventListeners();
        this.render();
    }

    cacheElements() {
        this.textArea = document.getElementById('noteInput');
        this.saveBtn = document.getElementById('saveNote');
        this.clearBtn = document.getElementById('clearNotes');

    }

    loadNotes() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            this.notes = saved || '';
        } catch (error) {
            this.notes = '';
        }
    }

    saveNotes() {
        this.notes = this.textArea?.value || '';
        try {
            localStorage.setItem(this.storageKey, this.notes);
            

            this.showSaveNotification();
        } catch (error) {

            this.showError('failed to save notes');
        }
    }

    clearNotes() {
        if (this.notes.length == 0) {
            this.showNotification('Notes are already empty', 'info');
            return;
        }
        if (confirm("Delete all notes?")) {
            this.notes = '';

            if (this.textArea) {
                this.textArea.value = '';
            }

            try {
                localStorage.removeItem(this.storageKey);
                this.showNotification('Notes deleted', 'success');

            } catch (error) {
                this.showError('failed to clear notes');
            }
        }
    }

    
    setupEventListeners() {
        // auto save when text is changed
        this.textArea?.addEventListener('input', (e) => {
            this.debouncedSave();
        });

        this.saveBtn?.addEventListener('click', () => {
            this.saveNotes();
        });
        

        this.clearBtn?.addEventListener('click', () => {
            this.clearNotes();
        });
        

        document.addEventListener('keydown', (e) => {
            if (e.target !== this.textarea) return;
            

            if ((e.ctrlKey || e.metaKey) && e.code === 'Enter') {
                e.preventDefault();
                this.saveNotes();
            }
            

            if ((e.ctrlKey || e.metaKey) && e.code === 'KeyD') {
                e.preventDefault();
                this.clearNotes();
            }
        });
        

        this.textarea?.addEventListener('blur', () => {
            this.saveNotes();
        });
    }

    render() {
        if (this.textArea && this.notes !== undefined) {
            this.textArea.value = this.notes;

            this.updateStats();
        }
    }

    debouncedSave() {
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
            this.saveNotes();
        }, 1000);
    }

    updateStats() {
        const charCount = this.notes.length;
        const wordCount = this.notes.trim().split(/\s+/).filter(w => w.length > 0).length;
    
    }

    showSaveNotification() {
        const charCount = this.notes.length;
        let message = 'Notes saved';
        
        if (charCount === 0) {
            message = 'Notes cleared';
        } else if (charCount < 100) {
            message = 'Notes saved';
        } else if (charCount < 500) {
            message = 'Great notes! 💡';
        } else {
            message = `Saved ${Math.ceil(charCount/1000)}k symbols ✨`;
        }
        
        this.showNotification(message, 'success');
    }


    showNotification(message, type = 'info') {
        if (window.showNotification) {
            window.showNotification(message);
        } else {
            console.log(`[${type}] ${message}`);
        }
    }
    
    showError(message) {
        this.showNotification(`❌ ${message}`, 'error');
    }
    
    getNotes() {
        return this.notes;
    }

    getWordCount() {
        return this.notes.trim().split(/\s+/).filter(w => w.length > 0).length;
    }
    
    getCharCount() {
        return this.notes.length;
    }
    
    exportNotes() {
        const blob = new Blob([this.notes], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `notes_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

}