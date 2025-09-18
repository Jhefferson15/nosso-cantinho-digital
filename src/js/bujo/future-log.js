import { getData, saveData } from '../components/journal.js';

export default function initFutureLogView() {
    const data = getData();
    const container = document.getElementById('future-log-grid');
    const today = new Date();

    const getMonthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    // Render 6 months starting from the current month
    for (let i = 0; i < 6; i++) {
        const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
        const monthKey = getMonthKey(date);
        const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });

        const card = document.createElement('div');
        card.className = 'future-log-month-card';

        const title = document.createElement('h3');
        title.textContent = monthName;

        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Anote seus planos, eventos e metas...';
        textarea.value = data.futureLog[monthKey] || '';

        // Auto-save on blur (when the user clicks away)
        textarea.addEventListener('blur', () => {
            data.futureLog[monthKey] = textarea.value;
            saveData(data);
        });

        card.appendChild(title);
        card.appendChild(textarea);
        container.appendChild(card);
    }
}
