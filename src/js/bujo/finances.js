// --- API Wrapper Functions ---
const API_URL = '/api/finances';

async function fetchFinances() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao buscar finanças.');
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Falha na API:', error);
        return [];
    }
}

async function addFinance(transactionData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transactionData),
        });
        if (!response.ok) throw new Error('Erro ao adicionar transação.');
        return await response.json();
    } catch (error) {
        console.error('Falha na API:', error);
        return null;
    }
}

async function deleteFinance(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Erro ao deletar transação.');
        return await response.json();
    } catch (error) {
        console.error('Falha na API:', error);
        return null;
    }
}


export default function initFinancesView() {
    let allTransactions = [];
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

    const formatCurrency = (value) => {
        return (value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const renderFinances = () => {
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        monthYearEl.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;

        const transactionsForMonth = allTransactions.filter(trx => {
            const trxDate = new Date(trx.date);
            return trxDate.getMonth() === currentMonth && trxDate.getFullYear() === currentYear;
        });

        let totalIncome = 0;
        let totalExpenses = 0;

        transactionsListEl.innerHTML = '';
        if (transactionsForMonth.length === 0) {
            transactionsListEl.innerHTML = '<li class="transaction-placeholder">Nenhuma transação este mês.</li>';
        } else {
            transactionsForMonth.forEach(trx => {
                if (trx.type === 'income') totalIncome += trx.amount;
                else totalExpenses += trx.amount;

                const li = document.createElement('li');
                li.className = `transaction-item ${trx.type}`;
                li.innerHTML = `
                    <span>${trx.description}</span>
                    <span class="amount">${formatCurrency(trx.amount)}</span>
                    <button class="bujo-button-icon delete-trx-btn" data-id="${trx.id}">&times;</button>
                `;
                transactionsListEl.appendChild(li);
            });
        }

        const balance = totalIncome - totalExpenses;
        summaryIncomeEl.textContent = formatCurrency(totalIncome);
        summaryExpensesEl.textContent = formatCurrency(totalExpenses);
        summaryBalanceEl.textContent = formatCurrency(balance);
    };

    async function refreshAndRender() {
        allTransactions = await fetchFinances();
        renderFinances();
    }

    addTransactionBtn.addEventListener('click', async () => {
        const description = descriptionEl.value.trim();
        const amount = parseFloat(amountEl.value);
        const type = typeEl.value;
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), new Date().getDate()).toISOString().split('T')[0];


        if (!description || isNaN(amount) || amount <= 0) {
            alert('Por favor, preencha a descrição e um valor válido.');
            return;
        }

        await addFinance({ description, amount, type, date });

        descriptionEl.value = '';
        amountEl.value = '';

        await refreshAndRender();
    });

    transactionsListEl.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-trx-btn')) {
            const id = parseInt(e.target.dataset.id, 10);
            await deleteFinance(id);
            await refreshAndRender();
        }
    });

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderFinances(); // Apenas re-renderiza com os dados já carregados
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderFinances(); // Apenas re-renderiza com os dados já carregados
    });

    refreshAndRender();
}