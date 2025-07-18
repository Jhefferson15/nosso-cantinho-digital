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
if (document.getElementById('plans-container')) {
    initPlansPage();
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


function initPlansPage() {
    // --- Elementos do DOM ---
    const form = document.getElementById('add-plan-form');
    const textInput = document.getElementById('new-plan-text');
    const dateInput = document.getElementById('new-plan-date');
    const list = document.getElementById('plans-list');
    const progressBar = document.getElementById('plans-progress-bar');
    const progressText = document.getElementById('plans-progress-text');
    const fileInput = document.getElementById('import-file-input');

    // Elementos do Menu de Configurações
    const settingsBtn = document.getElementById('settings-btn');
    const settingsDropdown = document.getElementById('settings-dropdown');
    const importBtn = document.getElementById('dropdown-import-btn');
    const exportBtn = document.getElementById('dropdown-export-btn');

    // Elementos do Modal de Sub-tarefas
    const subtaskModal = document.getElementById('subtask-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtaskList = document.getElementById('modal-subtask-list');
    const modalAddForm = document.getElementById('modal-add-subtask-form');
    const newSubtaskInput = document.getElementById('new-subtask-text');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // --- Dados e Estado ---
    let plans = [];
    let currentPlanInModal = null; // Guarda a referência do plano sendo editado no modal

    // --- Funções de Dados ---
    function loadPlans() {
        const storedPlans = localStorage.getItem('ourPlans');
        if (storedPlans && JSON.parse(storedPlans).length > 0) {
            plans = JSON.parse(storedPlans);
        } else {
            plans = [createVestibularPlan()];
            savePlans();
        }
    }

    function savePlans() {
        localStorage.setItem('ourPlans', JSON.stringify(plans));
    }

    function createVestibularPlan() {
        const studyTopicsText = `* Conceitos básicos, Origem da vida, Níveis de organização\n* Célula procarionte x eucarionte, Organelas, Membrana plasmática\n* Enzimas, Respiração celular, Fermentação\n* DNA, RNA, Duplicação, transcrição e tradução\n* Genética clássica: 1ª e 2ª Leis de Mendel\n* Genética humana: Grupos sanguíneos, Herança ligada ao sexo\n* Biotecnologia: Clonagem, transgênicos, DNA recombinante\n* Teorias evolucionistas, Seleção natural, Evidências da evolução\n* Ecologia básica: População, comunidade, ecossistema, Cadeias alimentares\n* Ciclos biogeoquímicos: Carbono, nitrogênio, água\n* Impactos ambientais: Efeito estufa, poluição, desmatamento\n* Sucessão ecológica e Biomas brasileiros\n* Invertebrados I: Poríferos, Cnidários, Platelmintos, Nematelmintos\n* Invertebrados II: Moluscos, Anelídeos, Artrópodes, Equinodermos\n* Vertebrados: Peixes, Anfíbios, Répteis, Aves e Mamíferos\n* Sistemas do corpo humano I: Digestório, respiratório, circulatório\n* Sistemas do corpo humano II: Excretor, nervoso, endócrino\n* Sistema locomotor e imunológico\n* Reprodução humana e Métodos contraceptivos\n* Hormônios e controle do corpo\n* Botânica I: Briófitas, Pteridófitas\n* Botânica II: Gimnospermas e Angiospermas\n* Fisiologia vegetal: Fotossíntese, transpiração\n* Revisão geral + simulados`;
        
        const subtasks = studyTopicsText.trim().split('\n').map((line, index) => ({
            id: Date.now() + index,
            text: `Semana ${index + 1}: ${line.trim().substring(2)}`,
            completed: false
        }));

        return {
            id: Date.now(),
            text: "Plano Vestibular Juntos",
            completed: false,
            targetDate: null,
            subtasks: subtasks
        };
    }

    // --- Funções de Renderização ---
    function renderPlans() {
        list.innerHTML = '';
        if (plans.length === 0) {
            list.innerHTML = `<p style="text-align: center; color: #aaa; padding: 20px 0;">Nenhum plano adicionado ainda. Vamos sonhar juntos!</p>`;
        }
        
        plans.forEach(plan => {
            const li = createPlanElement(plan);
            list.appendChild(li);
        });

        updateProgress();
        addDragAndDropListeners();
    }

    function createPlanElement(plan) {
        const li = document.createElement('li');
        li.className = `plan-item ${plan.completed ? 'completed' : ''}`;
        li.dataset.id = plan.id;
        li.draggable = true;

        const hasSubtasks = plan.subtasks && plan.subtasks.length > 0;
        const subtaskButton = hasSubtasks ? `<i class="fas fa-list-ul open-modal-btn" title="Ver etapas"></i>` : `<span class="open-modal-btn" style="display: inline-block; width: 24px;"></span>`;
        const checkboxIcon = plan.completed ? 'fa-solid fa-check-square' : 'fa-regular fa-square';
        const dateInfo = plan.targetDate ? `<div class="plan-date-info"><span class="target-date">Meta: ${new Date(plan.targetDate + 'T00:00:00').toLocaleDateString('pt-BR')}</span></div>` : '';

        li.innerHTML = `
            <div class="plan-header">
                ${subtaskButton}
                <i class="plan-checkbox ${checkboxIcon}"></i>
                <div class="plan-details">
                    <span class="plan-text">${plan.text}</span>
                    ${dateInfo}
                </div>
                <div class="plan-actions">
                    <button class="edit-btn" title="Editar"><i class="fas fa-pencil-alt"></i></button>
                    <button class="delete-btn" title="Excluir"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>`;
        return li;
    }

    function createSubPlanElement(subtask) {
        const subLi = document.createElement('li');
        subLi.className = `sub-plan-item ${subtask.completed ? 'completed' : ''}`;
        subLi.dataset.id = subtask.id;
        const checkboxIcon = subtask.completed ? 'fa-solid fa-check-square' : 'fa-regular fa-square';
        
        subLi.innerHTML = `
            <i class="plan-checkbox ${checkboxIcon}"></i>
            <div class="plan-details">
                <span class="plan-text">${subtask.text}</span>
            </div>
            <div class="plan-actions">
                 <button class="delete-btn" title="Excluir"><i class="fas fa-trash-alt"></i></button>
            </div>`;
        return subLi;
    }
    
    function renderSubtasksInModal() {
        if (!currentPlanInModal) return;
        modalSubtaskList.innerHTML = '';
        currentPlanInModal.subtasks.forEach(subtask => {
            const subLi = createSubPlanElement(subtask);
            modalSubtaskList.appendChild(subLi);
        });
    }

    function updateProgress() {
        let totalTasks = 0;
        let completedTasks = 0;
        plans.forEach(plan => {
            if (plan.subtasks && plan.subtasks.length > 0) {
                totalTasks += plan.subtasks.length;
                completedTasks += plan.subtasks.filter(st => st.completed).length;
            } else {
                totalTasks += 1;
                if (plan.completed) completedTasks += 1;
            }
        });
        const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${completedTasks} / ${totalTasks} Etapas Concluídas`;
    }

    // --- Funções de Eventos ---
    function handleMainListClick(e) {
        const mainItem = e.target.closest('.plan-item');
        if (!mainItem) return;

        const mainPlanId = Number(mainItem.dataset.id);
        const mainPlan = plans.find(p => p.id === mainPlanId);

        if (e.target.matches('.open-modal-btn, .open-modal-btn *')) {
            currentPlanInModal = mainPlan;
            openSubtaskModal(mainPlan);
        } else if (e.target.matches('.delete-btn, .delete-btn *')) {
            if (confirm(`Tem certeza que deseja excluir o plano "${mainPlan.text}"?`)) {
                plans = plans.filter(p => p.id !== mainPlanId);
                savePlans();
                renderPlans();
            }
        } else if (e.target.matches('.edit-btn, .edit-btn *')) {
            editPlan(mainItem.querySelector('.plan-header'), mainPlan);
        } else if (e.target.matches('.plan-checkbox, .plan-checkbox *')) {
            mainPlan.completed = !mainPlan.completed;
            if (mainPlan.subtasks) {
                mainPlan.subtasks.forEach(st => st.completed = mainPlan.completed);
            }
            savePlans();
            renderPlans();
        }
    }

    function editPlan(header, plan) {
        const detailsDiv = header.querySelector('.plan-details');
        const originalText = plan.text;
        detailsDiv.innerHTML = `<input type="text" class="edit-input" value="${originalText}">`;
        
        const input = detailsDiv.querySelector('.edit-input');
        input.focus();
        
        const saveEdit = () => {
            const newText = input.value.trim();
            if (newText) plan.text = newText;
            savePlans();
            renderPlans();
        };
        
        input.addEventListener('blur', saveEdit);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') input.blur(); });
    }
    
    // --- Lógica do Modal de Sub-tarefas ---
    function openSubtaskModal(plan) {
        modalTitle.textContent = `Etapas: ${plan.text}`;
        renderSubtasksInModal();
        subtaskModal.classList.add('visible');
    }

    function closeSubtaskModal() {
        subtaskModal.classList.remove('visible');
        currentPlanInModal = null;
        renderPlans(); // Atualiza a lista principal com as mudanças feitas no modal
    }

    function handleModalListClick(e) {
        const subItem = e.target.closest('.sub-plan-item');
        if (!subItem || !currentPlanInModal) return;
        
        const subPlanId = Number(subItem.dataset.id);
        const subPlan = currentPlanInModal.subtasks.find(sp => sp.id === subPlanId);

        if (e.target.matches('.delete-btn, .delete-btn *')) {
            currentPlanInModal.subtasks = currentPlanInModal.subtasks.filter(sp => sp.id !== subPlanId);
        } else if (e.target.matches('.plan-checkbox, .plan-checkbox *')) {
            subPlan.completed = !subPlan.completed;
        }
        
        savePlans();
        renderSubtasksInModal(); // Re-renderiza apenas a lista do modal
    }
    
    modalAddForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = newSubtaskInput.value.trim();
        if (!text || !currentPlanInModal) return;
        
        currentPlanInModal.subtasks.push({
            id: Date.now(),
            text: text,
            completed: false
        });
        
        savePlans();
        renderSubtasksInModal();
        newSubtaskInput.value = '';
    });

    // --- Lógica do Menu de Configurações e I/O ---
    function toggleSettingsMenu() {
        settingsDropdown.classList.toggle('show');
    }
    
    window.addEventListener('click', (e) => {
        if (!settingsBtn.contains(e.target) && !settingsDropdown.contains(e.target)) {
            settingsDropdown.classList.remove('show');
        }
    });

    function exportPlans() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(plans, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `nossos_planos_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        toggleSettingsMenu();
    }

    function importPlans(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                if (Array.isArray(importedData)) {
                     if (confirm("Isso substituirá todos os planos atuais. Deseja continuar?")) {
                        plans = importedData;
                        savePlans();
                        renderPlans();
                     }
                } else {
                    alert("Erro: O arquivo JSON não está no formato esperado (não é um array).");
                }
            } catch (error) {
                alert("Erro ao ler o arquivo. Verifique se é um JSON válido.");
            } finally {
                toggleSettingsMenu();
            }
        };
        reader.readAsText(file);
        fileInput.value = '';
    }
    
    // --- Funções de Drag & Drop ---
    function addDragAndDropListeners() {
        list.querySelectorAll('.plan-item').forEach(item => {
            item.addEventListener('dragstart', () => item.classList.add('dragging'));
            item.addEventListener('dragend', () => item.classList.remove('dragging'));
        });
    }

    list.addEventListener('dragover', e => {
        e.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        if (!draggingItem) return;
        
        const afterElement = getDragAfterElement(list, e.clientY);
        list.insertBefore(draggingItem, afterElement);
    });

    list.addEventListener('drop', () => {
        const newOrderIds = [...list.querySelectorAll('.plan-item')].map(item => Number(item.dataset.id));
        plans.sort((a, b) => newOrderIds.indexOf(a.id) - newOrderIds.indexOf(b.id));
        savePlans();
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.plan-item:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // --- Inicialização e Event Listeners ---
    loadPlans();
    renderPlans();
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = textInput.value.trim();
        if (!text) return;
        plans.unshift({ id: Date.now(), text, completed: false, targetDate: dateInput.value, subtasks: [] });
        savePlans();
        renderPlans();
        form.reset();
    });
    
    list.addEventListener('click', handleMainListClick);
    
    // Listeners do menu de config
    settingsBtn.addEventListener('click', toggleSettingsMenu);
    exportBtn.addEventListener('click', exportPlans);
    importBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', importPlans);

    // Listeners do Modal
    modalCloseBtn.addEventListener('click', closeSubtaskModal);
    modalSubtaskList.addEventListener('click', handleModalListClick);
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