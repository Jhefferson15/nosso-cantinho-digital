import { getData, saveData } from '../components/journal.js';

export default function initLogView() {
    const data = getData();
    let currentDate = new Date();
    let selectedDate = new Date();

    const monthYearEl = document.getElementById('log-month-year');
    const calendarGridEl = document.getElementById('log-calendar-grid');
    const prevMonthBtn = document.getElementById('log-prev-month');
    const nextMonthBtn = document.getElementById('log-next-month');
    const dailyLogEntriesEl = document.getElementById('daily-log-entries');
    const selectedDateDisplayEl = document.getElementById('selected-date-display');
    const addEntryBtn = document.getElementById('add-entry-btn');
    const entryTypeEl = document.getElementById('entry-type');
    const entryTextEl = document.getElementById('entry-text');

    const getFormattedDate = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const renderDailyLog = () => {
        const dateKey = getFormattedDate(selectedDate);
        const entries = data.monthlyLogs[dateKey] || [];
        
        dailyLogEntriesEl.innerHTML = '';
        selectedDateDisplayEl.textContent = selectedDate.toLocaleDateString('default', { day: 'numeric', month: 'long' });

        if (entries.length === 0) {
            dailyLogEntriesEl.innerHTML = `<li class="log-entry-placeholder">Nenhum registro para este dia.</li>`;
            return;
        }

        entries.forEach((entry, index) => {
            const li = document.createElement('li');
            li.dataset.index = index;
            if (entry.completed) {
                li.classList.add('completed');
            }

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = entry.completed;
            li.appendChild(checkbox);

            const span = document.createElement('span');
            span.textContent = `${entry.type} ${entry.text}`;
            li.appendChild(span);

            dailyLogEntriesEl.appendChild(li);
        });
    };

    const renderCalendar = () => {
        calendarGridEl.innerHTML = '';
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();

        monthYearEl.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        weekdays.forEach(day => {
            const weekdayEl = document.createElement('div');
            weekdayEl.classList.add('calendar-weekday');
            weekdayEl.textContent = day;
            calendarGridEl.appendChild(weekdayEl);
        });

        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyEl = document.createElement('div');
            emptyEl.classList.add('calendar-day', 'other-month');
            calendarGridEl.appendChild(emptyEl);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayEl = document.createElement('div');
            dayEl.classList.add('calendar-day');
            dayEl.textContent = i;
            dayEl.dataset.day = i;

            const today = new Date();
            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayEl.classList.add('today');
            }

            if (i === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) {
                dayEl.classList.add('selected');
            }

            calendarGridEl.appendChild(dayEl);
        }
    };

    calendarGridEl.addEventListener('click', (e) => {
        const dayEl = e.target.closest('.calendar-day');
        if (!dayEl || dayEl.classList.contains('other-month')) return;

        const day = parseInt(dayEl.dataset.day, 10);
        selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        
        renderCalendar();
        renderDailyLog();
    });

    dailyLogEntriesEl.addEventListener('click', (e) => {
        if (e.target.type === 'checkbox') {
            const li = e.target.closest('li');
            const index = parseInt(li.dataset.index, 10);
            const dateKey = getFormattedDate(selectedDate);
            
            const entry = data.monthlyLogs[dateKey][index];
            if (entry) {
                entry.completed = !entry.completed;
                saveData(data);
                renderDailyLog();
            }
        }
    });

    addEntryBtn.addEventListener('click', () => {
        const type = entryTypeEl.value;
        const text = entryTextEl.value.trim();

        if (text === '') {
            alert('Por favor, escreva algo no registro.');
            return;
        }

        const dateKey = getFormattedDate(selectedDate);
        if (!data.monthlyLogs[dateKey]) {
            data.monthlyLogs[dateKey] = [];
        }

        data.monthlyLogs[dateKey].push({ type, text, completed: false });
        saveData(data);
        renderDailyLog();
        entryTextEl.value = '';
    });

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar();
    renderDailyLog();
}