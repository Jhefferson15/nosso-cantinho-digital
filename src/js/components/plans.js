// --- API Wrapper Functions ---
const API_URL = '/api/plans';

async function fetchPlans() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao buscar planos.');
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Falha na API:', error);
        // Retorna um array vazio em caso de erro para não quebrar a UI
        return [];
    }
}

async function addPlan(planData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(planData),
        });
        if (!response.ok) throw new Error('Erro ao adicionar plano.');
        return await response.json();
    } catch (error) {
        console.error('Falha na API:', error);
        return null;
    }
}

async function updatePlan(id, planData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(planData),
        });
        if (!response.ok) throw new Error('Erro ao atualizar plano.');
        return await response.json();
    } catch (error) {
        console.error('Falha na API:', error);
        return null;
    }
}

async function deletePlan(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Erro ao deletar plano.');
        return await response.json();
    } catch (error) {
        console.error('Falha na API:', error);
        return null;
    }
}

export function initPlansPage() {
    // --- Elementos do DOM ---
    const form = document.getElementById('add-plan-form');
    const textInput = document.getElementById('new-plan-text');
    const dateInput = document.getElementById('new-plan-date');
    const list = document.getElementById('plans-list');
    const progressBar = document.getElementById('plans-progress-bar');
    const progressText = document.getElementById('plans-progress-text');
    const fileInput = document.getElementById('import-file-input');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsDropdown = document.getElementById('settings-dropdown');
    const importBtn = document.getElementById('dropdown-import-btn');
    const exportBtn = document.getElementById('dropdown-export-btn');
    const subtaskModal = document.getElementById('subtask-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtaskList = document.getElementById('modal-subtask-list');
    const modalAddForm = document.getElementById('modal-add-subtask-form');
    const newSubtaskInput = document.getElementById('new-subtask-text');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // --- Dados e Estado ---
    let plans = [];
    let currentPlanInModal = null;

    // --- Funções de Renderização (semelhantes às anteriores) ---
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
            <div class="plan-details"><span class="plan-text">${subtask.text}</span></div>
            <div class="plan-actions"><button class="delete-btn" title="Excluir"><i class="fas fa-trash-alt"></i></button></div>`;
        return subLi;
    }

    function renderSubtasksInModal() {
        if (!currentPlanInModal) return;
        modalSubtaskList.innerHTML = '';
        currentPlanInModal.subtasks.forEach(subtask => {
            modalSubtaskList.appendChild(createSubPlanElement(subtask));
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

    // --- Funções de Eventos (Adaptadas para API) ---
    async function handleMainListClick(e) {
        const mainItem = e.target.closest('.plan-item');
        if (!mainItem) return;

        const mainPlanId = Number(mainItem.dataset.id);
        const mainPlan = plans.find(p => p.id === mainPlanId);

        if (e.target.matches('.open-modal-btn, .open-modal-btn *')) {
            currentPlanInModal = mainPlan;
            openSubtaskModal(mainPlan);
        } else if (e.target.matches('.delete-btn, .delete-btn *')) {
            if (confirm(`Tem certeza que deseja excluir o plano "${mainPlan.text}"?`)) {
                await deletePlan(mainPlanId);
                await refreshPlans();
            }
        } else if (e.target.matches('.edit-btn, .edit-btn *')) {
            editPlan(mainItem.querySelector('.plan-header'), mainPlan);
        } else if (e.target.matches('.plan-checkbox, .plan-checkbox *')) {
            const newCompletedStatus = !mainPlan.completed;
            if (mainPlan.subtasks) {
                mainPlan.subtasks.forEach(st => st.completed = newCompletedStatus);
            }
            await updatePlan(mainPlanId, { completed: newCompletedStatus, subtasks: mainPlan.subtasks });
            await refreshPlans();
        }
    }

    async function editPlan(header, plan) {
        const detailsDiv = header.querySelector('.plan-details');
        const originalText = plan.text;
        detailsDiv.innerHTML = `<input type="text" class="edit-input" value="${originalText}">`;
        const input = detailsDiv.querySelector('.edit-input');
        input.focus();
        
        const saveEdit = async () => {
            const newText = input.value.trim();
            if (newText && newText !== originalText) {
                await updatePlan(plan.id, { text: newText });
            }
            await refreshPlans();
        };
        
        input.addEventListener('blur', saveEdit);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') input.blur(); });
    }

    // --- Lógica do Modal (Adaptada para API) ---
    function openSubtaskModal(plan) {
        modalTitle.textContent = `Etapas: ${plan.text}`;
        renderSubtasksInModal();
        subtaskModal.classList.add('visible');
    }

    async function closeSubtaskModal() {
        if (currentPlanInModal) {
             // Salva o estado atual do plano (com as subtarefas modificadas) antes de fechar
            await updatePlan(currentPlanInModal.id, { subtasks: currentPlanInModal.subtasks });
        }
        subtaskModal.classList.remove('visible');
        currentPlanInModal = null;
        await refreshPlans();
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
        renderSubtasksInModal(); // Re-renderiza localmente para resposta rápida
    }

    modalAddForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = newSubtaskInput.value.trim();
        if (!text || !currentPlanInModal) return;
        
        currentPlanInModal.subtasks.push({ id: Date.now(), text: text, completed: false });
        renderSubtasksInModal();
        newSubtaskInput.value = '';
    });
    
    // --- Funções de Drag & Drop (Adaptadas para API) ---
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

    list.addEventListener('drop', async () => {
        const newOrderIds = [...list.querySelectorAll('.plan-item')].map(item => Number(item.dataset.id));
        // Envia atualizações de sortOrder para a API
        const updatePromises = newOrderIds.map((id, index) => {
            return updatePlan(id, { sortOrder: index });
        });
        await Promise.all(updatePromises);
        await refreshPlans();
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.plan-item:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
            else return closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    
    // --- Lógica de I/O (simplificada) ---
    // A importação/exportação agora é um recurso do backend, mas podemos manter um botão de exportação no frontend
    function exportPlans() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(plans, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `nossos_planos_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    // --- Inicialização ---
    async function refreshPlans() {
        plans = await fetchPlans();
        renderPlans();
    }

    // Listeners
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = textInput.value.trim();
        if (!text) return;
        await addPlan({ text, completed: false, targetDate: dateInput.value, subtasks: [] });
        await refreshPlans();
        form.reset();
    });
    
    list.addEventListener('click', handleMainListClick);
    settingsBtn.addEventListener('click', () => settingsDropdown.classList.toggle('show'));
    exportBtn.addEventListener('click', exportPlans);
    // A importação agora deve ser um endpoint de API, então o botão do frontend é desativado por enquanto.
    importBtn.style.display = 'none';
    modalCloseBtn.addEventListener('click', closeSubtaskModal);
    modalSubtaskList.addEventListener('click', handleModalListClick);

    // Carregamento inicial
    refreshPlans();
}