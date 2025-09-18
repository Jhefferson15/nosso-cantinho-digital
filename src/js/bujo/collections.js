import { getData, saveData } from '../components/journal.js';

export default function initCollectionsView() {
    const data = getData();
    let selectedCollection = null;

    // DOM Elements
    const collectionsListEl = document.getElementById('collections-list');
    const addCollectionBtn = document.getElementById('add-collection-btn');
    const newCollectionNameEl = document.getElementById('new-collection-name');
    const collectionViewEl = document.getElementById('collection-view');
    const collectionSelectPlaceholderEl = document.getElementById('collection-select-placeholder');
    const collectionViewTitleEl = document.getElementById('collection-view-title');
    const collectionItemListEl = document.getElementById('collection-item-list');
    const addItemBtn = document.getElementById('add-item-btn');
    const newItemTextEl = document.getElementById('new-item-text');

    // --- Render Functions ---

    const renderCollectionContent = () => {
        if (!selectedCollection || !data.collections[selectedCollection]) {
            collectionViewEl.classList.add('hidden');
            collectionSelectPlaceholderEl.classList.remove('hidden');
            return;
        }

        collectionViewEl.classList.remove('hidden');
        collectionSelectPlaceholderEl.classList.add('hidden');
        collectionViewTitleEl.textContent = selectedCollection;

        collectionItemListEl.innerHTML = '';
        const items = data.collections[selectedCollection];

        if (items.length === 0) {
            collectionItemListEl.innerHTML = '<li class="collection-item-placeholder">Nenhum item nesta coleção.</li>';
            return;
        }

        items.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item}</span>
                <button class="bujo-button-icon delete-item-btn" data-index="${index}">&times;</button>
            `;
            collectionItemListEl.appendChild(li);
        });
    };

    const renderCollectionsList = () => {
        collectionsListEl.innerHTML = '';
        const collectionNames = Object.keys(data.collections);

        if (collectionNames.length === 0) {
            collectionsListEl.innerHTML = '<li class="collection-list-placeholder">Nenhuma coleção ainda.</li>';
            return;
        }

        collectionNames.forEach(name => {
            const li = document.createElement('li');
            li.dataset.name = name;
            li.className = 'collection-list-item';
            if (name === selectedCollection) {
                li.classList.add('active');
            }
            li.innerHTML = `
                <span>${name}</span>
                <button class="bujo-button-icon delete-collection-btn" data-name="${name}">&times;</button>
            `;
            collectionsListEl.appendChild(li);
        });
    };

    // --- Event Listeners ---

    addCollectionBtn.addEventListener('click', () => {
        const newName = newCollectionNameEl.value.trim();
        if (newName && !data.collections[newName]) {
            data.collections[newName] = [];
            saveData(data);
            newCollectionNameEl.value = '';
            renderCollectionsList();
        } else if (data.collections[newName]) {
            alert('Uma coleção com este nome já existe.');
        }
    });

    addItemBtn.addEventListener('click', () => {
        const newItem = newItemTextEl.value.trim();
        if (newItem && selectedCollection) {
            data.collections[selectedCollection].push(newItem);
            saveData(data);
            newItemTextEl.value = '';
            renderCollectionContent();
        }
    });

    collectionsListEl.addEventListener('click', (e) => {
        const target = e.target;
        
        const listItem = target.closest('.collection-list-item');
        if (listItem && !target.classList.contains('delete-collection-btn')) {
            selectedCollection = listItem.dataset.name;
            renderCollectionsList();
            renderCollectionContent();
            return;
        }

        if (target.classList.contains('delete-collection-btn')) {
            const collectionNameToDelete = target.dataset.name;
            if (confirm(`Tem certeza que deseja apagar a coleção "${collectionNameToDelete}"?`)) {
                delete data.collections[collectionNameToDelete];
                saveData(data);
                if (selectedCollection === collectionNameToDelete) {
                    selectedCollection = null;
                }
                renderCollectionsList();
                renderCollectionContent();
            }
        }
    });

    collectionItemListEl.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-item-btn')) {
            const itemIndexToDelete = parseInt(e.target.dataset.index, 10);
            data.collections[selectedCollection].splice(itemIndexToDelete, 1);
            saveData(data);
            renderCollectionContent();
        }
    });

    // --- Initial Render ---
    renderCollectionsList();
    renderCollectionContent();
};