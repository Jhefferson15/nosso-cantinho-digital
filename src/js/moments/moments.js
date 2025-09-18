import { initSwipeView } from './swipe-view.js';
import { initGalleryView } from './gallery-view.js';
import { initModal } from './modal.js';

export function initMomentsPage() {
    const swipeViewBtn = document.getElementById('swipe-view-btn');
    const galleryViewBtn = document.getElementById('gallery-view-btn');
    const swipeView = document.getElementById('swipe-view');
    const galleryView = document.getElementById('gallery-view');

    if (swipeViewBtn && galleryViewBtn && swipeView && galleryView) {
        swipeViewBtn.addEventListener('click', () => {
            swipeViewBtn.classList.add('active');
            galleryViewBtn.classList.remove('active');
            swipeView.classList.add('active');
            galleryView.classList.remove('active');
        });

        galleryViewBtn.addEventListener('click', () => {
            galleryViewBtn.classList.add('active');
            swipeViewBtn.classList.remove('active');
            galleryView.classList.add('active');
            swipeView.classList.remove('active');
            initGalleryView();
        });
    }

    // Initialize modules
    initModal();
    initSwipeView();
    initGalleryView(); // Initial load for the gallery
}
