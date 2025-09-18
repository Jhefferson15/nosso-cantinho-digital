import { getData } from '../components/journal.js';

export default function initGraphView() {

    const loadScript = (url) => {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${url}"]`)) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = url;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
            document.head.appendChild(script);
        });
    };

    const renderFinanceChart = (data) => {
        const container = "#finance-chart-container";
        if (!document.querySelector(container)) return;

        const labels = [];
        const balances = [];
        const today = new Date();

        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const transactions = data.finances[monthKey] || [];

            let totalIncome = 0;
            let totalExpenses = 0;
            transactions.forEach(trx => {
                if (trx.type === 'income') totalIncome += trx.amount;
                else totalExpenses += trx.amount;
            });
            
            labels.push(date.toLocaleString('default', { month: 'short' }));
            balances.push(totalIncome - totalExpenses);
        }

        new frappe.Chart(container, {
            title: "Balanço Mensal",
            data: {
                labels: labels,
                datasets: [
                    {
                        name: "Saldo",
                        values: balances,
                    }
                ],
            },
            type: 'line',
            height: 250,
            colors: ['#007bff']
        });
    };

    const renderHabitsChart = (data) => {
        const container = "#habits-chart-container";
        if (!document.querySelector(container)) return;

        const today = new Date();
        const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
        const habits = data.habits[monthKey] || {};
        const habitNames = Object.keys(habits);

        if (habitNames.length === 0) {
            document.querySelector(container).innerHTML = '<p class="log-entry-placeholder">Nenhum hábito para visualizar este mês.</p>';
            return;
        }

        const labels = [];
        const percentages = [];

        habitNames.forEach(name => {
            const habitData = habits[name];
            const completedCount = habitData.filter(Boolean).length;
            const percentage = Math.round((completedCount / habitData.length) * 100);
            labels.push(name);
            percentages.push(percentage);
        });

        new frappe.Chart(container, {
            title: "Conclusão de Hábitos (%)",
            data: {
                labels: labels,
                datasets: [
                    {
                        name: "Conclusão",
                        values: percentages,
                    }
                ],
            },
            type: 'bar',
            height: 250,
            colors: ['#28a745']
        });
    };

    const CHART_LIB_URL = 'https://cdn.jsdelivr.net/npm/frappe-charts@1.6.2/dist/frappe-charts.min.iife.js';
    
    loadScript(CHART_LIB_URL)
        .then(() => {
            const data = getData();
            renderFinanceChart(data);
            renderHabitsChart(data);
        })
        .catch(error => {
            console.error(error);
            document.querySelector('#finance-chart-container').innerHTML = '<p>Erro ao carregar a biblioteca de gráficos.</p>';
            document.querySelector('#habits-chart-container').innerHTML = '<p>Erro ao carregar a biblioteca de gráficos.</p>';
        });
}