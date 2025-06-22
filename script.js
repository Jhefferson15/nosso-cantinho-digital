document.addEventListener('DOMContentLoaded', () => {

    // --- ROTEADOR SIMPLES ---
    // Verifica a URL ou a presença de um elemento específico na página
    // e executa a função de inicialização correspondente.

    // 1. LÓGICA DA PÁGINA DE LOGIN
    if (document.getElementById('login-form')) {
        initLoginPage();
        return; // Para a execução, pois estamos na tela de login
    }
    
    // 2. LÓGICA DA PÁGINA DE MOMENTOS (SWIPE)
    if (document.querySelector('.card-stack')) {
        initSwipeCards();
    }
    
    // 3. LÓGICA DA PÁGINA DA GALERIA
    if (document.querySelector('.gallery-grid-page')) {
        initLightbox();
    }
    
    // 4. LÓGICA DA PÁGINA DO JOURNAL
    if (document.getElementById('journal-form')) {
        initJournal();
    }
    
    // 5. LÓGICA DA PÁGINA DE PLANOS
    if (document.querySelector('.checklist')) {
        initChecklist();
    }

    // 6. LÓGICA DA PÁGINA DE ÁUDIOS
    if (document.querySelector('.custom-audio-player')) {
        initCustomAudioPlayers();
    }

});

// ==================================================================
//  FUNÇÕES DE INICIALIZAÇÃO PARA CADA PÁGINA
// ==================================================================

function initLoginPage() {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const secretWordInput = document.getElementById('secret-word');
        const errorMessage = document.getElementById('error-message');
        const nossaPalavraSecreta = "amor"; // Troque pela senha de vocês

        if (secretWordInput.value.trim().toLowerCase() === nossaPalavraSecreta) {
            window.location.href = 'momentos.html'; // Redireciona para a tela de swipe
        } else {
            errorMessage.style.display = 'block';
            secretWordInput.focus();
        }
    });
}

function initSwipeCards() {
    const stack = document.querySelector('.card-stack');
    if (!stack || !stack.children.length) return;

    let activeCard = stack.querySelector('.card--photo:last-child');
    if (!activeCard) return;

    function nextCard() {
        if (activeCard) {
            activeCard.style.transition = "transform 1s ease, opacity 1s ease";
            activeCard.remove();
        }
        activeCard = stack.querySelector('.card--photo:last-child');
        if (!activeCard) {
            stack.innerHTML = '<p class="all-seen">Por hoje é tudo, meu amor! ❤️</p>';
        } else {
            addSwipeListeners(activeCard);
        }
    }

    function addSwipeListeners(card) {
        let startX, startY, isDragging = false;

        function onPointerDown(e) {
            e.preventDefault();
            startX = e.clientX || e.touches[0].clientX;
            startY = e.clientY || e.touches[0].clientY;
            isDragging = true;
            card.classList.add('swiping');
            document.addEventListener('mousemove', onPointerMove);
            document.addEventListener('touchmove', onPointerMove, { passive: false });
            document.addEventListener('mouseup', onPointerUp);
            document.addEventListener('touchend', onPointerUp);
        }

        function onPointerMove(e) {
            if (!isDragging) return;
            const currentX = e.clientX || e.touches[0].clientX;
            const currentY = e.clientY || e.touches[0].clientY;
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;
            const rotate = deltaX * 0.1;
            card.style.transform = `translateX(${deltaX}px) translateY(${deltaY}px) rotate(${rotate}deg)`;
        }

        function onPointerUp(e) {
            if (!isDragging) return;
            isDragging = false;
            card.classList.remove('swiping');
            document.removeEventListener('mousemove', onPointerMove);
            document.removeEventListener('touchmove', onPointerMove);
            document.removeEventListener('mouseup', onPointerUp);
            document.removeEventListener('touchend', onPointerUp);

            const decisionThreshold = 100;
            const endX = e.clientX || e.changedTouches[0].clientX;
            const deltaX = endX - startX;

            if (Math.abs(deltaX) > decisionThreshold) {
                const direction = deltaX > 0 ? 1 : -1;
                card.style.transform = `translateX(${direction * 400}px) rotate(${direction * 15}deg)`;
                card.style.opacity = '0';
                setTimeout(nextCard, 300);
            } else {
                card.style.transform = ''; // Volta para o lugar
            }
        }
        
        card.addEventListener('mousedown', onPointerDown);
        card.addEventListener('touchstart', onPointerDown, { passive: false });
    }
    
    addSwipeListeners(activeCard);

    document.getElementById('love-btn').addEventListener('click', () => {
        if (!activeCard) return;
        activeCard.style.transform = 'translateX(400px) rotate(15deg)';
        activeCard.style.opacity = '0';
        setTimeout(nextCard, 300);
    });

    document.getElementById('nope-btn').addEventListener('click', () => {
        if (!activeCard) return;
        activeCard.style.transform = 'translateX(-400px) rotate(-15deg)';
        activeCard.style.opacity = '0';
        setTimeout(nextCard, 300);
    });
}

function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            lightbox.style.display = 'flex';
            lightboxImg.src = item.src;
        });
    });

    function closeLightbox() { lightbox.style.display = 'none'; }
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
}

function initJournal() {
    const journalForm = document.getElementById('journal-form');
    const journalInput = document.getElementById('journal-input');
    const journalEntriesContainer = document.getElementById('journal-entries');

    function getEntries() { return JSON.parse(localStorage.getItem('journalEntries')) || []; }
    function saveEntries(entries) { localStorage.setItem('journalEntries', JSON.stringify(entries)); }
    
    function render() {
        const entries = getEntries();
        journalEntriesContainer.innerHTML = '';
        if (entries.length === 0) {
            journalEntriesContainer.innerHTML = '<p style="text-align: center; color: #aaa;">Nenhuma entrada ainda. Escreva algo!</p>';
            return;
        }
        entries.forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'journal-entry';
            entryDiv.innerHTML = `
                <button class="delete-entry-btn" data-id="${entry.id}">×</button>
                <div class="date">${entry.date}</div>
                <div class="text">${entry.text.replace(/\n/g, '<br>')}</div>
            `;
            journalEntriesContainer.appendChild(entryDiv);
        });
        document.querySelectorAll('.delete-entry-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteEntry(Number(btn.dataset.id)));
        });
    }

    function addEntry(text) {
        const entries = getEntries();
        entries.unshift({
            id: Date.now(),
            date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
            text: text
        });
        saveEntries(entries);
        render();
    }

    function deleteEntry(id) {
        let entries = getEntries();
        entries = entries.filter(entry => entry.id !== id);
        saveEntries(entries);
        render();
    }
    
    journalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = journalInput.value.trim();
        if (text) {
            addEntry(text);
            journalInput.value = '';
        }
    });

    render(); // Carrega as entradas iniciais
}

function initChecklist() {
    const checklistItems = document.querySelectorAll('.checklist li');
    const completedItems = JSON.parse(localStorage.getItem('completedPlans')) || {};

    checklistItems.forEach(item => {
        const itemId = item.dataset.id;
        if (completedItems[itemId]) {
            item.classList.add('completed');
        }
        item.addEventListener('click', () => {
            item.classList.toggle('completed');
            completedItems[itemId] = item.classList.contains('completed');
            localStorage.setItem('completedPlans', JSON.stringify(completedItems));
        });
    });
}

function initCustomAudioPlayers() {
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