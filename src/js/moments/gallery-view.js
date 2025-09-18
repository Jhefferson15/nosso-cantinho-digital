import { momentsService } from './moments-service.js';

export function initGalleryView() {
    const galleryView = document.getElementById('gallery-view');
    const moments = momentsService.getMoments();

    galleryView.innerHTML = ''; // Clear the view

    if (moments.length === 0) {
        galleryView.innerHTML = '<p class="all-seen">Nenhum momento adicionado ainda.</p>';
        return;
    }

    moments.forEach(moment => {
        const item = document.createElement('div');
        item.classList.add('gallery-item');
        item.innerHTML = `<img src="${moment.imageUrl}" alt="${moment.caption}">`;
        // Add event listener to open the interaction modal later
        galleryView.appendChild(item);
    });
}