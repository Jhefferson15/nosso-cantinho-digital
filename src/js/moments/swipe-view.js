import { momentsService } from './moments-service.js';

let activeCard = null;

function renderSwipeView(container) {
    const moments = momentsService.getMoments();
    container.innerHTML = `
        <div class="card-stack"></div>
        <div id="loading-overlay" class="hidden"><div class="spinner"></div></div>
    `;

    const stack = container.querySelector('.card-stack');

    if (moments.length === 0) {
        stack.innerHTML = '<p class="all-seen">Nenhum momento adicionado ainda.</p>';
        return;
    }

    // Create cards in reverse order for the stack effect
    moments.slice().reverse().forEach(moment => {
        const card = document.createElement('div');
        card.classList.add('card--photo');
        card.style.backgroundImage = `url('${moment.imageUrl}')`;
        card.innerHTML = `
            <div class="swipe-indicator swipe-indicator--love"><i class="fas fa-heart"></i></div>
            <div class="swipe-indicator swipe-indicator--nope"><i class="fas fa-times"></i></div>
            <div class="card-caption">${moment.caption}</div>
        `;
        stack.appendChild(card);
    });

    activeCard = stack.querySelector('.card--photo:last-child');
    addSwipeListeners(activeCard, stack);
}

function nextCard(stack) {
    if (activeCard) {
        activeCard.remove();
    }
    activeCard = stack.querySelector('.card--photo:last-child');
    if (!activeCard) {
        stack.innerHTML = '<p class="all-seen">Por hoje é tudo, meu amor! ❤️</p>';
    } else {
        addSwipeListeners(activeCard, stack);
    }
}

function addSwipeListeners(card, stack) {
    if (!card) return;
    let startX, startY, isDragging = false;
    const loveIndicator = card.querySelector('.swipe-indicator--love');
    const nopeIndicator = card.querySelector('.swipe-indicator--nope');

    card.addEventListener('dblclick', () => {
        document.getElementById('add-moment-modal').classList.remove('hidden');
    });

    function onPointerDown(e) {
        e.preventDefault();
        startX = e.clientX || e.touches[0].clientX;
        startY = e.clientY || e.touches[0].clientY;
        isDragging = true;
        card.classList.add('swiping');
        document.addEventListener('mousemove', onPointerMove);
        document.addEventListener('touchmove', onPointerMove, { passive: false });
        document.addEventListener('mouseup', onPointerUp);
        document.addEventListener('touchend', onPointerUp);
    }

    function onPointerMove(e) {
        if (!isDragging) return;
        const currentX = e.clientX || e.touches[0].clientX;
        const deltaX = currentX - startX;
        const rotate = deltaX * 0.1;
        card.style.transform = `translateX(${deltaX}px) rotate(${rotate}deg)`;

        const opacity = Math.min(Math.abs(deltaX) / 100, 1);
        if (deltaX > 0) {
            loveIndicator.style.opacity = opacity;
        } else {
            nopeIndicator.style.opacity = opacity;
        }
    }

    function onPointerUp(e) {
        if (!isDragging) return;
        isDragging = false;
        card.classList.remove('swiping');
        loveIndicator.style.opacity = 0;
        nopeIndicator.style.opacity = 0;

        document.removeEventListener('mousemove', onPointerMove);
        document.removeEventListener('touchmove', onPointerMove);
        document.removeEventListener('mouseup', onPointerUp);
        document.removeEventListener('touchend', onPointerUp);

        const decisionThreshold = 100;
        const deltaX = (e.clientX || e.changedTouches[0].clientX) - startX;

        if (Math.abs(deltaX) > decisionThreshold) {
            const direction = deltaX > 0 ? 1 : -1;
            card.style.transform = `translateX(${direction * 400}px) rotate(${direction * 15}deg)`;
            card.style.opacity = '0';
            setTimeout(() => nextCard(stack), 300);
        } else {
            card.style.transform = '';
        }
    }

    card.addEventListener('mousedown', onPointerDown);
    card.addEventListener('touchstart', onPointerDown, { passive: false });
}

export function initSwipeView() {
    const swipeViewContainer = document.getElementById('swipe-view');
    renderSwipeView(swipeViewContainer);
    // We need a way to re-render when new moments are added.
    // This can be done with a custom event system.
    document.addEventListener('momentsUpdated', () => {
        renderSwipeView(swipeViewContainer);
    });
}
