import { getData, saveData } from '../components/journal.js';

export default function initFinancesView() {
    const data = getData();
    let currentDate = new Date();

    // DOM Elements
    const monthYearEl = document.getElementById('finances-month-year');
    const prevMonthBtn = document.getElementById('finances-prev-month');
    const nextMonthBtn = document.getElementById('finances-next-month');
    
    const summaryIncomeEl = document.getElementById('summary-income');
    const summaryExpensesEl = document.getElementById('summary-expenses');
    const summaryBalanceEl = document.getElementById('summary-balance');

    const descriptionEl = document.getElementById('transaction-description');
    const amountEl = document.getElementById('transaction-amount');
    const typeEl = document.getElementById('transaction-type');
    const addTransactionBtn = document.getElementById('add-transaction-btn');
    const transactionsListEl = document.getElementById('transactions-list');

    const getMonthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    const formatCurrency = (value) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const renderFinances = () => {
        const monthKey = getMonthKey(currentDate);
        const transactions = data.finances[monthKey] || [];

        monthYearEl.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;

        let totalIncome = 0;
        let totalExpenses = 0;

        transactionsListEl.innerHTML = '';
        if (transactions.length === 0) {
            transactionsListEl.innerHTML = '<li class="transaction-placeholder">Nenhuma transação este mês.</li>';
        } else {
            transactions.forEach((trx, index) => {
                if (trx.type === 'income') {
                    totalIncome += trx.amount;
                } else {
                    totalExpenses += trx.amount;
                }

                const li = document.createElement('li');
                li.className = `transaction-item ${trx.type}`;
                li.innerHTML = `
                    <span>${trx.description}</span>
                    <span class="amount">${formatCurrency(trx.amount)}</span>
                    <button class="bujo-button-icon delete-trx-btn" data-index="${index}">&times;</button>
                `;
                transactionsListEl.appendChild(li);
            });
        }

        const balance = totalIncome - totalExpenses;
        summaryIncomeEl.textContent = formatCurrency(totalIncome);
        summaryExpensesEl.textContent = formatCurrency(totalExpenses);
        summaryBalanceEl.textContent = formatCurrency(balance);
    };

    addTransactionBtn.addEventListener('click', () => {
        const description = descriptionEl.value.trim();
        const amount = parseFloat(amountEl.value);
        const type = typeEl.value;

        if (!description || isNaN(amount) || amount <= 0) {
            alert('Por favor, preencha a descrição e um valor válido.');
            return;
        }

        const monthKey = getMonthKey(currentDate);
        if (!data.finances[monthKey]) {
            data.finances[monthKey] = [];
        }

        data.finances[monthKey].push({ description, amount, type });
        saveData(data);

        descriptionEl.value = '';
        amountEl.value = '';
        renderFinances();
    });

    transactionsListEl.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-trx-btn')) {
            const index = parseInt(e.target.dataset.index, 10);
            const monthKey = getMonthKey(currentDate);
            
            data.finances[monthKey].splice(index, 1);
            saveData(data);
            renderFinances();
        }
    });

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderFinances();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderFinances();
    });

    renderFinances();
}