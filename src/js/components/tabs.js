export function initTabs() {
    const tabContainers = document.querySelectorAll('.tabs-container');

    tabContainers.forEach(container => {
        const tabButtons = container.querySelectorAll('.tab-button');
        const tabContents = container.querySelectorAll('.tab-content');

        container.addEventListener('click', (e) => {
            const clickedTab = e.target.closest('.tab-button');
            if (!clickedTab) return;

            // Remove active class from all buttons and contents
            tabButtons.forEach(button => button.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to the clicked button
            clickedTab.classList.add('active');

            // Add active class to the corresponding content
            const targetContent = container.querySelector(`#${clickedTab.dataset.tabTarget}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}
