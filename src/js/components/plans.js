export function initPlansPage() {
    // O restante do código de initPlansPage continua aqui...
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
        const studyTopicsText = `* Conceitos básicos, Origem da vida, Níveis de organização
* Célula procarionte x eucarionte, Organelas, Membrana plasmática
* Enzimas, Respiração celular, Fermentação
* DNA, RNA, Duplicação, transcrição e tradução
* Genética clássica: 1ª e 2ª Leis de Mendel
* Genética humana: Grupos sanguíneos, Herança ligada ao sexo
* Biotecnologia: Clonagem, transgênicos, DNA recombinante
* Teorias evolucionistas, Seleção natural, Evidências da evolução
* Ecologia básica: População, comunidade, ecossistema, Cadeias alimentares
* Ciclos biogeoquímicos: Carbono, nitrogênio, água
* Impactos ambientais: Efeito estufa, poluição, desmatamento
* Sucessão ecológica e Biomas brasileiros
* Invertebrados I: Poríferos, Cnidários, Platelmintos, Nematelmintos
* Invertebrados II: Moluscos, Anelídeos, Artrópodes, Equinodermos
* Vertebrados: Peixes, Anfíbios, Répteis, Aves e Mamíferos
* Sistemas do corpo humano I: Digestório, respiratório, circulatório
* Sistemas do corpo humano II: Excretor, nervoso, endócrino
* Sistema locomotor e imunológico
* Reprodução humana e Métodos contraceptivos
* Hormônios e controle do corpo
* Botânica I: Briófitas, Pteridófitas
* Botânica II: Gimnospermas e Angiospermas
* Fisiologia vegetal: Fotossíntese, transpiração
* Revisão geral + simulados`;
        
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
