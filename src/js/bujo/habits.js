import { getData, saveData } from '../components/journal.js';

export default function initHabitsView() {
    const data = getData();
    let currentDate = new Date();

    // DOM Elements
    const monthYearEl = document.getElementById('habits-month-year');
    const prevMonthBtn = document.getElementById('habits-prev-month');
    const nextMonthBtn = document.getElementById('habits-next-month');
    const addHabitBtn = document.getElementById('add-habit-btn');
    const newHabitNameEl = document.getElementById('new-habit-name');
    const gridContainerEl = document.getElementById('habit-tracker-grid-container');

    const getMonthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    const renderHabitGrid = () => {
        gridContainerEl.innerHTML = '';
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const monthKey = getMonthKey(currentDate);
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        monthYearEl.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

        const habitsForMonth = data.habits[monthKey] || {};
        const habitNames = Object.keys(habitsForMonth);

        if (habitNames.length === 0) {
            gridContainerEl.innerHTML = `<div class="habit-tracker-placeholder"><p>Nenhum hábito para este mês. Adicione um para começar!</p></div>`;
            return;
        }

        const table = document.createElement('table');
        table.className = 'habit-tracker-grid';

        const thead = table.createTHead();
        const headerRow = thead.insertRow();
        headerRow.insertCell().textContent = 'Hábito';
        for (let i = 1; i <= daysInMonth; i++) {
            const th = document.createElement('th');
            th.textContent = i;
            headerRow.appendChild(th);
        }

        const tbody = table.createTBody();
        habitNames.forEach(habitName => {
            const habitRow = tbody.insertRow();
            habitRow.insertCell().textContent = habitName;
            const habitData = habitsForMonth[habitName];

            for (let i = 0; i < daysInMonth; i++) {
                const cell = habitRow.insertCell();
                cell.className = 'habit-day-cell';
                cell.dataset.habit = habitName;
                cell.dataset.day = i;
                if (habitData[i]) {
                    cell.classList.add('completed');
                }
            }
        });

        gridContainerEl.appendChild(table);
    };

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderHabitGrid();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderHabitGrid();
    });

    addHabitBtn.addEventListener('click', () => {
        const newName = newHabitNameEl.value.trim();
        const monthKey = getMonthKey(currentDate);

        if (newName) {
            if (!data.habits[monthKey]) {
                data.habits[monthKey] = {};
            }
            if (!data.habits[monthKey][newName]) {
                const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
                data.habits[monthKey][newName] = new Array(daysInMonth).fill(false);
                saveData(data);
                newHabitNameEl.value = '';
                renderHabitGrid();
            } else {
                alert('Este hábito já existe para este mês.');
            }
        }
    });

    gridContainerEl.addEventListener('click', (e) => {
        const cell = e.target.closest('.habit-day-cell');
        if (!cell) return;

        const { habit, day } = cell.dataset;
        const dayIndex = parseInt(day, 10);
        const monthKey = getMonthKey(currentDate);

        const habitData = data.habits[monthKey][habit];
        habitData[dayIndex] = !habitData[dayIndex];
        saveData(data);
        
        cell.classList.toggle('completed');
    });

    renderHabitGrid();
};