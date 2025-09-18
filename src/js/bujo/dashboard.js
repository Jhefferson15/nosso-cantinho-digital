import { getData, saveData } from '../components/journal.js';

export default function initDashboardView() {
    const data = getData();
    const today = new Date();

    const getMonthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const getDayKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const formatCurrency = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // --- WIDGET RENDERERS ---

    function renderWelcomeMessage() {
        const welcomeEl = document.getElementById('bujo-welcome-message');
        if (welcomeEl) {
            welcomeEl.textContent = `Bem-vinda de volta, ${data.user.name}!`;
        }
    }

    function renderFinanceWidget() {
        const container = document.getElementById('finances-summary-widget');
        if (!container) return;

        const monthKey = getMonthKey(today);
        const transactions = data.finances[monthKey] || [];
        
        let totalIncome = 0;
        let totalExpenses = 0;
        transactions.forEach(trx => {
            if (trx.type === 'income') totalIncome += trx.amount;
            else totalExpenses += trx.amount;
        });
        const balance = totalIncome - totalExpenses;

        container.innerHTML = `
            <div class="summary-item income"><h4>Receitas</h4><p>${formatCurrency(totalIncome)}</p></div>
            <div class="summary-item expenses"><h4>Despesas</h4><p>${formatCurrency(totalExpenses)}</p></div>
            <div class="summary-item balance"><h4>Saldo</h4><p>${formatCurrency(balance)}</p></div>
        `;
    }

    function renderDailyLogWidget() {
        const listEl = document.getElementById('daily-log-widget-list');
        if (!listEl) return;

        const dayKey = getDayKey(today);
        const entries = data.monthlyLogs[dayKey] || [];

        listEl.innerHTML = '';
        if (entries.length === 0) {
            listEl.innerHTML = '<li class="log-entry-placeholder">Nenhum registro para hoje.</li>';
            return;
        }

        entries.forEach((entry, index) => {
            const li = document.createElement('li');
            li.className = 'daily-log-item';
            li.dataset.index = index;
            if(entry.completed) li.classList.add('completed');

            li.innerHTML = `
                <input type="checkbox" ${entry.completed ? 'checked' : ''} />
                <span>${entry.type} ${entry.text}</span>
            `;
            listEl.appendChild(li);
        });
    }

    function renderQuickAddWidget() {
        const container = document.getElementById('quick-add-form');
        if (!container) return;

        container.innerHTML = `
            <select id="quick-add-type" class="bujo-input">
                <option value="• Tarefa">• Tarefa</option>
                <option value="o Evento">o Evento</option>
                <option value="– Nota">– Nota</option>
            </select>
            <input type="text" id="quick-add-text" class="bujo-input" placeholder="Escreva sua anotação...">
            <button id="quick-add-btn" class="bujo-button">Adicionar</button>
        `;

        document.getElementById('quick-add-btn').addEventListener('click', () => {
            const type = document.getElementById('quick-add-type').value;
            const textEl = document.getElementById('quick-add-text');
            const text = textEl.value.trim();

            if (text) {
                const dayKey = getDayKey(today);
                if (!data.monthlyLogs[dayKey]) {
                    data.monthlyLogs[dayKey] = [];
                }
                data.monthlyLogs[dayKey].push({ type, text, completed: false });
                saveData(data);
                textEl.value = '';
                renderDailyLogWidget(); // Refresh the log widget
            }
        });
    }

    function renderHabitsWidget() {
        const container = document.getElementById('habits-summary-widget');
        if (!container) return;

        const monthKey = getMonthKey(today);
        const habits = data.habits[monthKey] || {};
        const habitNames = Object.keys(habits);

        container.innerHTML = '';
        if (habitNames.length === 0) {
            container.innerHTML = '<p class="log-entry-placeholder">Nenhum hábito este mês.</p>';
            return;
        }

        habitNames.forEach(name => {
            const habitData = habits[name];
            const completedCount = habitData.filter(Boolean).length;
            const percentage = (completedCount / habitData.length) * 100;

            const item = document.createElement('div');
            item.className = 'habit-summary-item';
            item.innerHTML = `
                <span>${name}</span>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${percentage}%;"></div>
                </div>
            `;
            container.appendChild(item);
        });
    }

    // --- EVENT LISTENERS ---

    function addDailyLogListener() {
        const listEl = document.getElementById('daily-log-widget-list');
        if (!listEl) return;

        listEl.addEventListener('click', (e) => {
            if (e.target.type === 'checkbox') {
                const li = e.target.closest('.daily-log-item');
                const index = parseInt(li.dataset.index, 10);
                const dayKey = getDayKey(today);
                const entry = data.monthlyLogs[dayKey][index];
                if (entry) {
                    entry.completed = !entry.completed;
                    saveData(data);
                    renderDailyLogWidget();
                }
            }
        });
    }

    // --- INITIAL RENDER ---
    renderWelcomeMessage();
    renderFinanceWidget();
    renderQuickAddWidget();
    renderDailyLogWidget();
    renderHabitsWidget();
    addDailyLogListener();
}